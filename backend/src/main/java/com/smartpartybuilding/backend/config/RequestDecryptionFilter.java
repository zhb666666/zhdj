package com.smartpartybuilding.backend.config;

import com.smartpartybuilding.backend.util.XorBase64Crypto;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ReadListener;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.util.StreamUtils;
import org.springframework.web.filter.OncePerRequestFilter;

public class RequestDecryptionFilter extends OncePerRequestFilter {
  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    String path = request.getRequestURI();
    if (path.startsWith("/auth")) {
      return true;
    }
    if (path.startsWith("/files")) {
      return true;
    }

    String method = request.getMethod();
    return "GET".equalsIgnoreCase(method) || "HEAD".equalsIgnoreCase(method);
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    String contentType = request.getContentType();
    if (contentType == null || !contentType.toLowerCase().contains(MediaType.APPLICATION_JSON_VALUE)) {
      filterChain.doFilter(request, response);
      return;
    }

    byte[] rawBody = StreamUtils.copyToByteArray(request.getInputStream());
    if (rawBody.length == 0) {
      filterChain.doFilter(request, response);
      return;
    }

    String body = new String(rawBody, StandardCharsets.UTF_8).trim();
    if (body.startsWith("{") || body.startsWith("[")) {
      filterChain.doFilter(request, response);
      return;
    }

    String nonce = request.getHeader("X-Nonce");
    if (nonce == null || nonce.isBlank()) {
      response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
      response.setContentType(MediaType.APPLICATION_JSON_VALUE);
      response.getWriter().write("{\"message\":\"Missing X-Nonce header for encrypted payload\"}");
      return;
    }

    try {
      String decryptedJson = XorBase64Crypto.decryptToString(stripJsonQuotes(body), nonce);
      byte[] decryptedBytes = decryptedJson.getBytes(StandardCharsets.UTF_8);

      HttpServletRequest wrapped = new HttpServletRequestWrapper(request) {
        @Override
        public ServletInputStream getInputStream() {
          ByteArrayInputStream bais = new ByteArrayInputStream(decryptedBytes);
          return new ServletInputStream() {
            @Override
            public boolean isFinished() {
              return bais.available() == 0;
            }

            @Override
            public boolean isReady() {
              return true;
            }

            @Override
            public void setReadListener(ReadListener readListener) {
            }

            @Override
            public int read() {
              return bais.read();
            }
          };
        }

        @Override
        public int getContentLength() {
          return decryptedBytes.length;
        }

        @Override
        public long getContentLengthLong() {
          return decryptedBytes.length;
        }

        @Override
        public String getHeader(String name) {
          return HttpHeaders.CONTENT_LENGTH.equalsIgnoreCase(name) ? String.valueOf(decryptedBytes.length) : super.getHeader(name);
        }
      };

      filterChain.doFilter(wrapped, response);
    } catch (Exception e) {
      response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
      response.setContentType(MediaType.APPLICATION_JSON_VALUE);
      response.getWriter().write("{\"message\":\"Invalid encrypted payload\"}");
    }
  }

  private static String stripJsonQuotes(String body) {
    String trimmed = body.trim();
    if (trimmed.length() >= 2 && ((trimmed.startsWith("\"") && trimmed.endsWith("\"")) || (trimmed.startsWith("'") && trimmed.endsWith("'")))) {
      return trimmed.substring(1, trimmed.length() - 1);
    }
    return trimmed;
  }
}
