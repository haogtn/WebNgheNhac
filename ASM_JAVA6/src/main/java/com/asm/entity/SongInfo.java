package com.asm.entity;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SongInfo {
    private Song song;
    private List<Singer> singers;
    private List<Genre> genres;

}
