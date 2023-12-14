package com.asm.restController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.asm.dao.AccountDAO;
import com.asm.dao.PlaylistDAO;
import com.asm.entity.Account;
import com.asm.entity.Playlist;
import com.asm.service.ParamService;

import jakarta.validation.Valid;
@CrossOrigin("*")
@RestController
public class PlaylistRestController {
    @Autowired
    PlaylistDAO dao;
    @Autowired
    ParamService ps;
    @Autowired
    AccountDAO accountDAO;
    @Autowired
    ParamService paS;

    @GetMapping("/rest/playlist")
    public ResponseEntity<List<Playlist>> getAll(Model model) {
        return ResponseEntity.ok(dao.findAll());
    }

    @GetMapping("/rest/playlist/{id}")
    public ResponseEntity<Playlist> getOne(@PathVariable("id") Long id) {
        if (!dao.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dao.findById(id).get());
    }

    @GetMapping("/rest/playlist/creator/{creatorId}")
    public ResponseEntity<List<Playlist>> getSongPlaylistByPlaylist(@PathVariable("creatorId") String creatorId) {
        Account account = accountDAO.findById(creatorId).orElse(null);
        List<Playlist> playlist = dao.findByCreator(account);

        if (playlist.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(playlist);
    }

    @PostMapping("/rest/playlist")
    public ResponseEntity<Playlist> create(@Valid @RequestBody Playlist playlist) {

        dao.save(playlist);

        return ResponseEntity.ok(playlist);
    }

    @PutMapping("/rest/playlist/{id}")
    public ResponseEntity<Playlist> put(@Valid @RequestBody Playlist playlist, @PathVariable("id") Long id) {
        if (!dao.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        playlist.setId(id);

        dao.save(playlist);
        return ResponseEntity.ok(playlist);
    }

    @DeleteMapping("/rest/playlist/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        if (!dao.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        dao.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
