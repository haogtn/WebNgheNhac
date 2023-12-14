const artistId = new URLSearchParams(window.location.search).get("id");
console.log("cateid ne", artistId);
if (artistId) {
    // lấy dữ liệu Artist theo id
    async function getArtistData() {
        try {
            const response = await fetch(
                `http://localhost:3900/artists/${artistId}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch artist");
            }
            const artist = await response.json();
            // Hiện thị dữ liệu
            document.querySelector(".name-edit").value = artist.name;
            document.querySelector(".desc-edit").value = artist.description;
            const imagePreview = document.getElementById("image-preview");
            imagePreview.src = artist.thumbnail;
            // Lắng nghe sự kiện chọn hình ảnh mới
            const imageInput = document.getElementById("image");
            imageInput.addEventListener("change", (e) => {
                const selectedImage = e.target.files[0];
                const imageURL = URL.createObjectURL(selectedImage);
                imagePreview.src = imageURL;
            });
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // gọi function
    window.onload = getArtistData;

    // update dữ liệu
    async function updateArtist() {
        const nameArtist = document.querySelector(".name-edit").value;
        const descriptionArtist = document.querySelector(".desc-edit").value;
        const imageFile = document.getElementById("image").files[0];
        // console.log(nameArtist, descriptionArtist, imageFile);

        // tạo một đối tượng để chứa dữ liệu
        // Tạo một đối tượng FormData để chứa dữ liệu
        const updatedArtistData = new FormData();
        updatedArtistData.append("name", nameArtist);
        updatedArtistData.append("desc", descriptionArtist);
        updatedArtistData.append("image", imageFile);

        try {
            // update dữ liệu bằng put
            const response = await fetch(
                `http://localhost:3900/artists/updateArtist/${artistId}`,
                {
                    method: "PUT", // or 'PATCH' depending on your server setup
                    body: updatedArtistData,
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update Artist");
            }

            // Update thành công
            console.log("Artist updated successfully");
        } catch (error) {
            console.error("Error updating Artist:", error);
        }
    }

    // gọi nút sự kiện
    document
        .getElementById("submit-edit-artist")
        .addEventListener("click", (e) => {
            e.preventDefault();
            updateArtist();
            // chuyển trang
            window.location.href = "index.html";
        });
} else {
    // Handle the case when ArtistId is null
    console.error("No Artist ID found. Redirecting to index.");
    // Redirect the user to the admin-Artist.html
    // window.location.href = "admin-Artist.html";
}
