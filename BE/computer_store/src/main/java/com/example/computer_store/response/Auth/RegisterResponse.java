package com.example.computer_store.response.Auth;

import lombok.Data;

@Data
public class RegisterResponse {
    private long id;
    private String username;
    private String email;
    private String role;
    private String accessToken;
    private String tokenType = "Bearer";
}
