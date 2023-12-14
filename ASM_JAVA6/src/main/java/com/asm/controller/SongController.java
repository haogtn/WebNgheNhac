package com.asm.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * SongController
 */
@Controller
public class SongController {
    @RequestMapping("admin/song/index")
    public String show(){
        return "/admin/song/index";
    }
    
}