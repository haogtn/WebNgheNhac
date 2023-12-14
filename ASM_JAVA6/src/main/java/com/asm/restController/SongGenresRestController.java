package com.asm.restController;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.asm.dao.GenreDAO;
import com.asm.dao.SongDAO;
import com.asm.dao.SongGenreDAO;
import com.asm.entity.Genre;
import com.asm.entity.Singer;
import com.asm.entity.Song;
import com.asm.entity.SongGenre;
import com.asm.entity.SongSinger;

/**
 * SongGenresRestController
 */
@RestController
public class SongGenresRestController {

    @Autowired
    SongGenreDAO dao;

    @Autowired
    GenreDAO gdao;

    @Autowired
    SongDAO sdao;

    @GetMapping("/rest/songGenres")
    public ResponseEntity<List<SongGenre>> getAllSongGenres(Model mdoel) {
        // mdoel.addAttribute("ua", "La sao");
        return ResponseEntity.ok(dao.findAll());
    }

    @GetMapping("/rest/songGenres/genres/{songId}")
    public ResponseEntity<List<Genre>> getSongGenresBySongId(@PathVariable("songId") Long songId) {
        return ResponseEntity.ok(dao.findGenresBySongId(songId));
    }

    @PostMapping("/rest/songGenres")
    public ResponseEntity<List<SongGenre>> createSongGenre(@RequestParam("genres") Long[] genres,
            @RequestParam("song") Long songID) {
        for (Long genre : genres) {
            Genre g = new Genre();
            g = gdao.findById(genre).get();
            Song s = new Song();
            s = sdao.findById(songID).get();
            SongGenre sg = new SongGenre();
            sg.setGenre(g);
            sg.setSong(s);
            dao.save(sg);
        }

        return ResponseEntity.ok(dao.findAll());
    }
    @PostMapping("/rest/songGenres/update")
    public ResponseEntity<List<SongGenre>> updateSongGenres( @RequestParam("genresId") Long[] ids, @RequestParam("songId") Long songId) {
        List<SongGenre> sg = new ArrayList<>();
        sg = dao.findSongGenresBySongId(songId);
        for (SongGenre songGenre : sg) {
            dao.deleteById(songGenre.getId());
        }
        for (Long id : ids) {
            Genre g = new Genre();
            g = gdao.findById(id).get();
            Song s = new Song();
            s = sdao.findById(songId).get();
            SongGenre sgs = new SongGenre();
            sgs.setGenre(g);
            sgs.setSong(s);
            dao.save(sgs);
            
        }

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/rest/songGenres/delete/{id}")
    public ResponseEntity<Void> del(@PathVariable("id") Long id){
        List<SongGenre> sg = dao.findSongGenresBySongId(id);
        for (SongGenre songGenres : sg) {
            dao.deleteById(songGenres.getId());
        }
        return ResponseEntity.ok().build();
    }
}