package com.asm.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.asm.dao.AccountDAO;
import com.asm.entity.Account;

@Component
public class UsernameGenerator {

    @Autowired
    AccountDAO dao;

    public String generateUniqueUsername() {
        String prefix = "US";
        int counter = 1;
        String user = prefix + String.format("%06d", counter);

        List<Account> list = dao.findAll();
        boolean exists;

        do {
            exists = false;
            for (Account acc : list) {
                if (user.equals(acc.getUsername())) {
                    exists = true;
                    break;
                }
            }

            if (exists) {
                counter++;
                user = prefix + String.format("%06d", counter);
            }
        } while (exists);

        return user;
    }

}
