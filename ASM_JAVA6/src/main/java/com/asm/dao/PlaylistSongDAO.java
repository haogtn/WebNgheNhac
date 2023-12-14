package com.asm.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.asm.entity.PlaylistSong;

public interface PlaylistSongDAO extends JpaRepository<PlaylistSong, Long> {
	List<PlaylistSong> findByPlaylist_id(Long playlistId);

	// @Query("SELECT ps FROM PlaylistSong ps WHERE ps.playlist.id = :playlistId")
	// List<PlaylistSong> findByPlaylistId(@Param("playlistId") Long playlistId);
	@Query(value = "SELECT * FROM playlist_song WHERE playlist_id = :playlistId AND song_id = :songId", nativeQuery = true)
	PlaylistSong findByPlaylistIdAndSongId(@Param("playlistId") Long playlistId, @Param("songId") Long songId);

}
