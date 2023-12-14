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

import com.asm.dao.PlaylistSongDAO;
import com.asm.entity.PlaylistSong;
import com.asm.service.ParamService;

import jakarta.validation.Valid;

@RestController
public class PlaylistSongRestController {
	@Autowired
	PlaylistSongDAO dao;
	@Autowired
	ParamService ps;

	@Autowired
	ParamService paS;

	@GetMapping("/rest/playlistsong")
	public ResponseEntity<List<PlaylistSong>> getAll(Model model) {
		return ResponseEntity.ok(dao.findAll());
	}

	// LẤY TẤT CẢ PLAYLIST VỚI ID PLAYLIST
	@GetMapping("/rest/playlistsong/playlist/{playlistId}")
	public ResponseEntity<List<PlaylistSong>> getSongPlaylistByPlaylist(@PathVariable("playlistId") Long playlistId) {
		List<PlaylistSong> playlistSongs = dao.findByPlaylist_id(playlistId);

		if (playlistSongs.isEmpty()) {
			return ResponseEntity.notFound().build();
		}

		return ResponseEntity.ok(playlistSongs);
	}

	// LẤY TẤT CẢ PLAYLIST VỚI ID PLAYLIST và SONG ID
	@GetMapping("/rest/playlistsong/playlist/{playlistId}/{songId}")
	public ResponseEntity<PlaylistSong> getSongPlaylistByPlaylistNSong(
			@PathVariable("playlistId") Long playlistId, @PathVariable("songId") Long songId) {
		PlaylistSong playlistSongs = dao.findByPlaylistIdAndSongId(playlistId, songId);

		if (playlistSongs == null) {
			return ResponseEntity.notFound().build();
		}

		return ResponseEntity.ok(playlistSongs);
	}

	@GetMapping("/rest/playlistsong/{id}")
	public ResponseEntity<PlaylistSong> getOne(@PathVariable("id") Long id) {
		if (!dao.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(dao.findById(id).get());
	}

	@PostMapping("/rest/playlistsong")
	public ResponseEntity<PlaylistSong> create(@Valid @RequestBody PlaylistSong playlistsong) {

		dao.save(playlistsong);

		return ResponseEntity.ok(playlistsong);
	}

	@PutMapping("/rest/playlistsong/{id}")
	public ResponseEntity<PlaylistSong> put(@Valid @RequestBody PlaylistSong playlistsong,
			@PathVariable("id") Long id) {
		if (!dao.existsById(id)) {
			return ResponseEntity.notFound().build();
		}

		playlistsong.setId(id);

		dao.save(playlistsong);
		return ResponseEntity.ok(playlistsong);
	}

	@DeleteMapping("/rest/playlistsong/{id}")
	public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
		if (!dao.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		dao.deleteById(id);
		return ResponseEntity.ok().build();
	}
}
