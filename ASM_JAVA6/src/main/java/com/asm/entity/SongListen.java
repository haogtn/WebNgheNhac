package com.asm.entity;

import java.sql.Date;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
@Data
@Entity
@Table(name ="SongListen")
public class SongListen {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "listen_id")
    private Long listenId;

    @ManyToOne
    @JoinColumn(name = "song_id", nullable = false)
    private Song song;
    
    @Column(name = "listen_time", nullable = false)
    private LocalDateTime listenTime;
}
