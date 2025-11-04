package com.example.computer_store.controller;

import com.example.computer_store.common.URLConstant;
import com.example.computer_store.request.Auth.*;
import com.example.computer_store.response.Auth.*;
import com.example.computer_store.response.Common.ResponseAPI;
import com.example.computer_store.service.Auth.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController {
    @Autowired
    AuthService authService;

    @PostMapping(URLConstant.AUTH_API.LOGIN)
    public ResponseAPI<LoginResponse> handleLogin(@RequestBody LoginRequest loginRequest){
        return authService.handleLogin(loginRequest);
    }

    @PostMapping(URLConstant.AUTH_API.REGISTER)
    public ResponseAPI<RegisterResponse> handleRegister(@RequestBody RegisterRequest registerRequest){
        return authService.handleRegister(registerRequest);
    }

    @PutMapping(URLConstant.AUTH_API.UPDATE_PROFILE)
    @PreAuthorize("isAuthenticated()")
    public ResponseAPI<UpdateProfileResponse> updateProfile(@RequestBody UpdateProfileRequest updateProfileRequest){
        return authService.updateProfile(updateProfileRequest);
    }

    @PutMapping(URLConstant.AUTH_API.CHANGE_PASSWORD)
    @PreAuthorize("isAuthenticated()")
    public ResponseAPI<ChangePasswordResponse> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest) {
        return authService.changePassword(changePasswordRequest);
    }

    @PostMapping(URLConstant.AUTH_API.FORGOT_PASSWORD)
    public ResponseAPI<ForgotPasswordResponse> handleForgotPassword(@RequestBody ForgotPasswordRequest forgotPasswordRequest) {
        return authService.handleForgotPassword(forgotPasswordRequest);
    }

    @GetMapping(URLConstant.AUTH_API.PROFILE)
    @PreAuthorize("isAuthenticated()")
    public ResponseAPI<ProfileResponse> getProfile() {
        return authService.getProfile();
    }

}
