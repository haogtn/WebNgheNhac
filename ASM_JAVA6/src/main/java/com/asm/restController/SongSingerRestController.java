package com.asm.restController;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.asm.entity.Genre;
import com.asm.entity.Singer;
import com.asm.entity.Song;
import com.asm.entity.SongGenre;
import com.asm.entity.SongSinger;
import com.asm.dao.SingerDAO;
import com.asm.dao.SongDAO;
import com.asm.dao.SongSingerDAO;

@RestController
public class SongSingerRestController {

    @Autowired
    private SongSingerDAO dao;
  
    @Autowired
    private SongDAO sdao;

    @Autowired
    private SingerDAO sigdao;

    @GetMapping("/rest/songSinger")
    public ResponseEntity<List<SongSinger>> getSongsinger(){
        
        return ResponseEntity.ok(dao.findAll());
    }

    @GetMapping("/rest/songSinger/singer/{id}")
    public ResponseEntity<List<Singer>> getSingerBySongId(@PathVariable("id") Long id){

        return ResponseEntity.ok(dao.findSingersBySongId(id));
    }

    // @PostMapping("/rest/songSinger")
    // public ResponseEntity<List<SongSinger>> createSongGenre(@RequestParam("singers") Long[] singers, @RequestParam("song") Long songId){
    //     for (Long singer : singers) {
    //        Singer sig = new Singer();
    //        sig = sigdao.findById(singer).get();
    //         Song s = new Song();
    //         s = sdao.findById(songId).get();
    //        SongSinger ss = new SongSinger();
    //        ss.setSinger(sig);
    //        ss.setSong(s);
    //        dao.save(ss);
    //     }

    //     return ResponseEntity.ok(dao.findAll());
    // }
     @PostMapping("/rest/songSinger")
    public ResponseEntity<List<SongSinger>> createSongGenre(@RequestParam("singers") Long[] singers, @RequestParam("song") Long songId){
        for (Long singer : singers) {
            Singer sig = new Singer();
            sig = sigdao.findById(singer).get();
            Song s = new Song();
            s = sdao.findById(songId).get();
           SongSinger ss = new SongSinger();
           ss.setSinger(sig);
           ss.setSong(s);
           dao.save(ss);
        }

        return ResponseEntity.ok(dao.findAll());
    }

    @PostMapping("/rest/songSinger/update")
    public ResponseEntity<List<SongGenre>> updateSongGenres( @RequestParam("singerId") Long[] ids, @RequestParam("songId") Long songId) {
        List<SongSinger> ss = new ArrayList<>();
        ss = dao.findSongSingerBySongId(songId) ;
        for (SongSinger songSinger : ss) {
            dao.deleteById(songSinger.getId());
        }
        for (Long id : ids) {
            Singer singer = new Singer();
            singer = sigdao.findById(id).get();
            Song song = new Song();
            song = sdao.findById(songId).get();
            SongSinger songSinger = new SongSinger();
            songSinger.setSinger(singer);
            songSinger.setSong(song);
           
            dao.save(songSinger);
            
        }

        return ResponseEntity.ok().build();
    }
    @DeleteMapping("/rest/songSinger/delete/{id}")
    public ResponseEntity<Void> del(@PathVariable("id") Long id){
        List<SongSinger> ss = dao.findSongSingerBySongId(id);
        for (SongSinger songSinger : ss) {
            dao.deleteById(songSinger.getId());
        }
        return ResponseEntity.ok().build();
    }
}
