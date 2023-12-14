package com.asm.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "roles")
public class Role {
	@Id
	private String id;
	private String name;
//	@JsonIgnore
//	@JsonManagedReference
//	@OneToMany(mappedBy = "accountRole")
//	List<Account> accounts;
	 @JsonIgnore
	    @OneToMany(mappedBy = "accountRole", cascade = CascadeType.ALL)
	    private List<Account> accounts;
}
