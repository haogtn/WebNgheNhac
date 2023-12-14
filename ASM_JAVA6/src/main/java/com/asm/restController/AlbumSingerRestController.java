package com.asm.restController;


import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.asm.dao.AlbumDAO;
import com.asm.dao.SingerAlbumDAO;
import com.asm.dao.SingerDAO;
import com.asm.entity.Singer;
import com.asm.entity.SingerAlbum;

@RestController
public class AlbumSingerRestController {

    @Autowired
    private SingerAlbumDAO dao;

     @Autowired
    private SingerDAO sdao;

     @Autowired
    private AlbumDAO adao;


     @GetMapping("/rest/singerAlbum/singer/{albumId}")
    public ResponseEntity<List<Singer>> getSingersByAlbumId(@PathVariable Long albumId) {
        List<Singer> singers = dao.findSingersByAlbumId(albumId);
        return ResponseEntity.ok(singers);
    }

    @GetMapping("/rest/singerAlbum/{albumId}/{singerId}")
    public ResponseEntity<SingerAlbum> getSingersByAlbumId(@PathVariable("albumId") Long albumId, @PathVariable("singerId") Long singerId) {
        SingerAlbum singers = dao.findSingerAlbumsByAlbumAndSinger(albumId, singerId);
        return ResponseEntity.ok(singers);
    }

    @GetMapping("/rest/singerAlbum")
    public ResponseEntity<List<SingerAlbum>> getAll() {
        return  ResponseEntity.ok(dao.findAll());
    }

    @PostMapping("/rest/singerAlbum")
    public ResponseEntity<SingerAlbum> addSingerToAlbum(@RequestParam Long albumId, @RequestParam Long singerId) {

        SingerAlbum sa = new SingerAlbum();
        sa.setAlbum(adao.findById(albumId).get());
        sa.setSinger(sdao.findById(singerId).get());
        dao.save(sa);
        return ResponseEntity.ok(sa);
    }

    @PutMapping("/rest/singerAlbum/{id}")
    public ResponseEntity<SingerAlbum> updateSingerToAlbum(@RequestParam Long albumId, @RequestParam Long singerId, @PathVariable("id") Long id) {

        SingerAlbum sa = new SingerAlbum();
        sa.setId(id);
        sa.setAlbum(adao.findById(albumId).get());
        sa.setSinger(sdao.findById(singerId).get());
        dao.save(sa);
        return ResponseEntity.ok(sa);
    }

    @DeleteMapping("/rest/singerAlbum/{albumId}/{singerId}")
    public ResponseEntity<Void> removeSingerFromAlbum(@PathVariable("albumId") Long albumId, @PathVariable("singerId") Long singerId) {
        SingerAlbum sa = dao.findSingerAlbumsByAlbumAndSinger(albumId, singerId);
        dao.deleteById(sa.getId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/rest/singerAlbum/delAll/{albumId}")
    public ResponseEntity<Void> deleteAllAlbumSingerById(@PathVariable("albumId") Long albumId) {
    	List<SingerAlbum> sa = new ArrayList<SingerAlbum>();
    	sa = dao.findSingerAlbumsByAlbumId(albumId);
    	for (SingerAlbum singerAlbum : sa) {
			dao.deleteById(singerAlbum.getId());
		}
        return ResponseEntity.ok().build();
    }
}
