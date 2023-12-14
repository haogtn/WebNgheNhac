package com.asm.restController;

import java.io.IOException;

import org.apache.commons.io.output.ByteArrayOutputStream;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/excel")
public class ExcelRestController {
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportExcel() throws IOException {
        // Tạo workbook và sheet
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Sheet 1");

        // Tạo dữ liệu mẫu (đây chỉ là ví dụ, bạn cần thay thế với dữ liệu thực tế của mình)
        Row headerRow = sheet.createRow(0);
        headerRow.createCell(0).setCellValue("Column 1");
        headerRow.createCell(1).setCellValue("Column 2");

        Row dataRow = sheet.createRow(1);
        dataRow.createCell(0).setCellValue("Value 1");
        dataRow.createCell(1).setCellValue("Value 2");

        // Ghi workbook vào ByteArrayOutputStream
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();

        // Chuyển ByteArrayOutputStream thành byte array
        byte[] bytes = outputStream.toByteArray();

        // Thiết lập HTTP headers để trình duyệt hiểu rằng file là Excel
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", "example.xlsx");

        return new ResponseEntity<>(bytes, headers, org.springframework.http.HttpStatus.OK);
    }
}
