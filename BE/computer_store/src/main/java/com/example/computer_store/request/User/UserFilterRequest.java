package com.example.computer_store.request.User;

import lombok.Data;

@Data
public class UserFilterRequest {
    private String username;
    private String email;
    private String role;
    private String fullName;
    private String phone;
    private String address;
    private String position;
}

