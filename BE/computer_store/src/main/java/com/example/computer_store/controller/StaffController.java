package com.example.computer_store.controller;

import com.example.computer_store.common.URLConstant;
import com.example.computer_store.request.Staff.StaffRequest;
import com.example.computer_store.request.Staff.StaffFilterRequest;
import com.example.computer_store.response.Common.ResponseAPI;
import com.example.computer_store.response.UserResponse;
import com.example.computer_store.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@PreAuthorize("hasRole('ADMIN')")
public class StaffController {
    @Autowired
    UserService userService;

    @GetMapping(URLConstant.STAFF_API.GET_ALL_STAFF)
    public ResponseAPI<List<UserResponse>> getAllStaff() {
        return userService.getAllStaff();
    }

    @GetMapping(URLConstant.STAFF_API.GET_STAFF_BY_ID)
    public ResponseAPI<UserResponse> getStaffById(@PathVariable Long id) {
        return userService.getStaffById(id);
    }

    @PostMapping(URLConstant.STAFF_API.CREATE_STAFF)
    public ResponseAPI<UserResponse> createStaff(@RequestBody StaffRequest staffRequest) {
        return userService.createStaff(staffRequest);
    }

    @PutMapping(URLConstant.STAFF_API.UPDATE_STAFF)
    public ResponseAPI<UserResponse> updateStaff(@PathVariable Long id, @RequestBody StaffRequest staffRequest) {
        return userService.updateStaff(id, staffRequest);
    }

    @DeleteMapping(URLConstant.STAFF_API.DELETE_STAFF)
    public ResponseAPI<String> deleteStaff(@PathVariable Long id) {
        return userService.deleteStaff(id);
    }

    @GetMapping(URLConstant.STAFF_API.SEARCH_STAFF)
    public ResponseAPI<List<UserResponse>> searchStaff(@RequestParam String keyword) {
        return userService.searchStaff(keyword);
    }

    @PostMapping(URLConstant.STAFF_API.FILTER_STAFF)
    public ResponseAPI<List<UserResponse>> filterStaff(@RequestBody StaffFilterRequest filterRequest) {
        return userService.filterStaff(filterRequest);
    }
}