package com.example.computer_store.request.Auth;

import lombok.Data;
import org.springframework.util.StringUtils;

@Data
public class ForgotPasswordRequest {
    private String username;
    private String email;
    private String newPassword;
    private String confirmPassword;

    public boolean isValid(){
        if (newPassword != null) newPassword = newPassword.trim();
        if (confirmPassword != null) confirmPassword = confirmPassword.trim();
        return  StringUtils.hasText(newPassword) &&
                StringUtils.hasText(confirmPassword) &&
                StringUtils.hasText(username) &&
                StringUtils.hasText(email);
    }
}
