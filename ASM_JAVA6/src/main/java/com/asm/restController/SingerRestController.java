package com.asm.restController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


import com.asm.dao.SingerDAO;

import com.asm.entity.Singer;

import jakarta.validation.Valid;

@RestController
public class SingerRestController {
    
    @Autowired
	SingerDAO dao;
	
	@GetMapping("/rest/singer")
	public ResponseEntity<List<Singer>> getAll(Model model){
		return ResponseEntity.ok(dao.findAll());
	}
	
	@GetMapping("/rest/singer/{id}")
	public ResponseEntity<Singer> getOne(@PathVariable("id") Long id){
		if(!dao.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(dao.findById(id).get());
	}

	
	
	@PostMapping("/rest/singer")
	public ResponseEntity<Singer> post(@Valid @RequestBody Singer singer){
		
		dao.save(singer);
		return ResponseEntity.ok(singer);
	}
	
	@PutMapping("/rest/singer/{id}")
	public ResponseEntity<Singer> put(@PathVariable("id") Long id,@Valid @RequestBody Singer singer){
		if(!dao.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		dao.save(singer);
		return ResponseEntity.ok(singer);
	}
	
	@DeleteMapping("/rest/singer/{id}")
	public ResponseEntity<Void> delete(@PathVariable("id") Long id){
		if(!dao.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		dao.deleteById(id);
		return ResponseEntity.ok().build();
	}
}
