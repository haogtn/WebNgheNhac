package com.asm.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.asm.entity.Singer;

public interface SingerDAO extends JpaRepository<Singer, Long> {

}
