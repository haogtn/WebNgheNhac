
var playlistsApi = "http://localhost:3900/playlists/";
var songsApi = "http://localhost:3900/songs";
let currentPlaylistDetails = [];
getPlaylists(renderPlaylistDetail);
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
            console.error("Error fetching playlists:", error);
        });
}

// Lấy ID của playlist từ URL
const playlistID = window.location.search.split("?")[1].replace("id=", "");

function renderPlaylistDetail(playlistDetails) {
    const Details = document.getElementById("playlist-detail");
    const html = playlistDetails.map((playlist) => {
        // console.log(playlist.id);
    
        
        if (playlist.id === playlistID) {
            currentPlaylistDetails = playlist.song;
            // console.log(currentPlaylistDetails)
            const playlistThumbnail = `url(\'https://uploads-ssl.webflow.com/5e9033e54576bc13f0b47167/61d64e78e9f7444162abcbef_image2-min.png')`;
            const avatar = 'https://uploads-ssl.webflow.com/5e9033e54576bc13f0b47167/61d64e78e9f7444162abcbef_image2-min.png';
            document.documentElement.style.setProperty(
                "--category-thumbnail",
                playlistThumbnail
            );
            return `
            <div class="detail-container-banner-first">
            <img src="${avatar}" alt="">
            <div class="detail-container-banner-content">
                <h1>${playlist.name}</h1>
                <p>Created by ${playlist.user}</p>
                <p>You create - You listen</p>
                <p>${playlist.song.length} TRACKS (1:30:20)</p>
            </div>
            </div>
            
            <div class="detail-container-banner-favicon">
            <div class="detail-container-banner-favicon-cta">
                <button><i class="fa-solid fa-play"></i>Play</button>
                <button><i class="fa-solid fa-shuffle"></i>Shuffle</button>
            </div>
            <div class="detail-container-banner-favicon-more">
                <div class="more-item">
                    <i class="fa-regular fa-heart"></i>
                    Add
                </div>
                <div class="more-item">
                    <i class="fa-solid fa-arrow-up-from-bracket"></i>
                    Share
                </div>
                <div class="more-item">
                    <i class="fa-solid fa-ellipsis"></i>
                    More
                </div>
            </div>
        </div>
            `;
        } else {
            return "";
        }
    });

    if (html.length > 0) {
        Details.innerHTML = html.join("");
        // Gọi hàm getSongs để lấy danh sách bài hát tương ứng
        getSongs(renderSongsDetail);
    } else {
        Details.innerHTML = "<p>Playlist not found</p>";
    }
}

getPlaylists(renderPlaylistDetail);

function getSongs(callback) {
    fetch(songsApi)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // console.log(data);
        // Lọc danh sách bài hát dựa trên currentPlaylistDetails
        const filteredSongs = data.filter((song) =>
          currentPlaylistDetails.includes(song.id)
        );
        // console.log(filteredSongs);
        // Gọi hàm callback với danh sách bài hát đã lọc
        callback(filteredSongs);
      })
      .catch((error) => {
        console.error("Error fetching songs:", error);
      });
  }
  
  function renderSongsDetail(songs) {
    const songsDetail = document.getElementById("playlist-songs-detail");
    const html = songs.map((song) => {
        // Lấy đường dẫn audio của bài hát
        const audioUrl = `${song.audio}`;
        const audio = new Audio(audioUrl);

        audio.addEventListener("loadedmetadata", () => {
            // Lấy thời lượng của bài hát và định dạng lại thời lượng
            const duration = audio.duration;
            const formattedDuration = formatDuration(duration);

            // Cập nhật thời lượng của bài hát trong ô của bảng
            const songDurationCell = document.querySelector(
                `[data-audiourl="${audioUrl}"]`
            );
            if (songDurationCell) {
                songDurationCell.textContent = formattedDuration;
            }
        });
        return `
        <tr class="song-detail-list-function">
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
                <i class="fa-regular fa-heart"></i>&nbsp;&nbsp;

                <i class="fa-solid fa-xmark" song-id="${song.id}"></i>
            </td>
        </tr>
        `;
    });
    songsDetail.innerHTML = html.join("");


        // Gắn sự kiện click vào từng icon để xóa bài hát khi click
        const deleteIcons = document.querySelectorAll(".fa-xmark");
        deleteIcons.forEach((icon) => {
            icon.addEventListener("click", function () {
                const songId = this.getAttribute("song-id");
                if (songId) {
                    if (confirm("Are you sure to remove this song from the playlist")) {
                        removeSongFromPlaylist(songId, playlistID);
                    }
                }
            });
        });

    attachPlayButtonEvents();
}



async  function removeSongFromPlaylist(songId, playlistId) {
    await fetch(`${playlistsApi}${playlistId}/song/${songId}`, {
        method: "DELETE",
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to remove song from playlist");
            }
            return response.json();
        })
        .then((data) => {
            console.log("Song removed from playlist:", data);
            // Xử lý thành công tại đây (ví dụ: hiển thị thông báo thành công)
        })
        .catch((error) => {
            console.error("Error removing song from playlist:", error);
            // Xử lý lỗi hoặc hiển thị thông báo lỗi tại đây
        });
        window.location.reload();
}

    