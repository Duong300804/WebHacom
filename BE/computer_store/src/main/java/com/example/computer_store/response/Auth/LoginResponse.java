package com.example.computer_store.response.Auth;

import lombok.Data;

@Data
public class LoginResponse {
    private String username;
    private long id;
    private String role;
    private String accessToken;
    private String tokenType = "Bearer";
}
