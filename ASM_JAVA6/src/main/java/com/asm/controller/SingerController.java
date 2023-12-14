package com.asm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.asm.dao.SingerDAO;
import com.asm.entity.Singer;

/**
 * SingerController
 */
@Controller
public class SingerController {

    @Autowired
    SingerDAO dao;

    @RequestMapping("/singer/index")
    public String index(Model model){
        model.addAttribute("singer", new Singer());
        model.addAttribute("singers",dao.findAll());
        return "admin/singer/index";
    }
    

    // @RequestMapping("/singer/coa")
    // public String saveOrUpdate(@ModelAttribute("singer") Singer singer){
    //     dao.save(singer);
    //     return "redirect:/singer/index";
    // }
   
    //  @RequestMapping("/singer/del/{id}")
    // public String del(@ModelAttribute("singer") Singer singer, @PathVariable("id") Long id){
    //     dao.deleteById(id);
    //     return "redirect:/singer/index";
    // }

    // @RequestMapping("/singer/edit/{id}")
    // public String edit(@ModelAttribute("singer") Singer singer, @PathVariable("id") Long id, Model model){
    //    Singer s = dao.findById(id).get();
    //     model.addAttribute("singer", s);
    //      model.addAttribute("singers",dao.findAll());
    //     return "admin/singer/index";
    // }
    

    
}