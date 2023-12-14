package com.asm.controller;

import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.asm.CustomUserDetailsService;
import com.asm.dao.AccountDAO;
import com.asm.entity.Account;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@Controller
public class AuthController {
    // String url="http://localhost:2021/rest/authorities";
    @Autowired
    CustomUserDetailsService userDetailsService;

    // @Autowired
    // SecurityRestTemplate restTemplate;

    // @GetMapping("/rest/template")
    // public String view(Model model){
    // // model.addAttribute("db",restTemplate.get(url));
    // return "admin/user/index";
    // }

    // @GetMapping("/rest/url")
    // public String view2(Model model){
    // model.addAttribute("db",SecurityRestURL.get(url));
    // return "signup";
    // }

    @RequestMapping("/auth/login/form")
    public String form() {
        return "login";
    }

    @RequestMapping("/auth/home")
    public String homee() {
        return "explore";
    }

    @RequestMapping("/auth/login/success")
    public String success(Model model) {
        model.addAttribute("mess", "Đăng nhập thành công");
        return "forward:/home/index";
    }

    @RequestMapping("/auth/login/error")
    public String error(Model model) {
        model.addAttribute("mess", "The email or the password is incorrect!");
        return "forward:/auth/login/form";
    }

    @RequestMapping("/auth/access/denied")
    public String denied(Model model) {
        model.addAttribute("mess", "Bạn không có quyền truy cập");
        return "redirect:/auth/login/form";
    }

    @RequestMapping("/auth/logoff/success")
    public String logoff(Model model) {
        model.addAttribute("mess", "Logout successfully!");
        return "forward:/auth/login/form";

    }

}
