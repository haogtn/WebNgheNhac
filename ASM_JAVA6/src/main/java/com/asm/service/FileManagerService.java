package com.asm.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.ServletContext;

@Service
public class FileManagerService {

    @Autowired
    ServletContext app;

    private Path getPath(String folder, String fileName) {
        File dir = Paths.get(app.getRealPath("/files/"), folder).toFile();
        if (!dir.exists()) {
            dir.mkdirs();
        }
        return Paths.get(dir.getAbsolutePath(), fileName);
    }

    public byte[] read(String folder, String filename) {
        Path path = this.getPath(folder, filename);
        try {
            return Files.readAllBytes(path);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public String save(String folder, MultipartFile file) {
        String filename = "";
        if (!file.isEmpty()) {
            String name = System.currentTimeMillis() + file.getOriginalFilename();
            filename = Integer.toHexString(name.hashCode()) + name.substring(name.lastIndexOf("."));
            Path path = this.getPath(folder, filename);
            try {
                file.transferTo(path);
            } catch (IOException e) {
                // Xử lý ngoại lệ khi chuyển file
                e.printStackTrace();
                // Có thể throw exception hoặc xử lý khác tùy vào logic của bạn
                return null; // hoặc trả về một giá trị/cảnh báo thích hợp nếu xảy ra lỗi
            }
        }
        return filename;
    }

    public void delete(String folder, String fileName) {
        Path path = this.getPath(folder, fileName);
        path.toFile().delete();
    }

    // public String list(String folder) {
    // List<String> filenames = new ArrayList<>();
    // File dir = Paths.get(app.getRealPath("/files/"), folder).toFile();
    // if (dir.exists()) {
    // File[] files = dir.listFiles();
    // for (File file : files) {
    // filenames.add(file.getName());
    // }
    // }
    // return filenames;
    // }
}
