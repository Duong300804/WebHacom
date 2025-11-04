package com.example.computer_store.service.Auth;

import com.example.computer_store.common.CommonConstant;
import com.example.computer_store.config.JwtUlti;
import com.example.computer_store.model.entity.NotificationEntity;
import com.example.computer_store.model.entity.UserEntity;
import com.example.computer_store.repository.NotificationRepository;
import com.example.computer_store.repository.UserRepository;
import com.example.computer_store.request.Auth.*;
import com.example.computer_store.response.Auth.*;
import com.example.computer_store.response.Common.ResponseAPI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUlti jwtUlti;

    @Autowired
    private NotificationRepository notificationRepository;

    public ResponseAPI<LoginResponse> handleLogin(LoginRequest loginRequest){
        //Kiểm tra tính hợp lệ của request
        if (!loginRequest.isValid()){
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_VALID, CommonConstant.COMMON_MESSAGE.INVALID_PARAMETER);
        }
        //Kiểm tra người dùng tồn tại
        UserEntity user = userRepository.findByUsernameAndDeleteFlag(loginRequest.getUsername(), CommonConstant.DELETE_FLG.NON_DELETE);
        if (user == null){
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_USER);
        }
        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
            //Tạo token
            String token = jwtUlti.generateToken(user.getUsername(), user.getRole());
            //Tạo response
            LoginResponse loginResponse = new LoginResponse();
            loginResponse.setId(user.getId());
            loginResponse.setUsername(user.getUsername());
            loginResponse.setRole(user.getRole());
            loginResponse.setAccessToken(token);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, loginResponse);
        }catch (BadCredentialsException e){
            System.out.println("Bad credentials for username: " + loginRequest.getUsername());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NON_AUTH, CommonConstant.COMMON_MESSAGE.PASSWORD_INCORRECT);
        } catch (Exception e) {
//            throw new RuntimeException(e);
            System.err.println("Login error: " + e.getMessage());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, CommonConstant.COMMON_MESSAGE.EXCEPTION);
        }
    }

    public ResponseAPI<RegisterResponse> handleRegister(RegisterRequest registerRequest){
        //Kiểm tra tính hợp lệ của request
        if (!registerRequest.isValid()){
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_VALID, CommonConstant.COMMON_MESSAGE.INVALID_PARAMETER);
        }
        //Kiểm tra người dùng đã tồn tại
        UserEntity existingUser = userRepository.findByUsernameAndDeleteFlag(registerRequest.getUsername(), CommonConstant.DELETE_FLG.NON_DELETE);
        if (existingUser != null){
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.CONFLICT, CommonConstant.COMMON_MESSAGE.EXIST_USERNAME);
        }
        //kiểm tra email đã tồn tại
        existingUser = userRepository.findByEmailAndDeleteFlag(registerRequest.getEmail(), CommonConstant.DELETE_FLG.NON_DELETE);
        if (existingUser != null){
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.CONFLICT, CommonConstant.COMMON_MESSAGE.EXIST_EMAIL);
        }
        try {
            //Tạo user mới
            UserEntity user = new UserEntity();
            user.setUsername(registerRequest.getUsername());
            user.setEmail(registerRequest.getEmail());
            user.setPassword(registerRequest.getPassword());
            user.setRole("CUSTOMER");
            user.setCreateDate(new Date());
            user.setDeleteFlag(CommonConstant.DELETE_FLG.NON_DELETE);
            userRepository.save(user);
            // Tạo thông báo cho admin
            List<UserEntity> admins = userRepository.findByRoleAndDeleteFlag("ADMIN", CommonConstant.DELETE_FLG.NON_DELETE);
            for (UserEntity admin : admins) {
                NotificationEntity adminNotification = new NotificationEntity();
                adminNotification.setUser(admin);
                adminNotification.setType("NEW_USER");
                adminNotification.setMessage("Khách hàng mới đăng ký: " + user.getUsername());
                adminNotification.setRead(false);
                adminNotification.setCreatedAt(new Date());
                adminNotification.setDeleteFlag(CommonConstant.DELETE_FLG.NON_DELETE);
                notificationRepository.save(adminNotification);
            }
            //Tạo thông báo cho staff
            List<UserEntity> staffs = userRepository.findByRoleAndDeleteFlag("STAFF", CommonConstant.DELETE_FLG.NON_DELETE)
                    .stream()
                    .filter(s -> s.getUsername() != null && !s.getUsername().isEmpty())
                    .collect(Collectors.toList());
            for (UserEntity staff : staffs) {
                NotificationEntity staffNotification = new NotificationEntity();
                staffNotification.setUser(staff);
                staffNotification.setType("NEW_USER");
                staffNotification.setMessage("Khách hàng mới đăng ký: " + user.getUsername());
                staffNotification.setRead(false);
                staffNotification.setCreatedAt(new Date());
                staffNotification.setDeleteFlag(CommonConstant.DELETE_FLG.NON_DELETE);
                notificationRepository.save(staffNotification);
            }
            //Tạo token
            String token = jwtUlti.generateToken(user.getUsername(), user.getRole());
            //Tạo response
            RegisterResponse registerResponse = new RegisterResponse();
            registerResponse.setId(user.getId());
            registerResponse.setUsername(user.getUsername());
            registerResponse.setEmail(user.getEmail());
            registerResponse.setRole(user.getRole());
            registerResponse.setAccessToken(token);
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.CREATED, CommonConstant.COMMON_MESSAGE.OK, registerResponse);
        } catch (Exception e) {
//            throw new RuntimeException(e);
            System.err.println("Register error: " + e.getMessage());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, CommonConstant.COMMON_MESSAGE.EXCEPTION);
        }
    }

    public ResponseAPI<UpdateProfileResponse> updateProfile(UpdateProfileRequest updateProfileRequest){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            UserEntity user = userRepository.findByUsernameAndDeleteFlag(username, CommonConstant.DELETE_FLG.NON_DELETE);
            if (user == null){
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_USER);
            }
            UserEntity existingUser = userRepository.findByPhoneAndDeleteFlag(updateProfileRequest.getPhone(), CommonConstant.DELETE_FLG.NON_DELETE);
            if (existingUser != null && existingUser.getId() != user.getId()){
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.CONFLICT, CommonConstant.COMMON_MESSAGE.EXIST_PHONE);
            }
            existingUser = userRepository.findByEmailAndDeleteFlag(updateProfileRequest.getEmail(), CommonConstant.DELETE_FLG.NON_DELETE);
            if (existingUser != null && existingUser.getId() != user.getId()){
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.CONFLICT, CommonConstant.COMMON_MESSAGE.EXIST_EMAIL);
            }
            if (!updateProfileRequest.isValid()){
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_VALID, CommonConstant.COMMON_MESSAGE.INVALID_PARAMETER);
            }
            user.setFullName(updateProfileRequest.getFullName());
            user.setPhone(updateProfileRequest.getPhone());
            user.setAddress(updateProfileRequest.getAddress());
            user.setEmail(updateProfileRequest.getEmail());
            user.setUpdateDate(new Date());
            userRepository.save(user);
            //Tạo response
            UpdateProfileResponse response = new UpdateProfileResponse();
            response.setId(user.getId());
            response.setUsername(user.getUsername());
            response.setEmail(user.getEmail());
            response.setFullName(user.getFullName());
            response.setPhone(user.getPhone());
            response.setAddress(user.getAddress());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, response);
        } catch (Exception e) {
//        throw new RuntimeException(e);
            System.err.println("Update profile error: " + e.getMessage());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, CommonConstant.COMMON_MESSAGE.EXCEPTION);
        }
    }

    public ResponseAPI<ChangePasswordResponse> changePassword(ChangePasswordRequest changePasswordRequest){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            UserEntity user = userRepository.findByUsernameAndDeleteFlag(username, CommonConstant.DELETE_FLG.NON_DELETE);
            if (user == null){
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_USER);
            }
            if (!changePasswordRequest.isValid()){
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_VALID, CommonConstant.COMMON_MESSAGE.INVALID_PARAMETER);
            }
            if (!changePasswordRequest.getOldPassword().equals(user.getPassword())){
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NON_AUTH, CommonConstant.COMMON_MESSAGE.OLD_PASSWORD_INCORRECT);
            }
            if (!changePasswordRequest.getNewPassword().equals(changePasswordRequest.getConfirmPassword())) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_VALID, CommonConstant.COMMON_MESSAGE.CONFIRM_PASSWORD_NOT_MATCH);
            }
            user.setPassword(changePasswordRequest.getNewPassword());
            user.setUpdateDate(new Date());
            userRepository.save(user);
            //Tạo response
            ChangePasswordResponse changePasswordResponse = new ChangePasswordResponse();
            changePasswordResponse.setId(user.getId());
            changePasswordResponse.setUsername(user.getUsername());
            changePasswordResponse.setEmail(user.getEmail());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.PASSWORD_CHANGED, changePasswordResponse);
        } catch (Exception e) {
//            throw new RuntimeException(e);
            System.err.println("Register error: " + e.getMessage());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, CommonConstant.COMMON_MESSAGE.EXCEPTION);
        }
    }

    public ResponseAPI<ForgotPasswordResponse> handleForgotPassword(ForgotPasswordRequest forgotPasswordRequest) {
        if (!forgotPasswordRequest.isValid()) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_VALID, CommonConstant.COMMON_MESSAGE.INVALID_PARAMETER);
        }
        try {
            UserEntity user = userRepository.findByUsernameAndDeleteFlag(forgotPasswordRequest.getUsername(), CommonConstant.DELETE_FLG.NON_DELETE);
            if (user == null || !user.getEmail().equals(forgotPasswordRequest.getEmail())) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.INVALID_USERNAME_OR_EMAIL);
            }
            if (!forgotPasswordRequest.getNewPassword().equals(forgotPasswordRequest.getConfirmPassword())) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_VALID, CommonConstant.COMMON_MESSAGE.CONFIRM_PASSWORD_NOT_MATCH);
            }
            user.setPassword(forgotPasswordRequest.getNewPassword());
            user.setUpdateDate(new Date());
            userRepository.save(user);
            //Tạo response
            ForgotPasswordResponse response = new ForgotPasswordResponse();
            response.setId(user.getId());
            response.setUsername(user.getUsername());
            response.setEmail(user.getEmail());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.PASSWORD_CHANGED, response);
        } catch (Exception e) {
//            throw new RuntimeException(e);
            System.err.println("Register error: " + e.getMessage());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, CommonConstant.COMMON_MESSAGE.EXCEPTION);
        }
    }

    public ResponseAPI<ProfileResponse> getProfile() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            UserEntity user = userRepository.findByUsernameAndDeleteFlag(username, CommonConstant.DELETE_FLG.NON_DELETE);
            if (user == null) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_FOUND, CommonConstant.COMMON_MESSAGE.NOT_FOUND_USER);
            }
            //Tạo response
            ProfileResponse response = new ProfileResponse();
            response.setId(user.getId());
            response.setUsername(user.getUsername());
            response.setEmail(user.getEmail());
            response.setFullName(user.getFullName());
            response.setPhone(user.getPhone());
            response.setAddress(user.getAddress());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, CommonConstant.COMMON_MESSAGE.OK, response);
        } catch (Exception e) {
            System.err.println("Get profile error: " + e.getMessage());
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, CommonConstant.COMMON_MESSAGE.EXCEPTION);
        }
    }

}
