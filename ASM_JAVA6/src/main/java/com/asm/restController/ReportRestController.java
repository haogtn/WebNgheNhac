package com.asm.restController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.asm.dao.AccountDAO;
import com.asm.entity.ReportAccount;

@RestController
public class ReportRestController {

    @Autowired
    private AccountDAO adao;

    
}
