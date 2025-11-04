package com.example.computer_store.controller;

import com.example.computer_store.common.URLConstant;
import com.example.computer_store.request.User.UserFilterRequest;
import com.example.computer_store.request.User.UserRequest;
import com.example.computer_store.response.Common.ResponseAPI;
import com.example.computer_store.response.UserResponse;
import com.example.computer_store.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
public class UserController {
    @Autowired
    UserService userService;

    @GetMapping(URLConstant.USER_API.GET_All_USER)
    public ResponseAPI<List<UserResponse>> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping(URLConstant.USER_API.GET_All_ACCOUNT)
    public ResponseAPI<List<UserResponse>> getAllAccount() {
        return userService.getAllAccount();
    }

    @GetMapping(URLConstant.USER_API.GET_USER_BY_ID)
    public ResponseAPI<UserResponse> getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PostMapping(URLConstant.USER_API.CREATE_USER)
    public ResponseAPI<UserResponse> createUser(@RequestBody UserRequest userRequest) {
        return userService.createUser(userRequest);
    }

    @PutMapping(URLConstant.USER_API.UPDATE_USER)
    public ResponseAPI<UserResponse> updateUser(@PathVariable Long id, @RequestBody UserRequest userRequest) {
        return userService.updateUser(id, userRequest);
    }

    @DeleteMapping(URLConstant.USER_API.DELETE_USER)
    public ResponseAPI<String> deleteUser(@PathVariable Long id) {
        return userService.deleteUser(id);
    }

    @GetMapping(URLConstant.USER_API.SEARCH_USER)
    public ResponseAPI<List<UserResponse>> searchUsers(@RequestParam String keyword) {
        return userService.searchUsers(keyword);
    }

    @GetMapping(URLConstant.USER_API.SEARCH_ACCOUNT)
    public ResponseAPI<List<UserResponse>> searchAccounts(@RequestParam String keyword) {
        return userService.searchAccounts(keyword);
    }

    @PostMapping(URLConstant.USER_API.FILTER_USER)
    public ResponseAPI<List<UserResponse>> filterUsers(@RequestBody UserFilterRequest filterRequest) {
        return userService.filterUsers(filterRequest);
    }

    @PostMapping(URLConstant.USER_API.FILTER_ACCOUNT)
    public ResponseAPI<List<UserResponse>> filterAccounts(@RequestBody UserFilterRequest filterRequest) {
        return userService.filterAccounts(filterRequest);
    }

}
