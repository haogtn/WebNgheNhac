let left_scroll = document.getElementById("left_scroll");
let right_scroll = document.getElementById("right_scroll");

let pop_song = document.getElementsByClassName("pop_song")[0];
if (left_scroll) {
  left_scroll.addEventListener("click", () => {
    console.log("hey");
    pop_song.scrollLeft -= 416;
  });
}
if (right_scroll) {
  right_scroll.addEventListener("click", () => {
    pop_song.scrollLeft += 416;
  });
}

var categoriesApi = "http://localhost:3900/categories";
var songsApi = "http://localhost:3900/songs";
var playlistsApi = "http://localhost:3900/playlists";

// Đầu tiên, tạo các biến cần thiết để lưu trữ dữ liệu
let currentPlaylist = []; // Danh sách bài hát hiện đang hiển thị
let currentIndex = 0; // Chỉ số của bài hát hiện tại

function getSongs(callback) {
  fetch(songsApi)
    .then((response) => response.json())
    .then((data) => {
      currentPlaylist = data;
      // Get song durations
      const promises = data.map((song) => {
        const audioUrl = `${song.audio}`;
        return getSongDuration(audioUrl).then((duration) => {
          song.duration = formatDuration(duration);
        });
      });

      // Wait for all promises to complete before rendering the songs
      Promise.all(promises).then(() => {
        callback(data);
        attachPlayButtonEvents();
      });
    })
    .catch((error) => {
      console.error("Error fetching songs:", error);
    });
}

// Function to get categories from the API
function getCategories(callback) {
  fetch(categoriesApi)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      callback(data);
    })
    .catch((error) => {
      console.error("Error fetching categories:", error);
    });
}

function getPlaylists(callback) {
  fetch(playlistsApi)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      callback(data);
    })
    .catch((error) => {
      console.error("Error fetching categories:", error);
    });
}

// Rest of the code remains the same

// Call the getCategories function with the renderCategories callback
getCategories(renderCategories);
getSongs(renderSongs);
getPlaylists(renderPlaylists);
// Rest of the code remains the same

// function getCategories(callback) {
//     fetch(categoriesApi)
//         .then((response) => response.json())
//         .then((data) => {
//             console.log("day la data", data);
//         });
// }

// getCategories();

function renderCategories(categories) {
  const listCategories = document.querySelector("#list-categories");
  const html = categories.map((category) => {
    return `<a href="detail.html?id=${category._id}?name=${category.name}" style="text-decoration:none">
    <li class="songItem">
    <div class="img_play">
        <img
            src="${category.thumbnail}"
            alt="alan" />
        <i class="bi fa-solid fa-circle-play" ></i>
    </div>
    <h5>
        <p class="line-clamp">${category.name}: Best of 2023</p>
        <div class="subtitle line-clamp line-2">
            Created by: QMUSIC
        </div>
    </h5>
</li>
</a>
    `;
  });
  listCategories.innerHTML = html.join("");
}

function renderSongs(songs) {
  const listSongs = document.querySelector("#list-songs");
  const html = songs.slice(0, 5).map((song) => {
    // Get song duration
    const audioUrl = `${song.audio}`;
    const audio = new Audio(audioUrl);

    audio.addEventListener("loadedmetadata", () => {
      const duration = audio.duration;
      const formattedDuration = formatDuration(duration);

      // Update the song duration in the table cell
      const songDurationCell = document.querySelector(
        `[data-audiourl="${audioUrl}"]`
      );
      if (songDurationCell) {
        songDurationCell.textContent = formattedDuration;
      }
    });
    console.log("bai hat", song);
    // Return the HTML content for each song
    return `
        <tr class="song-list-function">
          <td>
            <img src="${song.thumbnail}" alt="" />
            <i class="bi fa-solid fa-circle-play playListPlayWeb" id="playing-song"  data-songid="${song.id}"></i>
          </td>
          <td>
            <div class="table-title">
              <div class="line-clamp">${song.name}</div>
              <span class="table-song-type">MASTER</span>
            </div>
          </td>
          <td>${song.artist}</td>
          <td>${song.category}</td>
          <td class="song-duration" data-audiourl="${song.audio}">--:--</td>
          <td>
            <i song-id=${song.id} class="fa-solid fa-plus"></i>&nbsp;&nbsp;
            <i class="fa-regular fa-heart"></i>
          </td>
        </tr>
      `;
  });

  listSongs.innerHTML = html.join("");

  // Attach click event listeners to each play button
  attachPlayButtonEvents();
  attachAddButtonEvents(songs);
}

