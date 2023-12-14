package com.asm.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.asm.entity.Singer;
import com.asm.entity.SingerAlbum;

@Repository
public interface SingerAlbumDAO extends JpaRepository<SingerAlbum, Long> {
    @Query("SELECT a.singer FROM SingerAlbum a WHERE a.album.id = :albumId")
    List<Singer> findSingersByAlbumId(@Param("albumId") Long albumId);

    // Lấy danh sách SingerAlbum theo albumId và singerId
    @Query("SELECT sa FROM SingerAlbum sa WHERE sa.album.id = :albumId AND sa.singer.id = :singerId")
    SingerAlbum findSingerAlbumsByAlbumAndSinger(@Param("albumId") Long albumId, @Param("singerId") Long singerId);

    @Query("SELECT sa FROM SingerAlbum sa WHERE sa.album.id = :albumId ")
    List<SingerAlbum> findSingerAlbumsByAlbumId(@Param("albumId") Long albumId);
}
