package com.asm.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.asm.entity.Genre;
import com.asm.entity.Singer;
import com.asm.entity.SongGenre;

public interface SongGenreDAO extends JpaRepository<SongGenre, Long> {

    @Query("select sg from SongGenre sg where sg.song.id = :songId")
    List<SongGenre> findSongGenresBySongId(@Param("songId") Long songId);

    @Query("SELECT a.genre FROM SongGenre a WHERE a.song.id = :songId")
    List<Genre> findGenresBySongId(@Param("songId") Long songId);
 
    @Query("select sg from SongGenre sg where sg.song.id = :songId and sg.genre.id = :genreId")
    List<SongGenre> findSongGenresBySongIdandGenreId(@Param("songId") Long songId, @Param("genreId") Long genreId);
}
