package org.kltn.postconnector.api.exception;

public class JwtValidationException extends RuntimeException{
    public JwtValidationException(String message) {
        super(message);
    }
}
