package com.asm;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Service;
import java.util.UUID;

import com.asm.dao.AccountDAO;
import com.asm.dao.TokenRepository;
import com.asm.entity.Account;
import com.asm.entity.PasswordResetToken;

import jakarta.transaction.Transactional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private AccountDAO userRepository;

    @Autowired
    JavaMailSender javaMailSender;

    @Autowired
    TokenRepository tokenRepository;

    // @Override
    // public UserDetails loadUserByUsername(String username) throws
    // UsernameNotFoundException {
    // Account user = userRepository.findByEmail(username);
    // if (user == null) {
    // throw new UsernameNotFoundException("User Not Found");
    // }
    // System.err.println("************************" + user);

    // // Mã hóa mật khẩu chưa mã hóa
    // // String plainPassword = user.getPassword(); // Điều chỉnh tên trường mật
    // khẩu
    // // trong đối tượng Account

    // return new CustomUserDetails(user);
    // }
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) {
        Account user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        // Initialize roles before session closes
        user.getAccountRole();
        return new CustomUserDetails(user);
    }

    // public void loginForm(OAuth2AuthenticationToken oauth) {
    // BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    // String email=oauth.getPrincipal().getAttribute("email");
    // String fullname=oauth.getPrincipal().getAttribute("name");
    // String pass=Long.toHexString(System.currentTimeMillis());
    // UserDetails
    // user=User.withUsername("email").password(encoder.encode(pass)).roles("USER").build();

    // // Account acc=dao.findByIdOrEmail(email);
    // //
    // // UserDetails
    // user=User.withUsername(email).password("").roles("USER").build();
    // org.springframework.security.core.Authentication auth=new
    // UsernamePasswordAuthenticationToken(user, null,user.getAuthorities());

    // SecurityContextHolder.getContext().setAuthentication(auth);
    // }

    public String sendEmail(Account user) {
		try {
			String resetLink = generateResetToken(user);

			SimpleMailMessage msg = new SimpleMailMessage();
			
			msg.setTo(user.getEmail());

			msg.setSubject("RESET PASSWORD FOR ONESOUND ACCOUNT");
			msg.setText("Hello, This is a reset password mail from ONESOUND \n\n" + "Please click on this link to Reset your Password :" + resetLink + ". \n\n"
					+ "Regards \n" + "ONESOUND");

			javaMailSender.send(msg);

			return "success";
		} catch (Exception e) {
			e.printStackTrace();
			return "error";
		}

	}


    public String generateResetToken(Account user) {
        UUID uuid = UUID.randomUUID();
        LocalDateTime currentDateTime = LocalDateTime.now();
        LocalDateTime expiryDateTime = currentDateTime.plusMinutes(30);
        
        PasswordResetToken existingToken = tokenRepository.findByAccount(user);
        PasswordResetToken tokenToSave;

        if (existingToken == null) {
            tokenToSave = new PasswordResetToken();
        } else {
            tokenToSave = existingToken;
        }

        tokenToSave.setAccount(user);
        tokenToSave.setToken(uuid.toString());
        tokenToSave.setExpiryDateTime(expiryDateTime);

        PasswordResetToken savedToken = tokenRepository.save(tokenToSave);
        if (savedToken != null) {
            String endpointUrl = "http://localhost:8080/resetPassword";
            return endpointUrl + "/" + savedToken.getToken();
        }

        return "";
    }



	public boolean hasExipred(LocalDateTime expiryDateTime) {
		LocalDateTime currentDateTime = LocalDateTime.now();
		return expiryDateTime.isAfter(currentDateTime);
	}
}