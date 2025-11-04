package com.example.computer_store.service;

import com.example.computer_store.common.CommonConstant;
import com.example.computer_store.response.Common.ResponseAPI;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileUploadService {
    @Value("${upload.dir}")
    private String UPLOAD_DIR; // Lấy từ application.properties

    public ResponseAPI<String> uploadImage(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.NOT_VALID, "File ảnh không được rỗng");
            }
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR, fileName); // Đường dẫn tới thư mục cấu hình
            System.out.println("Saving file to: " + filePath.toString()); // Log đường dẫn
            Files.createDirectories(filePath.getParent()); // Tạo thư mục nếu chưa có
            Files.write(filePath, file.getBytes()); // Ghi file
            String imageUrl = "/images/" + fileName; // URL để truy cập
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.OK, "Upload ảnh thành công", imageUrl);
        } catch (Exception e) {
            return new ResponseAPI<>(CommonConstant.COMMON_RESPONSE.EXCEPTION, "Lỗi khi upload ảnh: " + e.getMessage());
        }
    }
}