let currentSong = null;
let isPlaying = false; //save playing status song

function attachPlayButtonEvents() {
  var playButtons = document.getElementsByClassName("playListPlayWeb");
  // let playingSong = document.getElementById("playing-song");
  for (let i = 0; i < playButtons.length; i++) {
    playButtons[i].addEventListener("click", () => {
      let songId = playButtons[i].getAttribute("data-songid");
      console.log(songId);
      if (songId) {
        let songUrl = `${songsApi}/${songId}`;
        fetch(songUrl)
          .then((response) => {
            if (!response.ok) {
              throw new Error("network error");
            }
            return response.json();
          })
          .then((data) => {
            console.log(data);
            music.src = `${data.audio}`;
            music.play();
            //render;

            isPlaying = !isPlaying;
            masterPlay.classList.remove("fa-play");
            masterPlay.classList.add("fa-pause");
            currentSong = data;
            renderCurrentSong();
          })
          .catch((error) => {
            console.error("Lỗi khi lấy dữ liệu hoặc phân tích JSON:", error);
          });
      }
    });
  }
}

getSongs(renderSongs);

let masterPlay = document.getElementById("masterPlay");
masterPlay.addEventListener("click", () => {
  if (music.paused || music.currentTime <= 0) {
    music.play();
    masterPlay.classList.remove("fa-play");
    masterPlay.classList.add("fa-pause");
  } else {
    music.pause();
    masterPlay.classList.add("fa-play");
    masterPlay.classList.remove("fa-pause");
  }
  isPlaying = !music.paused;
});

/// render current song
function renderCurrentSong() {
  if (currentSong) {
    let poster = document.getElementById("poster_master_play");
    let title = document.getElementById("song-title");
    let artistName = document.getElementById("artist-name");
    let categoryName = document.getElementById("category-name");

    //update song content
    poster.src = `${currentSong.thumbnail}`;
    title.textContent = currentSong.name;
    artistName.textContent = currentSong.artist;
    categoryName.textContent = `PLAYING FROM: ${currentSong.category}`;
  }
}

////////////////////////////////

// Function to get song duration
async function getSongDuration(audioUrl) {
  const audio = new Audio(audioUrl);
  await audio.load(); // Wait for the audio metadata to be loaded
  return audio.duration;
}

// Function to format duration in "mm:ss" format
function formatDuration(duration) {
  let min = Math.floor(duration / 60);
  let sec = Math.floor(duration % 60);
  if (sec < 10) {
    sec = `0${sec}`;
  }
  return `${min}:${sec}`;
}

////////////////////////////////////////////////////////////////

const music = new Audio("What it is.mp3");

let currentStart = document.getElementById("currentStart");
let currentEnd = document.getElementById("currentEnd");
let seek = document.getElementById("seek");
let bar2 = document.getElementById("bar2");
let dot = document.getElementsByClassName("dot")[0];

