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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.asm.dao.AlbumDAO;
import com.asm.dao.SongDAO;
import com.asm.dao.SongGenreDAO;
import com.asm.dao.SongSingerDAO;
import com.asm.entity.Album;
import com.asm.entity.Genre;
import com.asm.entity.Singer;
import com.asm.entity.Song;
import com.asm.entity.SongInfo;
import com.asm.service.ParamService;

@RestController
public class SongRestController {

    @Autowired
    private SongDAO songdao;

    @Autowired
    private AlbumDAO albumdao;

    @Autowired
    private ParamService ps;
    @Autowired
    SongSingerDAO songsingerDAO;
    @Autowired
    SongGenreDAO songgenreDAO;

    @GetMapping("/rest/songsinfo/")
    public ResponseEntity<List<SongInfo>> songinfo() {
        List<Song> songs = songdao.findAll();
        System.out.println(songs.size());
        List<SongInfo> songInfos = new ArrayList<>();

        for (Song s : songs) {
            List<Genre> genres = songgenreDAO.findGenresBySongId(s.getId());
            List<Singer> singers = songsingerDAO.findSingersBySongId(s.getId());
            SongInfo sInfo = new SongInfo(s, singers, genres);
            songInfos.add(sInfo);
        }
        return ResponseEntity.ok(songInfos);
    }

    @GetMapping("/rest/songsinfo/{albumId}")
    public ResponseEntity<List<SongInfo>> songinfosByAlbumId(@PathVariable Long albumId) {
        List<Song> songs = songdao.findSongsByAlbumId(albumId);
        System.out.println(songs.size());
        List<SongInfo> songInfos = new ArrayList<>();

        for (Song s : songs) {
            List<Genre> genres = songgenreDAO.findGenresBySongId(s.getId());
            List<Singer> singers = songsingerDAO.findSingersBySongId(s.getId());
            SongInfo sInfo = new SongInfo(s, singers, genres);
            songInfos.add(sInfo);
        }
        return ResponseEntity.ok(songInfos);
    }

    @GetMapping("/rest/songs/{albumId}")
    public ResponseEntity<List<Song>> getSongByAlbumId(@PathVariable Long albumId) {
        List<Song> song = songdao.findSongsByAlbumId(albumId);
        return ResponseEntity.ok(song);
    }

    @GetMapping("/rest/song")
    public ResponseEntity<List<Song>> getSong() {
        List<Song> song = songdao.findAll();
        return ResponseEntity.ok(song);
    }

    @GetMapping("/rest/song/{id}")
    public ResponseEntity<Song> getSongbyID(@PathVariable("id") Long id) {
        Song s = new Song();
        s = songdao.findById(id).get();
        return ResponseEntity.ok(s);
    }

    @PostMapping("/rest/song/img")
    public ResponseEntity<Void> uploadIMG(@RequestParam("file") MultipartFile file) {
        String path = "/asset/img/song/";

        ps.save(file, path);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/rest/song/sound")
    public ResponseEntity<Void> uploadSound(@RequestParam("fileAudio") MultipartFile fileAudio) {
        String path = "/asset/audio/";

        ps.save(fileAudio, path);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/rest/song")
    public ResponseEntity<Song> save(@RequestParam("name") String name, @RequestParam("album") Long albumId,
            @RequestParam("img") String img, @RequestParam("path") String path) {
        Album al = new Album();
        al = albumdao.findById(albumId).get();
        Song s = new Song();
        s.setName(name);
        s.setAlbum(al);
        s.setImage(img);
        s.setPath(path);
        songdao.save(s);
        return ResponseEntity.ok(s);
    }

    @PutMapping("/rest/song/update")
    public ResponseEntity<Song> update(@RequestParam("id") Long id, @RequestParam("name") String name,
            @RequestParam("album") Long albumId, @RequestParam("img") String img, @RequestParam("path") String path) {

        Album al = new Album();
        al = albumdao.findById(albumId).get();
        Song s = new Song();
        s.setId(id);
        s.setName(name);
        s.setAlbum(al);
        s.setImage(img);
        s.setPath(path);
        songdao.save(s);
        return ResponseEntity.ok(s);
    }

    @DeleteMapping("/rest/song/delete/{id}")
    public ResponseEntity del(@PathVariable("id") Long id) {
        songdao.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
