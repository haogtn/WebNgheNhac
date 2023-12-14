package com.asm.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.asm.entity.Album;
import com.asm.entity.Favorite;

public interface AlbumDAO extends JpaRepository<Album, Long>{
 
}
