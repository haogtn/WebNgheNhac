package com.asm.restController;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.asm.dao.AlbumDAO;
import com.asm.entity.Album;
import com.asm.entity.Song;
import com.asm.service.FileManagerService;
import com.asm.service.ParamService;

import jakarta.validation.Valid;


@RestController
public class AlbumRestController {

	@Autowired
	AlbumDAO dao;
	
	@Autowired
    ParamService ps;

	
	
	@Autowired
	ParamService paS;
	@GetMapping("/rest/albums")
	public ResponseEntity<List<Album>> getAll(Model model){
		return ResponseEntity.ok(dao.findAll());
	}
	
	@GetMapping("/rest/albums/{id}")
	public ResponseEntity<Album> getOne(@PathVariable("id") Long id){
		if(!dao.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(dao.findById(id).get());
	}

	 @PostMapping("/rest/albums/img")
    public ResponseEntity<Void> uploadIMG(@RequestParam("file") MultipartFile file) {
		String path = "/asset/img/album/";
        
		ps.save(file, path);
		return ResponseEntity.ok().build();
    }
	
	//  @PostMapping("/rest/albums")
    // public ResponseEntity<Album> create(@RequestParam("file") String file,
    //                                                @RequestParam("title") String title,
    //                                                @RequestParam("releaseYear") Integer year) {
		
    //     Album album = new Album();
    //     album.setTitle(title);
    //     album.setReleaseYear(year);
		
	// 	album.setImage(file);
	// 	dao.save(album);
       

	// 	return ResponseEntity.ok(album);
    // }
	@PostMapping("/rest/albums")
    public ResponseEntity<Album> create(@Valid @RequestBody Album album) {
		
       
		dao.save(album);
       

		return ResponseEntity.ok(album);
    }


	//  @PostMapping("/rest/albums/img/{id}")
    // public ResponseEntity<Album> uploadIMG(@RequestParam("file") MultipartFile file, @PathVariable("id") Long id) {
	// 	String path = "/asset/img/album/";
        
	// 	ps.save(file, path);
	// 	return ResponseEntity.ok(dao.findById(id).get());
    // }
	
	
	@PutMapping("/rest/albums/{id}")
	public ResponseEntity<Album> put(@Valid @RequestBody Album album, @PathVariable("id") Long id){
		if(!dao.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
      
		album.setId(id);
       
		dao.save(album);
		return ResponseEntity.ok(album);
	}
	
	@DeleteMapping("/rest/albums/{id}")
	public ResponseEntity<Void> delete(@PathVariable("id") Long id){
		if(!dao.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		dao.deleteById(id);
		return ResponseEntity.ok().build();
	}
}
