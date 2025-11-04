package com.example.computer_store.request.Auth;

import lombok.Data;
import org.springframework.util.StringUtils;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;

    private static final String USERNAME_REGEX = "^[a-zA-Z0-9]+$";
    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";

    public boolean isValid(){
        if (username != null) username = username.trim();
        if (email != null) email = email.trim();
        if (password != null) password = password.trim();

        return StringUtils.hasText(username) &&
                StringUtils.hasText(email) &&
                StringUtils.hasText(password) &&
                username.matches(USERNAME_REGEX) &&
                email.matches(EMAIL_REGEX);
    }
}
