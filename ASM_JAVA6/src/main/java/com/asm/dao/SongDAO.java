package com.asm.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.asm.entity.Song;

public interface SongDAO extends JpaRepository<Song, Long> {
	@Query("SELECT s FROM Song s WHERE s.album.id = :albumId")
	List<Song> findSongsByAlbumId(@Param("albumId") Long albumId);

}
