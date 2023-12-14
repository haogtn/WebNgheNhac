package com.asm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.asm.CustomUserDetailsService;
import com.asm.dao.AccountDAO;
import com.asm.dao.RoleDAO;
import com.asm.entity.Account;
import com.asm.entity.Role;
import com.asm.service.UsernameGenerator;

@Controller
public class AccountController {

    @Autowired
    AccountDAO dao;

    @Autowired
    CustomUserDetailsService user;

    @Autowired
    RoleDAO roledao;

    @Autowired
    UsernameGenerator username;

    @RequestMapping("/dashboard/user")
    public String user() {
        return "admin/user/index1";
    }

    @RequestMapping("/home/signup")
    public String signup() {
        return "signup";
    }

    @RequestMapping("profile")
    public String account(Model model) {

        return "profile";
    }

    @GetMapping("/oauth2/login/success")
    public String success(OAuth2AuthenticationToken oauth) {
        String email = oauth.getPrincipal().getAttribute("email");
        String fullname = oauth.getPrincipal().getAttribute("name");
        System.out.println("****************" + email);
        System.out.println("000000000000" + fullname);
        Account acc = dao.findByEmail(email);
        if (acc != null) {
            UserDetails userDetails = user.loadUserByUsername(email);
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
            return "redirect:/home/index";
        } else {
            try {
                Account newaccount = new Account();
                Role userrole = roledao.findById("USER").get();
                String usernem = username.generateUniqueUsername();
                newaccount.setUsername(usernem);
                newaccount.setAccountRole(userrole);
                newaccount.setEmail(email);
                newaccount.setFullname(fullname);
                dao.save(newaccount);
                System.out.println("TẠO TÀI KHOẢN THÀNH CÔNG" + newaccount.getUsername());
                UserDetails userDetails = user.loadUserByUsername(email);
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
                return "redirect:/profile";
            } catch (Exception e) {
                System.err.println("****ERROR*****" + e);
                // Trả về một giá trị nếu xảy ra ngoại lệ
                return "error"; // Ví dụ: Trả về trang lỗi
            }
        }

    }

}
