package com.asm.controller;

import java.net.http.HttpRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.asm.CustomUserDetailsService;
import com.asm.dao.AccountDAO;
import com.asm.dao.TokenRepository;
import com.asm.entity.Account;
import com.asm.entity.PasswordResetToken;

@Controller
public class ForgotPasswordController {
	@Autowired
	CustomUserDetailsService userDetailsService;

	@Autowired
	AccountDAO userRepository;
	@Autowired
	TokenRepository tokenRepository;

	private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

	@RequestMapping("/forgotPassword")
	public String forgotPassword() {
		return "forgotpassword";
	}

	@RequestMapping("/forgotPassword/process")
	public String forgotPassordProcess(@RequestParam("email") String email, Model model) {
		String output = "";
		try {
			Account user = userRepository.findByEmail(email);
			if (user != null) {
				output = userDetailsService.sendEmail(user);
			}
			if (user == null) {
				model.addAttribute("mess", "Incorrect email!");
				return "forward:/forgotPassword?error";
			}
			if (output.equals("success")) {
				model.addAttribute("mess",
						"Please checking your email! If you don't see any mail from us, please find them in SPAM");
				return "forward:/forgotPassword";
			}
		} catch (Exception e) {
			// TODO: handle exception
			System.err.println(e);
		}

		return "forward:/forgotPassword?error";
	}

	@GetMapping("/resetPassword/{token}")
	public String resetPasswordForm(@PathVariable String token, Model model) {
		PasswordResetToken reset = tokenRepository.findByToken(token);
		if (reset != null && userDetailsService.hasExipred(reset.getExpiryDateTime())) {
			model.addAttribute("email", reset.getAccount().getEmail());
			return "resetpassword";
		}
		return "forward:/forgotPassword";
	}

	@PostMapping("/resetPassword")
	public String passwordResetProcess(@ModelAttribute Account userDTO) {
		Account user = userRepository.findByEmail(userDTO.getEmail());
		if (user != null) {
			user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
			userRepository.save(user);
		}
		return "redirect:/auth/login/form";
	}

	@GetMapping("/changePassword")
	public String changepass(Model model) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication != null && authentication.isAuthenticated()) {
			Object principal = authentication.getPrincipal();

			if (principal instanceof UserDetails) {
				UserDetails userDetails = (UserDetails) principal;
				String account = userDetails.getUsername();
				Account acc = userRepository.findByEmail(account);
				model.addAttribute("account", acc.getEmail());
				if (acc.getPassword() == null) {
					model.addAttribute("show", true);
				} else {
					model.addAttribute("show", false);
				}
			}
		}
		return "resetpassword2";
	}

	@PostMapping("/changePassword")
	public String passwordChange(@RequestParam("password") String password,
			@RequestParam(value = "old-password", required = false) String oldpassword, Model model,
			@RequestParam("confirm-password") String confirm,
			@RequestParam("email") String email) {
		Account acc = userRepository.findByEmail(email);
		model.addAttribute("account", acc.getEmail());
		if (acc.getPassword() != null) {
			if (passwordEncoder.matches(oldpassword, acc.getPassword())) {
				if (password.equals(confirm)) {
					acc.setPassword(passwordEncoder.encode(password));
					userRepository.save(acc);
					model.addAttribute("mess", "Updated password successfully!");
				} else {
					model.addAttribute("mess", "The new-password and confirm-password don't match!");
				}
			}
		} else {
			if (password.equals(confirm)) {
				acc.setPassword(passwordEncoder.encode(password));
				userRepository.save(acc);
				model.addAttribute("mess", "Updated password successfully!");
			} else {
				model.addAttribute("mess", "The new-password and confirm-password don't match!");
			}
		}
		return "forward:/changePassword";
	}
}