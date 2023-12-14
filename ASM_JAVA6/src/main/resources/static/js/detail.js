// import { getSongDuration } from "./script.js";
// import { getSongDuration, formatDuration } from "./script1.js";

var categoriesApi = "http://localhost:3900/categories/";
var songsApi = "http://localhost:3900/songs";
let currentPlaylistDetails = [];
let currentIndexDetails = 0;

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

console.log(window.location.search);
const categoryID = window.location.search.split("?")[1].replace("id=", "");
console.log(categoryID);
const categoryName = window.location.search.split("?")[2].replace("name=", "");
console.log(categoryName);
// console.log(categoryID);

function renderCategoriesDetail(categoriesDetails) {
    const Details = document.getElementById("category-detail");
    const html = categoriesDetails.map((category) => {
        if (category._id == categoryID) {
            const categoryThumbnail = `url('${category.thumbnail}')`;
            document.documentElement.style.setProperty(
                "--category-thumbnail",
                categoryThumbnail
            );
            return `
            <div class="detail-container-banner-first">
            <img src="${category.thumbnail}" alt="">
            <div class="detail-container-banner-content">
                <h1>${category.name}</h1>
                <p>Created by QMUSIC</p>
                <p>${category.description}</p>
                <p>30 TRACKS (4:30:20)</p>
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
    } else {
        Details.innerHTML = "<p>Category not found</p>";
    }
}

getCategories(renderCategoriesDetail);

function getSongs(callback) {
    fetch(songsApi)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            currentPlaylistDetails = data;
            // Convert categoryID to string
            // Filter songs by category ID
            const filteredSongs = data.filter(
                (song) => song.category === categoryName
            );
            // Call the renderSongs function with the filtered songs
            renderSongsDetail(filteredSongs);
        })
        .catch((error) => {
            console.error("Error fetching songs:", error);
        });
}

function renderSongsDetail(songs) {
    const songsDetail = document.getElementById("list-songs-detail");
    const html = songs.map((song) => {
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
          <i song-id=${song.id} class="fa-solid fa-plus"></i>&nbsp;&nbsp;
            <i class="fa-regular fa-heart"></i>
          </td>
        </tr>
        `;
    });
    songsDetail.innerHTML = html.join("");
    attachPlayButtonEvents();
    attachAddButtonEvents(songs);

}

getSongs(renderSongsDetail);

