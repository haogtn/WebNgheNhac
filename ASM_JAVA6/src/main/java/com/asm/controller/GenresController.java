package com.asm.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
@Controller
public class GenresController {
    // Quản lý thể loại nhạc
   

    @RequestMapping("/genres/index")
    public String genresI(){
        return "admin/genres/index";
    }

   

    
    // --------------
}