music.addEventListener("timeupdate", () => {
  let music_curr = music.currentTime;
  let music_dur = music.duration;

  let min = Math.floor(music_dur / 60);
  let sec = Math.floor(music_dur % 60);
  if (sec < 10) {
    sec = `0${sec}`;
  }
  currentEnd.innerText = `${min}:${sec}`;

  let min1 = Math.floor(music_curr / 60);
  let sec1 = Math.floor(music_curr % 60);
  if (sec1 < 10) {
    sec1 = `0${sec1}`;
  }
  currentStart.innerText = `${min1}:${sec1}`;

  let progressbar = parseInt((music.currentTime / music.duration) * 100);
  seek.value = progressbar;
  let seekbar = seek.value;
  bar2.style.width = `${seekbar}%`;
  dot.style.left = `${seekbar}%`;
});

seek.addEventListener("change", () => {
  music.currentTime = (seek.value * music.duration) / 100;
});

music.addEventListener("ended", () => {
  masterPlay.classList.add("fa-play");
  masterPlay.classList.remove("fa-pause");
});

// Volume control

let vol_icon = document.getElementById("vol_icon");
let vol = document.getElementById("vol");
let vol_dot = document.getElementById("vol_dot");
let vol_bar = document.getElementsByClassName("vol_bar")[0];

vol.addEventListener("change", () => {
  if (vol.value == 0) {
    vol_icon.classList.remove("fa-volume-low");
    vol_icon.classList.add("fa-volume-xmark");
    vol_icon.classList.remove("fa-volume-high");
  }
  if (vol.value > 0) {
    vol_icon.classList.add("fa-volume-low");
    vol_icon.classList.remove("fa-volume-xmark");
    vol_icon.classList.remove("fa-volume-high");
  }
  if (vol.value > 50) {
    vol_icon.classList.remove("fa-volume-low");
    vol_icon.classList.remove("fa-volume-xmark");
    vol_icon.classList.add("fa-volume-high");
  }

  let vol_a = vol.value;
  vol_bar.style.width = `${vol_a}%`;
  vol_dot.style.left = `${vol_a}%`;
  music.volume = vol_a / 100;
});

function playNextSong() {
  if (currentPlaylist.length === 0) {
    return;
  }
  currentIndex = (currentIndex + 1) % currentPlaylist.length;
  const nextSong = currentPlaylist[currentIndex];
  playSong(nextSong);
}

const nextBtn = document.getElementById("next");
if (nextBtn) {
  console.log(`hello btn web`);
  nextBtn.addEventListener("click", () => {
    playNextSong();
  });
}

function playSong(song) {
  music.src = `${song.audio}`;
  music.play();
  if (song) {
    let poster = document.getElementById("poster_master_play");
    let title = document.getElementById("song-title");
    let artistName = document.getElementById("artist-name");
    let categoryName = document.getElementById("category-name");

    //update song content
    poster.src = `${song.thumbnail}`;
    title.textContent = song.name;
    artistName.textContent = song.artist;
    categoryName.textContent = `PLAYING FROM: ${song.category}`;
  }
  console.log("Playing:", song.name, "Audio:", song.audio);
}

////////////////////////////////

function openModal() {
  const modal = document.getElementById("playlistModal");
  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("playlistModal");
  modal.style.display = "none";
}

function openModalUpdate() {
  const modal = document.getElementById("playlistUpdateModal");
  modal.style.display = "block";
}

function closeModalUpdate() {
  const modal = document.getElementById("playlistUpdateModal");
  modal.style.display = "none";
}

