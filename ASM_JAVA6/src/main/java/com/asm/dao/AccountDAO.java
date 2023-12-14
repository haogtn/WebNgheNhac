package com.asm.dao;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.asm.entity.Account;
import com.asm.entity.ReportAccount;

public interface AccountDAO extends JpaRepository<Account, String> {
    Account findByUsernameOrEmail(String username, String email);

    Account findByEmail(String email);

    @Query("Select new ReportAccount(a.accountRole.name, COUNT(a.username)) from Account a group by a.accountRole.name")
    Page<ReportAccount> selectQuanAccount(Pageable pageable);
}
