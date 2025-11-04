package com.example.computer_store.request.Auth;

import lombok.Data;
import org.springframework.util.StringUtils;

@Data
public class LoginRequest {
    private String username;
    private String password;

    public boolean isValid(){
        return StringUtils.hasLength(username) && StringUtils.hasLength(password);
    }
}
