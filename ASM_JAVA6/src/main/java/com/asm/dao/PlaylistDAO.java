package com.asm.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.asm.entity.Account;
import com.asm.entity.Playlist;

public interface PlaylistDAO extends JpaRepository<Playlist, Long> {
	List<Playlist> findByCreator(Account account);
	// @Query("SELECT p FROM Playlist p WHERE p.creator = :creatorId")
	// List<Playlist> findByCreator(@Param("creatorId") Account account);
}
