package com.example.computer_store.response.Auth;

import lombok.Data;

@Data
public class ChangePasswordResponse {
    private long id;
    private String username;
    private String email;
}
