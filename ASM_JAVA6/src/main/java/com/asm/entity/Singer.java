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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Singers")
public class Singer {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@NotBlank(message = "Tên Không được để trống!")
	private String name;
	@JsonIgnore
	@OneToMany(mappedBy = "singer")
	private List<SingerAlbum> singerAlbums;
	@JsonIgnore
	@OneToMany(mappedBy = "singer")
	private List<SongSinger> songSinger;
}
