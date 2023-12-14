package com.asm.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="Albums")
public class Album {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@NotBlank(message = "Title is required")
	private String title;
	@NotBlank(message = "Please select an image")
	private String image;
	@NotNull(message =  "Year is required")
	private Integer releaseYear;
	@JsonIgnore
	@OneToMany(mappedBy = "album")
    private List<SingerAlbum> singerAlbums;
	@JsonIgnore
	@OneToMany(mappedBy = "album")
	private List<Song> songs;
}
