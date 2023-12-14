package com.asm.dao;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.asm.entity.AccessLog;
import com.asm.entity.DailyAccessDto;


/**
 * AccessLogControllerDAO
 */
public interface AccessLogDAO extends JpaRepository<AccessLog, Long> {

    @Query("SELECT new com.asm.entity.DailyAccessDto(CAST(a.timestamp AS DATE) AS date_only, COUNT(a)) FROM AccessLog a GROUP BY CAST(a.timestamp AS DATE) ORDER BY CAST(a.timestamp AS DATE) ASC")
    
    Page<DailyAccessDto> findDailyAccess(Pageable pageable);
    
    // select CAST(timestamp AS DATE) AS date_only, COUNT(access_log.ip_address) FROM access_log where timestamp between '2023-11-27' and '2023-11-30'   GROUP BY CAST(timestamp AS DATE) ORDER BY CAST(timestamp AS DATE) ASC

    @Query("SELECT new com.asm.entity.DailyAccessDto(CAST(a.timestamp AS DATE) AS date_only, COUNT(a)) FROM AccessLog a WHERE a.timestamp BETWEEN :beginDate AND :endDate GROUP BY CAST(a.timestamp AS DATE) ORDER BY CAST(a.timestamp AS DATE) ASC")
    Page<DailyAccessDto> findDailyAccessBetweenDate(Pageable pageable, @Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);
    

}
