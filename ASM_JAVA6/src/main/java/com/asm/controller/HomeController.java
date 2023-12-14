package com.asm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.security.core.Authentication;

import com.asm.CustomUserDetails;
import com.asm.CustomUserDetailsService;
import com.asm.dao.AccountDAO;
import com.asm.entity.Account;

@Controller
public class HomeController {

    @Autowired
    AccountDAO dao;

    @RequestMapping("/home/index")
    public String home(Model model) {
        // Assuming userDetailsService.getAccount() returns the account information
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();

            if (principal instanceof UserDetails) {
                UserDetails userDetails = (UserDetails) principal;
                // Assuming UserDetails contains the account information
                // Access account details from UserDetails as needed
                String account = userDetails.getUsername();
                System.err.println("**************" + account);
                Account acc = dao.findByEmail(account);
                model.addAttribute("account", acc);
                // Use the account details as needed
            }
        } else {
            model.addAttribute("account", null);

        }
        return "index";
    }

    @RequestMapping("home/explore")
    public String explore() {
        return "webplayer";
    }

}
