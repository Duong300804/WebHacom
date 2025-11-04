package com.example.computer_store.controller;

import com.example.computer_store.common.URLConstant;
import com.example.computer_store.response.Common.ResponseAPI;
import com.example.computer_store.service.FileUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class FileUploadController {

    @Autowired
    private FileUploadService fileUploadService;

    @PostMapping(URLConstant.UPLOAD_IMAGE)
    public ResponseAPI<String> uploadImage(@RequestParam("file") MultipartFile file) {
        return fileUploadService.uploadImage(file);
    }
}
