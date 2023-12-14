package com.asm.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;

/**
 * ParamService
 */
@Service
public class ParamService {
	private final ResourceLoader resourceLoader;

	@Autowired
	public ParamService(ResourceLoader resourceLoader) {
		this.resourceLoader = resourceLoader;
	}

	@Autowired
	HttpServletRequest request;

	public String getString(String name, String defaultValue) {
		String value = request.getParameter(name);
		return (value != null) ? value : defaultValue;

	}

	public int getInt(String name, int defaultValue) {
		String value = request.getParameter(name);
		return (value != null) ? Integer.parseInt(value) : defaultValue;
	}

	public double getDouble(String name, double defaultValue) {
		String value = request.getParameter(name);
		return (value != null) ? Double.parseDouble(value) : defaultValue;
	}

	public boolean getBoolean(String name, boolean defaultValue) {
		String value = request.getParameter(name);
		return (value != null) ? Boolean.parseBoolean(value) : defaultValue;
	}

	public Date getDate(String name, String pattern) {
		String value = request.getParameter(name);
		if (value != null) {
			try {
				SimpleDateFormat sdf = new SimpleDateFormat();
				return sdf.parse(value);
			} catch (Exception e) {
				// TODO: handle exception
				throw new RuntimeException("Sai định dạng thời gian");
			}
		}
		return null;
	}

	public File save(MultipartFile file, String path) {
		try {
			String fullPath = request.getServletContext().getRealPath(path);
			File dir = new File(fullPath);
			if (!dir.exists()) {
				dir.mkdirs();
			}
			String fileName = file.getOriginalFilename();
			File destFile = new File(dir, fileName);
			file.transferTo(destFile);
			return destFile;
		} catch (Exception e) {
			throw new RuntimeException("Lỗi lưu file");
		}
	}

	// public File saveFileToStaticFolder(MultipartFile file) {
	// try {
	// String fullPath = "asset/img/avatar";
	// // Resource resource = new ClassPathResource("asset/img/avatar/");
	// Resource resource = resourceLoader.getResource(fullPath);
	// File destinationFile = resource.getFile();

	// if (!destinationFile.exists()) {
	// destinationFile.createNewFile();
	// }

	// FileOutputStream fos = new FileOutputStream(destinationFile);
	// fos.write(file.getBytes());
	// fos.close();

	// return destinationFile;
	// } catch (IOException e) {
	// throw new RuntimeException("Lỗi lưu file: " + e.getMessage());
	// }
	// }
	// }

	// public File save(MultipartFile file, String path) {
	// try {
	// String fullPath = request.getServletContext().getRealPath(path); // Đường dẫn
	// tuyệt đối để lưu file
	// File dir = new File(fullPath);
	// if (!dir.exists()) {
	// dir.mkdirs();
	// }
	// String fileName = file.getOriginalFilename();
	// File destFile = new File(dir, fileName);
	// file.transferTo(destFile);
	// return destFile;
	// } catch (Exception e) {
	// throw new RuntimeException("Lỗi lưu file");
	// }
}
