package com.smartpartybuilding.backend.util;

public final class SimpleHash {
  private SimpleHash() {}

  public static String hashData(String input) {
    if (input == null) {
      input = "";
    }

    int hash = 0;
    for (int i = 0; i < input.length(); i++) {
      int chr = input.charAt(i);
      hash = ((hash << 5) - hash) + chr;
    }

    long positive = Math.abs((long) hash);
    return Long.toString(positive, 36);
  }
}
