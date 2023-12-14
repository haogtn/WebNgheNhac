package com.asm.entity;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Accounts")
public class Account {
	@Id
	private String username;
	private String password;
	private String fullname;
	private String email;
	private String phoneNumber;
	private String avatarUrl;

	// @JsonBackReference
	// @ManyToOne
	// @JoinColumn(name = "role_id") // Đảm bảo tên cột khớp với tên cột trong cơ sở
	// dữ liệu
	// private Role accountRole;
	//
	// @OneToOne(mappedBy = "account", cascade = CascadeType.ALL)
	// private PasswordResetToken passwordResetToken;

	@ManyToOne()
	@JoinColumn(name = "role_id")
	private Role accountRole;

	@JsonIgnore
	@OneToOne(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	private PasswordResetToken passwordResetToken;

	@ManyToOne()
	@JoinColumn(name = "userId")
	private Account user;

}
