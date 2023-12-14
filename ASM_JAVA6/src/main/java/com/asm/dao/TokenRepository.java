package com.asm.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.asm.entity.Account;
import com.asm.entity.PasswordResetToken;

public interface TokenRepository extends JpaRepository<PasswordResetToken, Integer> {

    PasswordResetToken findByToken(String token);
    PasswordResetToken findByAccount(Account account);
    
}
