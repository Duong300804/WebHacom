package com.example.computer_store.request.Auth;

import lombok.Data;
import org.springframework.util.StringUtils;

@Data
public class ChangePasswordRequest {
    private String oldPassword;
    private String newPassword;
    private String confirmPassword;

    public boolean isValid(){
        if (oldPassword != null) oldPassword = oldPassword.trim();
        if (newPassword != null) newPassword = newPassword.trim();
        if (confirmPassword != null) confirmPassword = confirmPassword.trim();
        return StringUtils.hasText(oldPassword) &&
                StringUtils.hasText(newPassword) &&
                StringUtils.hasText(confirmPassword);
    }
}
