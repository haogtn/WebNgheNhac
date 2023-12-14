package com.asm.controller;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.asm.dao.*;
import com.asm.entity.*;

@Controller
public class AlbumDetailController {
    @Autowired
    AlbumDAO albumDAO;
    @Autowired
    SingerAlbumDAO genreDAO;
    @Autowired
    SongDAO songDAO;
    @Autowired
    SongSingerDAO songsingerDAO;
    @Autowired
    SongGenreDAO songgenreDAO;
    @Autowired
    AccountDAO accountDAO;

    @RequestMapping("/album/detai/{id}")
    public String album_detail(@PathVariable("id") Long id, Model model) {
        Album album = albumDAO.findById(id).get();
        List<Song> songs = songDAO.findSongsByAlbumId(id);
        // Account optionalAccount = new Account();
        // Authentication authentication =
        // SecurityContextHolder.getContext().getAuthentication();

        // if (authentication != null && authentication.isAuthenticated()
        // && authentication.getPrincipal() instanceof UserDetails) {
        // UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        // String username = userDetails.getUsername();

        // // Lấy thông tin tài khoản từ username
        // optionalAccount = accountDAO.findByEmail(username);

        // }

        model.addAttribute("album", album);
        model.addAttribute("songs", songs);
        return "detail";
    }
}
