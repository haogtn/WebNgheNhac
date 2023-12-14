var songsApi = "http://localhost:3900/songs";
var artistApi = "http://localhost:3900/artists";
var categoriesApi = "http://localhost:3900/categories";
var albumApi = "http://localhost:3900/albums";
getSongs(renderSongsAdmin);
getArtist(renderArtistsOption);
getCategories(renderCategoriesOption);
getAlbums(renderAlbumsOption);

function getSongs(callback){
    fetch(songsApi)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
            callback(data);
        })
        .catch((error) => {
            console.error("Error fetching categories:", error);
        });
}

function getArtist(callback){
    fetch(artistApi)
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then((data) => {
        console.log(data);
        callback(data);
    })
    .catch((error) => {
        console.error("Error fetching categories:", error);
    });
}

function getCategories(callback){
    fetch(categoriesApi)
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then((data) => {
        console.log(data);
        callback(data);
    })
    .catch((error) => {
        console.error("Error fetching categories:", error);
    });
}

function getAlbums(callback){
    fetch(albumApi)
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then((data) => {
        console.log(data);
        callback(data);
    })
    .catch((error) => {
        console.error("Error fetching categories:", error);
    });
}



/////////////////////////render options
function renderArtistsOption(artists){
    const listArtists = document.querySelector(".artist-render-edit");
    const html = artists.map((artist) =>{
        return `
        <option class="artist-edit" value="${artist._id}">${artist.name}</option>
        `;
    })
    listArtists.innerHTML = html.join("");
}
function renderCategoriesOption(items){
    const listitems = document.querySelector(".cate-render-edit");
    const html = items.map((item) =>{
        return `
        <option  value="${item._id}">${item.name}</option>
        `;
    })
    listitems.innerHTML = html.join("");
}
function renderAlbumsOption(items){
    const listitems = document.querySelector(".album-render-edit");
    const html = items.map((item) =>{
        return `
        <option value="${item._id}">${item.name}</option>
        `;
    })
    listitems.innerHTML = html.join("");
}
//////////////////////////////////

function renderSongsAdmin(songs){
    const listSongs = document.getElementById("list-songs-admin");
    const html = songs.map((song,i)=>{
        return `
        <tr>
        <th class="text-center">${i+1}</th>
        <td>
            <img
                src="${song.thumbnail}"
                style="height: 100px" />
        </td>
        <td>${song.name}</td>
        <td>${song.audio}</td>
        <td>${song.artist}</td>
        <td>${song.category}</td>

        <td style="width: 50px">
            <a href="editor.html?id=${song.id}" 
                ><button class="btn btn-light">
                    Edit
                </button></a
            >
        </td>
        <td style="width: 50px">
        <a href="#"  data-id="${
            song.id
        }" data-toggle="tooltip" title="Delete">
            <button class="btn btn-secondary">
                Del
            </button>
            </a>
        </td>
    </tr>
        `;
    })
    listSongs.innerHTML = html.join("");
}

// Các hàm đã được giữ nguyên, chỉ xóa phần liên quan đến việc tải lên hình ảnh và âm thanh
function addSong(song) {
    const submitSong = document.getElementById("submit-song");
    console.log(submitSong);
    if (submitSong) {
      console.log(submitSong);
      submitSong.addEventListener("click", (e) => {
        e.preventDefault();
        const nameSong = document.getElementById("name").value;
        const artist = document.getElementById("artist").value;
        const list = document.getElementById("list").value;
        const album = document.getElementById("album").value;
        const audio = document.getElementById("audio").files[0];
        const image = document.getElementById("image").files[0];
        console.log(nameSong, artist, list, album, audio, image);
  
        // Tạo một đối tượng chứa dữ liệu category
        const formData = new FormData();
        formData.append("name", nameSong);
        formData.append("artist", artist);
        formData.append("list", list);
        formData.append("album", album);
        formData.append("audio", audio);
        formData.append("image", image);
  
        // Gửi yêu cầu POST sử dụng Ajax
        fetch("http://localhost:3900/songs/add-song", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Song added:", data);
            // Tiến hành xử lý dữ liệu hoặc thông báo thành công tại đây
          })
          .catch((error) => {
            console.error("Error adding song:", error);
            // Xử lý lỗi hoặc hiển thị thông báo lỗi tại đây
          });
      });
    } else {
      console.error("Error adding song");
    }
  }
  addSong();
  
addSong();

async function deleteSong(song_Id) {
    try {
        const response = await fetch(
            `http://localhost:3900/songs/deleteSong/${song_Id}`,
            {
                method: "DELETE",
            }
        );
            console.log("id ne",song_Id);
        if (!response.ok) {
            throw new Error("Failed to delete song");
        }
        getSongs(renderSongsAdmin);
        // Xoá thành công, cập nhật lại danh sách categories bằng cách gọi lại fetchCategories và renderCategories
        //   fetchCategories().then((categories) => {
        //     renderCategories(categories);
        //   });
        // window.location.href = 'admin-category.html';
        
    } catch (error) {
        console.error("Error deleting category:", error);
    }
}

document.addEventListener("click", (e) => {
    const deleteBtn = e.target.closest(
        'a[data-toggle="tooltip"][title="Delete"]'
    );
    if (deleteBtn) {
        e.preventDefault();
        const song_Id = deleteBtn.getAttribute("data-id");
        if (song_Id) {
            if (confirm("Are you sure to delete?")) {
                deleteSong(song_Id);
            }
        }
    }
});
