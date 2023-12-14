package com.asm;

import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.asm.entity.Account;
import com.asm.entity.Role;

public class CustomUserDetails implements UserDetails {

    private Account user;

    public CustomUserDetails(Account user) {
        super();
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> authorities = new HashSet<>();

        // Lấy danh sách các quyền từ user.getAccountRole().getId() hoặc từ nguồn dữ
        // liệu tương ứng
        String roleId = user.getAccountRole().getName(); // Điều chỉnh để lấy ID quyền từ nguồn dữ liệu

        // Thêm mỗi quyền vào danh sách authorities
        authorities.add(new SimpleGrantedAuthority(roleId));

        // Thêm các quyền khác nếu có
        // authorities.add(new SimpleGrantedAuthority(anotherRoleId));

        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public String getPassword() {
        // TODO Auto-generated method stub
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail(); // Sử dụng email thay vì username
    }

}