package com.smartpartybuilding.backend.config;

import jakarta.validation.ConstraintViolationException;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
    String message = ex.getBindingResult().getAllErrors().stream()
        .findFirst()
        .map(e -> e.getDefaultMessage() == null ? "Validation error" : e.getDefaultMessage())
        .orElse("Validation error");

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", message));
  }

  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<Map<String, Object>> handleConstraintViolation(ConstraintViolationException ex) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
  }

  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<Map<String, Object>> handleRuntime(RuntimeException ex) {
    HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
    if (ex.getClass().getSimpleName().contains("Unauthorized")) {
      status = HttpStatus.UNAUTHORIZED;
    }
    return ResponseEntity.status(status).body(Map.of("message", ex.getMessage() == null ? status.getReasonPhrase() : ex.getMessage()));
  }
}
