package com.asm.restController;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.asm.dao.AccountDAO;
import com.asm.dao.FavoriteDAO;
import com.asm.dao.SongDAO;
import com.asm.entity.Account;
import com.asm.entity.Favorite;
import com.asm.entity.Song;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * FavoriteRestController
 */
@RestController
public class FavoriteRestController {

    @Autowired
    private FavoriteDAO dao;

    @Autowired
    private SongDAO sdao;

    @Autowired
    private AccountDAO adao;

    @GetMapping("/rest/fav")
    public ResponseEntity<List<Favorite>> getAllFav() {
        return ResponseEntity.ok(dao.findAll());
    }

    @GetMapping("/rest/fav/{userId}")
    public ResponseEntity<List<Favorite>> getFavBySongUserId(@PathVariable("userId") String userId) {
        List<Favorite> f = dao.findFavoriteByUserId(userId);
        return ResponseEntity.ok(f);
    }

    @PostMapping(value = "/rest/fav/add/{songId}/{userId}")
    public ResponseEntity<Favorite> addFav(@PathVariable("songId") Long songId,
            @PathVariable("userId") String userId) {
        Favorite f = new Favorite();
        Song s = new Song();
        Account a = new Account();
        s = sdao.findById(songId).get();
        a = adao.findById(userId).get();
        f.setSong(s);
        f.setUser(a);
        f.setLikeDate(new Date());
        dao.saveAndFlush(f);

        return ResponseEntity.ok(f);
    }

    @DeleteMapping(value = "/rest/fav/del/{songId}/{userId}")
    public ResponseEntity<Favorite> deleteFav(@PathVariable("songId") Long songId,
            @PathVariable("userId") String userId) {
        Favorite f = new Favorite();
        f = dao.findFavoriteBySongIdAndUserId(songId, userId);
        dao.delete(f);

        return ResponseEntity.ok().build();

    }

}