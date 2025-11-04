package com.example.computer_store.service;

import com.example.computer_store.common.CommonConstant;
import com.example.computer_store.model.entity.UserEntity;
import com.example.computer_store.repository.UserRepository;
import com.example.computer_store.request.Staff.StaffFilterRequest;
import com.example.computer_store.request.Staff.StaffRequest;
import com.example.computer_store.request.User.UserFilterRequest;
import com.example.computer_store.request.User.UserRequest;
import com.example.computer_store.response.Common.ResponseAPI;
import com.example.computer_store.response.UserResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public ResponseAPI<List<UserResponse>> getAllUsers() {
        try {
            List<UserEntity> users = userRepository.findAll().stream()
                    .filter(user -> CommonConstant.DELETE_FLG.NON_DELETE.equals(user.getDeleteFlag()))
                    .collect(Collectors.toList());
            List<UserResponse> userResponseList = users.stream().map(user -> {
                UserResponse userResponse = new UserResponse();
                userResponse.setId(user.getId());
                userResponse.setUsername(user.getUsername());
                userResponse.setEmail(user.getEmail());
                userResponse.setRole(user.getRole());
                userResponse.setPosition(user.getPosition());
                userResponse.setFullName(user.getFullName());
                userResponse.setPhone(user.getPhone());
                userResponse.setAddress(user.getAddress());
                userResponse.setCreateDate(user.getCreateDate());
                userResponse.setUpdateDate(user.getUpdateDate());
                userResponse.setDeleteFlag(user.getDeleteFlag());
                return userResponse;
            }).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, userResponseList);
        } catch (Exception e) {
//            throw new RuntimeException(e);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to get list user: " + e.getMessage());
        }
    }

    public ResponseAPI<List<UserResponse>> getAllAccount() {
        try {
            List<UserEntity> users = userRepository.findAll().stream()
                    .filter(user -> CommonConstant.DELETE_FLG.NON_DELETE.equals(user.getDeleteFlag()))
                    .filter(user -> user.getUsername() != null && user.getEmail() != null)
                    .collect(Collectors.toList());
            List<UserResponse> userResponseList = users.stream().map(user -> {
                UserResponse userResponse = new UserResponse();
                userResponse.setId(user.getId());
                userResponse.setUsername(user.getUsername());
                userResponse.setEmail(user.getEmail());
                userResponse.setRole(user.getRole());
                userResponse.setPosition(user.getPosition());
                userResponse.setFullName(user.getFullName());
                userResponse.setPhone(user.getPhone());
                userResponse.setAddress(user.getAddress());
                userResponse.setCreateDate(user.getCreateDate());
                userResponse.setUpdateDate(user.getUpdateDate());
                userResponse.setDeleteFlag(user.getDeleteFlag());
                return userResponse;
            }).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, userResponseList);
        } catch (Exception e) {
//            throw new RuntimeException(e);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to get list account: " + e.getMessage());
        }
    }

    public ResponseAPI<UserResponse> getUserById(Long id) {
        try {
            UserEntity user = userRepository.findById(id).orElse(null);
            if (user == null || CommonConstant.DELETE_FLG.DELETE.equals(user.getDeleteFlag())) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_USER);
            }
            UserResponse userResponse = new UserResponse();
            userResponse.setId(user.getId());
            userResponse.setUsername(user.getUsername());
            userResponse.setEmail(user.getEmail());
            userResponse.setRole(user.getRole());
            userResponse.setPosition(user.getPosition());
            userResponse.setFullName(user.getFullName());
            userResponse.setPhone(user.getPhone());
            userResponse.setAddress(user.getAddress());
            userResponse.setCreateDate(user.getCreateDate());
            userResponse.setUpdateDate(user.getUpdateDate());
            userResponse.setDeleteFlag(user.getDeleteFlag());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, userResponse);
        } catch (Exception e) {
//            throw new RuntimeException(e);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to get user: " + e.getMessage());
        }
    }

    public ResponseAPI<UserResponse> createUser(UserRequest userRequest) {
        try {
            if (!userRequest.isValid()) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_VALID, CommonConstant.COMMON_MESSAGE.INVALID_PARAMETER);
            }
            UserEntity existingUser = userRepository.findByUsernameAndDeleteFlag(userRequest.getUsername(), CommonConstant.DELETE_FLG.NON_DELETE);
            if (existingUser != null) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.CONFLICT, CommonConstant.COMMON_MESSAGE.EXIST_USERNAME);
            }
            existingUser = userRepository.findByEmailAndDeleteFlag(userRequest.getEmail(), CommonConstant.DELETE_FLG.NON_DELETE);
            if (existingUser != null) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.CONFLICT, CommonConstant.COMMON_MESSAGE.EXIST_EMAIL);
            }
            if (StringUtils.hasText(userRequest.getPhone())){
                existingUser = userRepository.findByPhoneAndDeleteFlag(userRequest.getPhone(), CommonConstant.DELETE_FLG.NON_DELETE);
                if (existingUser != null) {
                    return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.CONFLICT, CommonConstant.COMMON_MESSAGE.EXIST_PHONE);
                }
            }
            UserEntity user = new UserEntity();
            user.setUsername(userRequest.getUsername());
            user.setEmail(userRequest.getEmail());
            user.setPassword(userRequest.getPassword());
            user.setRole(userRequest.getRole());
            user.setPosition(userRequest.getPosition() != null ? userRequest.getPosition().toUpperCase() : null);
            user.setFullName(userRequest.getFullName());
            user.setPhone(userRequest.getPhone());
            user.setAddress(userRequest.getAddress());
            user.setCreateDate(new Date());
            user.setDeleteFlag(CommonConstant.DELETE_FLG.NON_DELETE);
            userRepository.save(user);
            //Tạo response
            UserResponse userResponse = new UserResponse();
            userResponse.setId(user.getId());
            userResponse.setUsername(user.getUsername());
            userResponse.setEmail(user.getEmail());
            userResponse.setRole(user.getRole());
            userResponse.setPosition(user.getPosition());
            userResponse.setFullName(user.getFullName());
            userResponse.setPhone(user.getPhone());
            userResponse.setAddress(user.getAddress());
            userResponse.setCreateDate(user.getCreateDate());
            userResponse.setUpdateDate(user.getUpdateDate());
            userResponse.setDeleteFlag(user.getDeleteFlag());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.CREATED, CommonConstant.COMMON_MESSAGE.OK, userResponse);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to create user: " + e.getMessage());
        }
    }

    public ResponseAPI<UserResponse> updateUser(Long id, UserRequest userRequest) {
        try {
            UserEntity user = userRepository.findById(id).orElse(null);
            if (user == null || CommonConstant.DELETE_FLG.DELETE.equals(user.getDeleteFlag())) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_USER);
            }
            if (!userRequest.isValidUpdate()) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_VALID, CommonConstant.COMMON_MESSAGE.INVALID_PARAMETER);
            }
            UserEntity existingUser = userRepository.findByUsernameAndDeleteFlag(userRequest.getUsername(), CommonConstant.DELETE_FLG.NON_DELETE);
            if (existingUser != null && existingUser.getId() != user.getId()) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.CONFLICT, CommonConstant.COMMON_MESSAGE.EXIST_USERNAME);
            }
            existingUser = userRepository.findByEmailAndDeleteFlag(userRequest.getEmail(), CommonConstant.DELETE_FLG.NON_DELETE);
            if (existingUser != null && existingUser.getId() != user.getId()) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.CONFLICT, CommonConstant.COMMON_MESSAGE.EXIST_EMAIL);
            }
            if (StringUtils.hasText(userRequest.getPhone())){
                existingUser = userRepository.findByPhoneAndDeleteFlag(userRequest.getPhone(), CommonConstant.DELETE_FLG.NON_DELETE);
                if (existingUser != null && existingUser.getId() != user.getId()) {
                    return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.CONFLICT, CommonConstant.COMMON_MESSAGE.EXIST_PHONE);
                }
            }
            user.setUsername(userRequest.getUsername());
            user.setEmail(userRequest.getEmail());
            user.setRole(userRequest.getRole());
            user.setPosition(userRequest.getPosition() != null ? userRequest.getPosition().toUpperCase() : null);
            user.setFullName(userRequest.getFullName());
            user.setPhone(userRequest.getPhone());
            user.setAddress(userRequest.getAddress());
            user.setUpdateDate(new Date());
            userRepository.save(user);
            //Tạo response
            UserResponse userResponse = new UserResponse();
            userResponse.setId(user.getId());
            userResponse.setUsername(user.getUsername());
            userResponse.setEmail(user.getEmail());
            userResponse.setRole(user.getRole());
            userResponse.setPosition(user.getPosition());
            userResponse.setFullName(user.getFullName());
            userResponse.setPhone(user.getPhone());
            userResponse.setAddress(user.getAddress());
            userResponse.setCreateDate(user.getCreateDate());
            userResponse.setUpdateDate(user.getUpdateDate());
            userResponse.setDeleteFlag(user.getDeleteFlag());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, userResponse);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to update user: " + e.getMessage());
        }
    }

    public ResponseAPI<String> deleteUser(Long id) {
        try {
            UserEntity user = userRepository.findById(id).orElse(null);
            if (user == null || CommonConstant.DELETE_FLG.DELETE.equals(user.getDeleteFlag())) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_USER);
            }
            //Thêm hậu tố vào username/email của record đang xóa
            String userID = String.valueOf(user.getId());
            user.setUsername(user.getUsername() + "_deleted_" + userID);
            user.setEmail(user.getEmail() + "_deleted_" + userID);
            //Cập nhật các trường khác
            user.setDeleteFlag(CommonConstant.DELETE_FLG.DELETE);
            user.setUpdateDate(new Date());
            userRepository.save(user);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, CommonConstant.COMMON_MESSAGE.USER_DELETED);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to delete user: " + e.getMessage());
        }
    }

    public ResponseAPI<List<UserResponse>> searchUsers(String keyword) {
        try {
            List<UserEntity> users = userRepository.searchUsers(keyword, CommonConstant.DELETE_FLG.NON_DELETE);
            List<UserResponse> userResponseList = users.stream().map(user -> {
                UserResponse userResponse = new UserResponse();
                userResponse.setId(user.getId());
                userResponse.setUsername(user.getUsername());
                userResponse.setEmail(user.getEmail());
                userResponse.setRole(user.getRole());
                userResponse.setFullName(user.getFullName());
                userResponse.setPhone(user.getPhone());
                userResponse.setAddress(user.getAddress());
                userResponse.setCreateDate(user.getCreateDate());
                userResponse.setUpdateDate(user.getUpdateDate());
                userResponse.setDeleteFlag(user.getDeleteFlag());
                return userResponse;
            }).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, userResponseList);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to search users: " + e.getMessage());
        }
    }

    public ResponseAPI<List<UserResponse>> searchAccounts(String keyword) {
        try {
            List<UserEntity> users = userRepository.searchUsers(keyword, CommonConstant.DELETE_FLG.NON_DELETE)
                    .stream()
                    // chỉ lấy những record có account thực sự
                    .filter(user -> user.getUsername() != null && user.getEmail() != null)
                    .collect(Collectors.toList());
            List<UserResponse> userResponseList = users.stream().map(user -> {
                UserResponse userResponse = new UserResponse();
                userResponse.setId(user.getId());
                userResponse.setUsername(user.getUsername());
                userResponse.setEmail(user.getEmail());
                userResponse.setRole(user.getRole());
                userResponse.setPosition(user.getPosition());
                userResponse.setFullName(user.getFullName());
                userResponse.setPhone(user.getPhone());
                userResponse.setAddress(user.getAddress());
                userResponse.setCreateDate(user.getCreateDate());
                userResponse.setUpdateDate(user.getUpdateDate());
                userResponse.setDeleteFlag(user.getDeleteFlag());
                return userResponse;
            }).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, userResponseList);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to search accounts: " + e.getMessage());
        }
    }

    public ResponseAPI<List<UserResponse>> filterUsers(UserFilterRequest filterRequest) {
        try {
            List<UserEntity> users = userRepository.filterUsers(
                    filterRequest.getUsername(),
                    filterRequest.getEmail(),
                    filterRequest.getRole(),
                    filterRequest.getPosition(),
                    filterRequest.getFullName(),
                    filterRequest.getPhone(),
                    filterRequest.getAddress(),
                    CommonConstant.DELETE_FLG.NON_DELETE
            );
            List<UserResponse> userResponseList = users.stream().map(user -> {
                UserResponse userResponse = new UserResponse();
                userResponse.setId(user.getId());
                userResponse.setUsername(user.getUsername());
                userResponse.setEmail(user.getEmail());
                userResponse.setRole(user.getRole());
                userResponse.setFullName(user.getFullName());
                userResponse.setPhone(user.getPhone());
                userResponse.setAddress(user.getAddress());
                userResponse.setPosition(user.getPosition());
                userResponse.setCreateDate(user.getCreateDate());
                userResponse.setUpdateDate(user.getUpdateDate());
                userResponse.setDeleteFlag(user.getDeleteFlag());
                return userResponse;
            }).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, userResponseList);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to filter users: " + e.getMessage());
        }
    }

    public ResponseAPI<List<UserResponse>> filterAccounts(UserFilterRequest filterRequest) {
        try {
            List<UserEntity> users = userRepository.filterUsers(
                            filterRequest.getUsername(),
                            filterRequest.getEmail(),
                            filterRequest.getRole(),
                            filterRequest.getPosition(),
                            filterRequest.getFullName(),
                            filterRequest.getPhone(),
                            filterRequest.getAddress(),
                            CommonConstant.DELETE_FLG.NON_DELETE
                    ).stream()
                    // chỉ lấy những record có account thực sự
                    .filter(user -> user.getUsername() != null && user.getEmail() != null)
                    .collect(Collectors.toList());
            List<UserResponse> userResponseList = users.stream().map(user -> {
                UserResponse userResponse = new UserResponse();
                userResponse.setId(user.getId());
                userResponse.setUsername(user.getUsername());
                userResponse.setEmail(user.getEmail());
                userResponse.setRole(user.getRole());
                userResponse.setPosition(user.getPosition());
                userResponse.setFullName(user.getFullName());
                userResponse.setPhone(user.getPhone());
                userResponse.setAddress(user.getAddress());
                userResponse.setCreateDate(user.getCreateDate());
                userResponse.setUpdateDate(user.getUpdateDate());
                userResponse.setDeleteFlag(user.getDeleteFlag());
                return userResponse;
            }).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, userResponseList);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to filter accounts: " + e.getMessage());
        }
    }

    private UserResponse mapToUserResponse(UserEntity user) {
        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setUsername(user.getUsername());
        userResponse.setEmail(user.getEmail());
        userResponse.setRole(user.getRole());
        userResponse.setFullName(user.getFullName());
        userResponse.setPhone(user.getPhone());
        userResponse.setAddress(user.getAddress());
        userResponse.setPosition(user.getPosition());
        userResponse.setCreateDate(user.getCreateDate());
        userResponse.setUpdateDate(user.getUpdateDate());
        userResponse.setDeleteFlag(user.getDeleteFlag());
        return userResponse;
    }

    public ResponseAPI<List<UserResponse>> getAllStaff() {
        try {
            List<UserEntity> staff = userRepository.findByRoleAndDeleteFlag("STAFF", CommonConstant.DELETE_FLG.NON_DELETE);
            List<UserResponse> staffResponses = staff.stream().map(this::mapToUserResponse).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, staffResponses);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to get all staff: " + e.getMessage());
        }
    }

    public ResponseAPI<UserResponse> getStaffById(Long id) {
        ResponseAPI<UserResponse> response = getUserById(id);
        if (response.getStatus() == CommonConstant.COMMON_RESPONSE.OK && !"STAFF".equals(response.getData().getRole())) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_USER);
        }
        return response;
    }

    public ResponseAPI<UserResponse> createStaff(StaffRequest staffRequest) {
        try {
            if (!staffRequest.isValid()) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_VALID, CommonConstant.COMMON_MESSAGE.INVALID_PARAMETER);
            }
            UserEntity existingUser = userRepository.findByPhoneAndDeleteFlag(staffRequest.getPhone(), CommonConstant.DELETE_FLG.NON_DELETE);
            if (existingUser != null) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.CONFLICT, CommonConstant.COMMON_MESSAGE.EXIST_PHONE);
            }
            UserEntity staff = new UserEntity();
            staff.setRole("STAFF");
            staff.setFullName(staffRequest.getFullName());
            staff.setPhone(staffRequest.getPhone());
            staff.setAddress(staffRequest.getAddress());
            staff.setPosition(staffRequest.getPosition().toUpperCase());
            staff.setCreateDate(new Date());
            staff.setDeleteFlag(CommonConstant.DELETE_FLG.NON_DELETE);
            // username, email, password = null
            userRepository.save(staff);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.CREATED, CommonConstant.COMMON_MESSAGE.OK, mapToUserResponse(staff));
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to create staff: " + e.getMessage());
        }
    }

    public ResponseAPI<UserResponse> updateStaff(Long id, StaffRequest staffRequest) {
        try {
            UserEntity staff = userRepository.findById(id).orElse(null);
            if (staff == null || CommonConstant.DELETE_FLG.DELETE.equals(staff.getDeleteFlag()) || !"STAFF".equals(staff.getRole())) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_USER);
            }
            if (!staffRequest.isValid()) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_VALID, CommonConstant.COMMON_MESSAGE.INVALID_PARAMETER);
            }
            UserEntity existingUser = userRepository.findByPhoneAndDeleteFlag(staffRequest.getPhone(), CommonConstant.DELETE_FLG.NON_DELETE);
            if (existingUser != null && existingUser.getId() != id) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.CONFLICT, CommonConstant.COMMON_MESSAGE.EXIST_PHONE);
            }
            staff.setFullName(staffRequest.getFullName());
            staff.setPhone(staffRequest.getPhone());
            staff.setAddress(staffRequest.getAddress());
            staff.setPosition(staffRequest.getPosition().toUpperCase());
            staff.setUpdateDate(new Date());
            userRepository.save(staff);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, mapToUserResponse(staff));
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to update staff: " + e.getMessage());
        }
    }

    public ResponseAPI<String> deleteStaff(Long id) {
        ResponseAPI<UserResponse> staffResponse = getStaffById(id);
        if (staffResponse.getStatus() != CommonConstant.COMMON_RESPONSE.OK) {
            return new ResponseAPI<>(staffResponse.getStatus(), staffResponse.getMessage());
        }
        return deleteUser(id);
    }

    public ResponseAPI<List<UserResponse>> searchStaff(String keyword) {
        try {
            List<UserEntity> staff = userRepository.searchUsers(keyword, CommonConstant.DELETE_FLG.NON_DELETE).stream()
                    .filter(user -> "STAFF".equals(user.getRole()))
                    .collect(Collectors.toList());
            List<UserResponse> staffResponses = staff.stream().map(this::mapToUserResponse).collect(Collectors.toList());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, staffResponses);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Error to search staff: " + e.getMessage());
        }
    }

    public ResponseAPI<List<UserResponse>> filterStaff(StaffFilterRequest filterRequest) {
        UserFilterRequest userFilter = new UserFilterRequest();
        userFilter.setRole("STAFF");
        userFilter.setFullName(filterRequest.getFullName());
        userFilter.setPhone(filterRequest.getPhone());
        userFilter.setAddress(filterRequest.getAddress());
        userFilter.setPosition(filterRequest.getPosition());
        return filterUsers(userFilter);
    }
}
