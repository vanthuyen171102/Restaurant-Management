package org.kltn.postconnector.api.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Gender {
    MALE("Nam"),
    FEMALE("Nữ");

    private final String value;

    Gender(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
