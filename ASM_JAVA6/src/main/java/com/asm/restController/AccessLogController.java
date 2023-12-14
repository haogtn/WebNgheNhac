package com.asm.restController;

import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.asm.dao.AccessLogDAO;
import com.asm.entity.AccessLog;
import com.asm.entity.DailyAccessDto;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
public class AccessLogController {
    
    @Autowired
    AccessLogDAO accessLogdao;


    @GetMapping(value="/api/access-log-report")
    public ResponseEntity<List<AccessLog>> getLogAccess() {
        
        return ResponseEntity.ok(accessLogdao.findAll());
    }

    @PostMapping(value="/api/access-log")
    public void logAccess(@RequestParam String ipAddress) {
        AccessLog accessLog = new AccessLog();
        accessLog.setIpAddress(ipAddress);
        accessLogdao.save(accessLog);
    }

    
    
}
