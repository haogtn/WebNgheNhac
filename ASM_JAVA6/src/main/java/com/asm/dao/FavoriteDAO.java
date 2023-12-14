package com.asm.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.asm.entity.Favorite;

public interface FavoriteDAO extends JpaRepository<Favorite, Long> {
    @Query("SELECT f FROM Favorite f WHERE f.song.id = :songId and f.user.username = :usernameId")
    Favorite findFavoriteBySongIdAndUserId(@Param("songId") Long songId, @Param("usernameId") String usernameId);

    @Query("SELECT f FROM Favorite f WHERE f.user.username = :username")
    List<Favorite> findFavoriteByUserId(@Param("username") String username);
}
