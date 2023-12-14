package com.asm.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.asm.dao.AccessLogDAO;
import com.asm.dao.AccountDAO;
import com.asm.entity.AccessLog;
import com.asm.entity.DailyAccessDto;
import com.asm.entity.ReportAccount;
import com.asm.service.SessionService;

@Controller
public class ReportController {

    @Autowired
    AccessLogDAO dao;

    @Autowired
    AccountDAO adao;

    @Autowired
    SessionService session;

    @RequestMapping("/admin/web-report/index")
    public String webTraffic(Model model, @RequestParam("p") Optional<Integer> p,
            @RequestParam("pAcc") Optional<Integer> pAcc) {

        Pageable pageable = PageRequest.of(p.orElse(0), 8);
        Page<DailyAccessDto> page = dao.findDailyAccess(pageable);
        model.addAttribute("page", page.getContent());
        model.addAttribute("maxPage", page.getTotalPages());
        System.out.println("MaxPage: " + page.getTotalPages() + "--------------------------------");
        Pageable pageableAcc = PageRequest.of(pAcc.orElse(0), 5);
        Page<ReportAccount> pageAcc = adao.selectQuanAccount(pageableAcc);
        model.addAttribute("pageAcc", pageAcc.getContent());
        model.addAttribute("maxPageAcc", pageAcc.getTotalPages());
        return "/admin/webReport/index";
    }

    @RequestMapping("/admin/web-report/index/day")
    public String selectByDay(Model model, @RequestParam("p") Optional<Integer> p,
            @RequestParam("beginDate") Optional<String> beginDate, @RequestParam("endDate") Optional<String> endDate) {

        if (!beginDate.isPresent() || !endDate.isPresent()) {
            model.addAttribute("error", "Please select a day!");
            return "/admin/webReport/index";
        }        
        if (!beginDate.isEmpty() & !endDate.isEmpty()) {
            String bd = beginDate.orElse(session.get("beginDate", ""));
            session.set("beginDate", bd);

            String ed = endDate.orElse(session.get("endDate", ""));
            session.set("endDate", ed);

            LocalDate localDateBegin = LocalDate.parse(bd);
            LocalDateTime beginDateTime = localDateBegin.atStartOfDay();

            LocalDate localDateEnd = LocalDate.parse(ed);
            LocalDateTime endDateTime = localDateEnd.atStartOfDay();

            Pageable pageable = PageRequest.of(p.orElse(0), 8);
            Page<DailyAccessDto> page = dao.findDailyAccessBetweenDate(pageable, beginDateTime, endDateTime);
            model.addAttribute("page", page.getContent());
            model.addAttribute("maxPage", page.getTotalPages());

        } else {
            model.addAttribute("error", "Please select a day!");
            return "/admin/webReport/index";
        }

        return "/admin/webReport/index";
    }

}