function renderPlaylists(playlists) {
  const listPlaylist = document.getElementById("list-playlists");
  const userId = sessionStorage.getItem("idUser");
  console.log(userId);
  const html = playlists.map((playlist) => {
    console.log(playlist);
    if (playlist.userid === userId)
      return `
        <div class="playlist-items" >
        <a href="playlist.html?id=${playlist.id}">${playlist.name}</a>
        <span>
        <a href="#" data-name="${playlist.name}"   data-id="${playlist.id}" data-toggle="tooltip"  title="Update"><i class="fa-solid fa-pen"></i></a>
        <a href="#" data-id="${playlist.id}" data-toggle="tooltip" title="Delete"><i class="fa-solid fa-square-minus"></i></a>
        </div>
      </span>
        `;
    else {
      return ``;
    }
  });
  listPlaylist.innerHTML = html.join("");

  const updateButtons = listPlaylist.getElementsByClassName("fa-solid fa-pen");
  Array.from(updateButtons).forEach((a) => {
    a.addEventListener("click", (event) => {
      event.preventDefault(); // Ngăn chặn hành vi mặc định của link
      console.log("click duoc roi");
      const targetId = event.target.closest(
        'a[data-toggle="tooltip"][ title="Update"]'
      );
      const playlistId = targetId.getAttribute("data-id");
      const playlistName = targetId.getAttribute("data-name");
      console.log(playlistId, playlistName);
      const playlist = findPlaylistById(playlistId); // Hàm này để lấy thông tin playlist từ server (cần tự viết)
      // Hiển thị modal với thông tin playlist cần chỉnh sửa
      displayUpdateModal(playlistId, playlistName);
    });
  });
}
function findPlaylistById(playlistId) {
  // Gửi yêu cầu GET để lấy thông tin playlist từ server dựa vào playlistId
  return fetch(`http://localhost:3900/playlists/${playlistId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Trả về thông tin playlist
      return data;
    })
    .catch((error) => {
      console.error("Error fetching playlist:", error);
      // Xử lý lỗi hoặc hiển thị thông báo lỗi tại đây
    });
}

function addPlaylist(playlist) {
  const submitPlaylist = document.getElementById("submit-playlist");
  if (submitPlaylist) {
    console.log(submitPlaylist);
    submitPlaylist.addEventListener("click", (e) => {
      e.preventDefault();
      const namePlaylist = document.getElementById("name-playlist").value;
      const userId = sessionStorage.getItem("idUser");
      console.log(namePlaylist);
      console.log(userId);
      // Tạo một đối tượng chứa dữ liệu category
      const data = {
        name: namePlaylist,
        user: userId,
      };
      // Gửi yêu cầu POST sử dụng Ajax
      fetch("http://localhost:3900/playlists/add-playlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Playlist added:", data);
          // Tiến hành xử lý dữ liệu hoặc thông báo thành công tại đây
        })
        .catch((error) => {
          console.error("Error adding playlist:", error);
          // Xử lý lỗi hoặc hiển thị thông báo lỗi tại đây
        });
      //    // window.location.href = "index.html";
      closeModal();
      getPlaylists(renderPlaylists);
    });
  } else {
    console.error("Error adding category");
  }
}
addPlaylist();

/////////////update range

function displayUpdateModal(playlistId, currentName) {
  // Hiển thị modal

  const playlistUpdateModal = document.getElementById("playlistUpdateModal");
  const namePlaylistInput = document.getElementById("name-playlist-update");
  console.log(playlistUpdateModal, namePlaylistInput, "hien ben display");
  // // Hiển thị tên playlist hiện tại lên input trong modal
  namePlaylistInput.value = currentName;
  // Gán thuộc tính data-id cho nút "Save" trong modal
  const updatePlaylistButton = document.getElementById("update-playlist");
  updatePlaylistButton.setAttribute("data-id", playlistId);

  // Thêm sự kiện click cho nút "Save"
  updatePlaylistButton.addEventListener("click", () => {
    const updatedName = namePlaylistInput.value;
    updatePlaylist(playlistId, updatedName);
    closeModalUpdate();
  });

  openModalUpdate();
}

function updatePlaylist(playlistId, newName) {
  const data = {
    name: newName,
  };

  fetch(`http://localhost:3900/playlists/${playlistId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Playlist updated:", data);
      // Tiến hành xử lý dữ liệu hoặc thông báo thành công tại đây
      // Sau khi cập nhật thành công, ta gọi hàm renderPlaylists để cập nhật danh sách playlist mà không cần truyền tham số
      getPlaylists(renderPlaylists);
    })
    .catch((error) => {
      console.error("Error updating playlist:", error);
      // Xử lý lỗi hoặc hiển thị thông báo lỗi tại đây
    });
}

