package com.example.computer_store.response.Auth;

import lombok.Data;

@Data
public class ForgotPasswordResponse {
    private long id;
    private String username;
    private String email;
}
