package com.asm.restController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.asm.dao.SongDAO;
import com.asm.dao.SongListenDAO;
import com.asm.entity.Song;
import com.asm.entity.SongListen;

@RestController
public class SongListenRestController {

    @Autowired
    SongListenDAO dao;

    @Autowired
    SongDAO sdao;

    @GetMapping("/rest/listen")
    public ResponseEntity<List<SongListen>> getAll(){
        return ResponseEntity.ok(dao.findAll());
    }

     @PostMapping("/rest/listen")
    public ResponseEntity<SongListen> post(@RequestParam("songId") Long songId){
        Song s = new Song();
        s = sdao.findById(songId).get();
        SongListen sl = new SongListen();
        sl.setSong(s);
        dao.save(sl);
        return ResponseEntity.ok(sl);
    }
}