/////////////////////////update range end

//////// Add TO Playlist
function renderPlaylistsModel(playlists) {
  const listPlaylist = document.getElementById("list-playlists-model");
  const userId = sessionStorage.getItem("idUser");
  console.log(userId);
  const html = playlists.map((playlist) => {
    console.log(playlist);
    if (playlist.userid === userId)
      return `<div class="playlist-item" data-playlistid="${playlist.id}">${playlist.name}</div>`;
    else {
      return ``;
    }
  });
  listPlaylist.innerHTML = html.join("");
}

getPlaylists(renderPlaylistsModel);

function closeAddToPlaylistModal() {
  const addToPlaylistModal = document.getElementById("addToPlaylistModal");
  addToPlaylistModal.style.display = "none";
}

function attachAddButtonEvents(songs) {
  const addButton = document.querySelectorAll(".fa-solid.fa-plus");
  addButton.forEach((button) => {
    button.addEventListener("click", (event) => {
      const songId = event.target.getAttribute("song-id");
      // Lấy ID của bài hát từ thuộc tính data-songid của button

      // Hiển thị modal chứa danh sách các playlist để chọn
      displayAddToPlaylistModal(songId);
    });
  });
}

function displayAddToPlaylistModal(songId) {
  const addToPlaylistModal = document.getElementById("addToPlaylistModal");
  addToPlaylistModal.style.display = "block";

  // Lấy danh sách các playlist từ API hoặc bất kỳ nguồn dữ liệu nào
  const playlistDropdown = document.getElementById("list-playlists-model");
  // Hiển thị danh sách các playlist trong modal

  // Gắn sự kiện click cho mỗi phần tử playlist trong danh sách
  const playlistItems =
    playlistDropdown.getElementsByClassName("playlist-item");
  Array.from(playlistItems).forEach((item) => {
    item.addEventListener("click", () => {
      // Lấy ID của playlist từ thuộc tính data-playlistid
      const playlistId = item.dataset.playlistid;
      // Gọi hàm để thêm bài hát vào playlist
      addSongToPlaylist(songId, playlistId);
      // Đóng modal sau khi thêm thành công hoặc xử lý xong
      addToPlaylistModal.style.display = "none";
    });
  });
}

function addSongToPlaylist(songId, playlistId) {
  // Định nghĩa dữ liệu để gửi đến API
  const data = {
    songId: songId,
    playlistId: playlistId,
  };

  // Gửi yêu cầu PUT sử dụng fetch API
  fetch(`http://localhost:3900/playlists/${playlistId}/add-song`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Song added to playlist:", result);
      // Tiến hành xử lý dữ liệu hoặc hiển thị thông báo thành công tại đây
    })
    .catch((error) => {
      console.error("Error adding song to playlist:", error);
      // Xử lý lỗi hoặc hiển thị thông báo lỗi tại đây
    });
}

async function deletePlaylist(playlistId) {
  try {
    const response = await fetch(
      `http://localhost:3900/playlists/deletePlaylist/${playlistId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete playlist");
    }

    // Xoá thành công, cập nhật lại danh sách categories bằng cách gọi lại fetchCategories và renderCategories
    //   fetchCategories().then((categories) => {
    //     renderCategories(categories);
    //   });
    // window.location.href = 'admin-category.html';
  } catch (error) {
    console.error("Error deleting playlist:", error);
  }
}

document.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest(
    'a[data-toggle="tooltip"][title="Delete"]'
  );
  if (deleteBtn) {
    e.preventDefault();
    const playlistId = deleteBtn.getAttribute("data-id");
    if (playlistId) {
      if (confirm("Are you sure to delete?")) {
        deletePlaylist(playlistId);
        getPlaylists(renderPlaylists);
      }
    }
  }
});
