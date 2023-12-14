const songId = new URLSearchParams(window.location.search).get("id");
console.log("song id ne", songId);
if (songId) {
    
    // lấy dữ liệu category theo id
    async function getSongData() {
        try {
            const response = await fetch(
                `http://localhost:3900/songs/${songId}`
            );
            const artists = await fetch(
                `http://localhost:3900/artists/`
            );
            const categories = await fetch(
                `http://localhost:3900/categories/`
            );
            const albums = await fetch(
                `http://localhost:3900/albums/`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch singer");
            }

            const artist = await artists.json();
            const category = await categories.json();
            const album = await albums.json();
            const song = await response.json();

            // console.log("category khong",category)

            // Hiện thị dữ liệu
            document.querySelector(".name-edit").value = song.name;
            // Trong hàm getSongData

            // Hiện artist
            const listArtists = document.getElementById("artist");
            const html = artist.map((a) =>{
                const selectedArtists = song.artist === a.name ? 'selected' : '';
                return `
                <option value="${a._id}" ${selectedArtists}>${a.name}</option>
                `;
            })
            listArtists.innerHTML = html.join("");

            //Hiện List
            const listCategories = document.querySelector(".cate-edit");
            const htmlcate = category.map((a) =>{
                const selected = song.category === a.name ? 'selected' : '';
                return `
                <option value="${a._id}" ${selected}>${a.name}</option>
                `;})
            listCategories.innerHTML = htmlcate.join("");

            // Hiện Album
            const listAlbums = document.querySelector(".album-edit");
            const htmlAlbum = album.map((a) =>{
                const selected = song.category === a.name ? 'selected' : '';
                return `
                <option value="${a._id}" ${selected}>${a.name}</option>
                `;})
                listAlbums.innerHTML = htmlAlbum.join("");


            // Hiện Audio
            const textAudio = document.getElementById("text-audio");
            textAudio.textContent = song.audio;


            // console.log("day la imagepreview");
            const imagePreview = document.querySelector(".image-preview-edit"); 
            imagePreview.src = song.thumbnail;
            // Lắng nghe sự kiện chọn hình ảnh mới
            const imageInput = document.getElementById("image");
            imageInput.addEventListener("change", (e) => {
                const selectedImage = e.target.files[0];
                const imageURL = URL.createObjectURL(selectedImage);
                imagePreview.src = imageURL;
            });


            const audioInput = document.querySelector("audio");
            audioInput.addEventListener("change",(e)=>{
                const selectedAudio = e.target.file[0];
                const audioURL = URL.createObjectURL(selectedAudio);
            })


        } catch (error) {
            console.error("Error:", error);
        }
    }

    // gọi function
    window.onload = getSongData;

    // update dữ liệu
// update dữ liệu
async function updateSong() {
    const name = document.getElementById("name").value;
    const artist = document.getElementById("artist").value;
    const list = document.getElementById("list").value;
    const album = document.getElementById("album").value;
    const audio = document.getElementById("audio").files[0];
    const image = document.getElementById("image").files[0];

    // Tạo một đối tượng FormData để chứa dữ liệu
    const updatedSongData = new FormData();
    updatedSongData.append("name", name);
    updatedSongData.append("artist", artist);
    updatedSongData.append("list", list);
    updatedSongData.append("album", album);
    updatedSongData.append("audio", audio);
    updatedSongData.append("image", image);

    try {
        // update dữ liệu bằng put
        const response = await fetch(
            `http://localhost:3900/songs/updateSong/${songId}`,
            {
                method: "PUT",
                body: updatedSongData,
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update song");
        }

        // Update thành công
        console.log("Song updated successfully");
    } catch (error) {
        console.error("Error updating song:", error);
    }
}


    // gọi nút sự kiện
    document
        .getElementById("submit-edit-song")
        .addEventListener("click", (e) => {
            e.preventDefault();
            updateSong();
            // chuyển trang
            // window.location.href = "index.html";
        });
} else {
    // Handle the case when categoryId is null
    console.error("No category ID found. Redirecting to index.");
    // Redirect the user to the admin-category.html
    // window.location.href = "admin-category.html";
}
