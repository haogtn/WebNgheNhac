package com.asm.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.asm.dao.SingerAlbumDAO;
import com.asm.entity.SingerAlbum;

@Controller
public class AlbumController {

	@Autowired
	SingerAlbumDAO dao;

	@RequestMapping("/album/index")
	public String index() {
//		List<SingerAlbum> sa = new ArrayList<SingerAlbum>();
//		sa = (List<SingerAlbum>) dao.findSingerAlbumsByAlbumId(11L);
//		for (SingerAlbum singerAlbum : sa) {
//			System.out.println(singerAlbum.getId());
//		}
		return "/admin/album/index";
	}
	
	@RequestMapping("/album/edit")
	public String edit() {
		return "admin/album/editor";
	}


}
