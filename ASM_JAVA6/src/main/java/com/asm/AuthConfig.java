package com.asm;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.endpoint.DefaultAuthorizationCodeTokenResponseClient;
import org.springframework.security.oauth2.client.endpoint.OAuth2AccessTokenResponseClient;
import org.springframework.security.oauth2.client.endpoint.OAuth2AuthorizationCodeGrantRequest;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.client.web.HttpSessionOAuth2AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.web.SecurityFilterChain;

import com.asm.dao.AccountDAO;
import com.asm.entity.Account;
import com.asm.entity.Role;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true, jsr250Enabled = true)
public class AuthConfig {

	@Autowired
	private UserDetailsService userDetailsService;

	@Bean
	public UserDetailsService userDetailsService() {
		return new CustomUserDetailsService(); // Instantiate your CustomUserDetailsService here
	}

	@Bean
	AuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
		provider.setUserDetailsService(userDetailsService);
		provider.setPasswordEncoder(new BCryptPasswordEncoder());
		return provider;
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.csrf().disable().cors().disable();

		http.authorizeRequests()
				.requestMatchers("/").permitAll()
				.requestMatchers("/home/admin").hasAuthority("ADMIN")
				.requestMatchers("/album/index").hasAuthority("ADMIN")
				.requestMatchers("/album/edit").hasAuthority("ADMIN")
				.requestMatchers("/genres/index").hasAuthority("ADMIN")
				.requestMatchers("/admin/web-report/index").hasAuthority("ADMIN")
				.requestMatchers("/admin/web-report/index/day").hasAuthority("ADMIN")
				.requestMatchers("/singer/index").hasAuthority("ADMIN")
				.requestMatchers("admin/song/index").hasAuthority("ADMIN")
				.requestMatchers("/dashboard/user").hasAuthority("ADMIN")
				.requestMatchers("/home/users").hasAnyAuthority("ADMIN", "USER")
				.requestMatchers("/changePassword").hasAnyAuthority("ADMIN", "USER")
				// .requestMatchers("/rest/authorities").hasAnyAuthority("ADMIN", "USER")
				.requestMatchers("/home/about").authenticated()
				.requestMatchers("/profile").authenticated()
				.anyRequest().permitAll();

		http.exceptionHandling().accessDeniedPage("/auth/access/denied");

		http.formLogin().loginPage("/auth/login/form").loginProcessingUrl("/auth/login")
				.defaultSuccessUrl("/auth/login/success", false).failureHandler((request, response, exception) -> {
					String errorMessage;
					if (exception instanceof UsernameNotFoundException) {
						errorMessage = "Invalid username or password";
					} else {
						errorMessage = "Authentication failed: " + exception.getMessage();
						String username = request.getParameter("username");

						String password = request.getParameter("password");
						System.err.println("Login failed. Username: " + username + ", Password: " + password);
					}
					System.err.println(errorMessage);
					response.sendRedirect("/auth/login/error?error=" + errorMessage);
				}).usernameParameter("username").passwordParameter("password");

		http.oauth2Login()
				.loginPage("/auth/login/form")
				.defaultSuccessUrl("/oauth2/login/success", true)
				.failureUrl("/auth/login/error")
				.authorizationEndpoint()
				.baseUri("/oauth2/authorization")
				.authorizationRequestRepository(getRepository())
				.and().tokenEndpoint()
				.accessTokenResponseClient(getToken());
		// http.rememberMe().rememberMeParameter("remember");

		http.logout().logoutUrl("/auth/logoff").logoutSuccessUrl("/auth/logoff/success");
		return http.build();

		// http.addFilterBefore(yourFilterBean,
		// UsernamePasswordAuthenticationFilter.class);

	}

	@Bean
	public AuthorizationRequestRepository<OAuth2AuthorizationRequest> getRepository() {
		return new HttpSessionOAuth2AuthorizationRequestRepository();
	}

	@Bean
	public OAuth2AccessTokenResponseClient<OAuth2AuthorizationCodeGrantRequest> getToken() {
		return new DefaultAuthorizationCodeTokenResponseClient();
	}

}
