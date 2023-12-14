package com.asm.controller;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.asm.dao.*;
import com.asm.entity.*;

@Controller
public class PlaylistController {
    @Autowired
    PlaylistDAO playlistDAO;
    @Autowired
    PlaylistSongDAO playlistSongDAO;
    @Autowired
    SongDAO songDAO;
    @Autowired
    SongSingerDAO songsingerDAO;
    @Autowired
    SongGenreDAO songgenreDAO;
    @Autowired
    AccountDAO accountDAO;

    @RequestMapping("/playlist/detail/{id}")
    public String playlist_detail(@PathVariable("id") Long id, Model model) {
        List<PlaylistSong> playlistSongs = playlistSongDAO.findByPlaylist_id(id);
        List<Song> songInPlaylist = new ArrayList<>();

        for (PlaylistSong playlistSong : playlistSongs) {
            // Truy cập đối tượng Song từ đối tượng PlaylistSong
            Song song = playlistSong.getSong();
System.out.println("SONGGG "+song.getName());
            // Thêm đối tượng Song vào danh sách songInPlaylist
            songInPlaylist.add(song);
        }
        

        model.addAttribute("album", playlistSongs);
        model.addAttribute("songs", songInPlaylist);
        return "playlistDetail";
    }
}
