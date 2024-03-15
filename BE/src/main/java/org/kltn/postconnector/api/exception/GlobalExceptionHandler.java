package org.kltn.postconnector.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorObject> handleInvalidCredentialsException(InvalidCredentialsException ex, WebRequest request) {
        ErrorObject errorObject = ErrorObject.builder()
                .code(HttpStatus.UNAUTHORIZED.value())
                .message(ex.getMessage())
                .build();

        return new ResponseEntity<>(errorObject, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(JwtValidationException.class)
    public ResponseEntity<ErrorObject> handleJwtValidateException(JwtValidationException ex, WebRequest request) {
        ErrorObject errorObject = ErrorObject.builder()
                .code(HttpStatus.UNAUTHORIZED.value())
                .message(ex.getMessage())
                .build();

        return new ResponseEntity<>(errorObject, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorObject> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        ErrorObject errorObject = ErrorObject.builder()
                .code(HttpStatus.NOT_FOUND.value())
                .message(ex.getMessage())
                .build();

        return new ResponseEntity<>(errorObject, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InternalServerErrorException.class)
    public ResponseEntity<ErrorObject> handleInternalServerException(InternalServerErrorException ex, WebRequest request) {
        ErrorObject errorObject = ErrorObject.builder()
                .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message(ex.getMessage())
                .build();

        return new ResponseEntity<>(errorObject, HttpStatus.INTERNAL_SERVER_ERROR);

    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorObject> handleBadRequestException(BadRequestException ex) {
        ErrorObject errorObject = ErrorObject.builder()
                .code(HttpStatus.BAD_REQUEST.value())
                .message(ex.getMessage())
                .build();

        return new ResponseEntity<>(errorObject, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorObject> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
        ErrorObject errorObject = new ErrorObject();

        errorObject.setCode(HttpStatus.BAD_REQUEST.value());

        // Lấy danh sách lỗi validation từ Exception
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String errorMessage = error.getDefaultMessage();
            errorObject.setMessage(errorMessage);
        });
        return new ResponseEntity<>(errorObject, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorObject> handleMethodArgumentNotValid(Exception ex) {
        ErrorObject errorObject = ErrorObject.builder()
                .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message(ex.getMessage())
                .build();

        System.err.println(ex.toString());

        return new ResponseEntity<>(errorObject, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
