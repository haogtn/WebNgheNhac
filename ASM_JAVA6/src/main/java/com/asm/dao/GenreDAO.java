package com.asm.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.asm.entity.Genre;

public interface GenreDAO extends JpaRepository<Genre, Long> {

}
