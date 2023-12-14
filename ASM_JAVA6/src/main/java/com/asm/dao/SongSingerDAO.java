package com.asm.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.asm.entity.Singer;
import com.asm.entity.SongGenre;
import com.asm.entity.SongSinger;

public interface SongSingerDAO extends JpaRepository<SongSinger, Long> {
     @Query("SELECT a.singer FROM SongSinger a WHERE a.song.id = :songId")
    List<Singer> findSingersBySongId(@Param("songId") Long songId);

    @Query("select ss from SongSinger ss where ss.song.id = :songId")
    List<SongSinger> findSongSingerBySongId(@Param("songId") Long songId);
}
