var artistsApi = "http://localhost:3900/artists";

function getArtists(callback) {
    fetch(artistsApi)
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
getArtists(renderArtistsAdmin);

function renderArtistsAdmin(artists) {
    const listArtists = document.getElementById("list-artists-admin");
    const html = artists.map((artist, i) => {
        return `
        <tr>
        <th class="text-center">${i + 1}</th>
        <td>
            <img
                src="${artist.thumbnail}"
                style="height: 100px" />
        </td>
        <td>${artist.name}</td>
        <td>${artist.description}</td>

        <td style="width: 50px">
            <a href="editor.html?id=${artist._id}" id="edit-artist-btn"
                ><button class="btn btn-light">
                    Edit
                </button></a
            >
        </td>
        <td style="width: 50px">
        <a href="#"  data-id="${
            artist._id
        }" data-toggle="tooltip" title="Delete">
            <button class="btn btn-secondary">
                Del
            </button>
            </a>
        </td>
    </tr>
        `;
    });
    listArtists.innerHTML = html.join("");
}

function addArtist(artist) {
    const submitArtist = document.getElementById("submit-artist");
    console.log(submitArtist);
    if (submitArtist) {
        console.log(submitArtist);
        submitArtist.addEventListener("click", (e) => {
            e.preventDefault();
            const nameArtist = document.getElementById("name").value;
            const descriptionArtist = document.getElementById("desc").value;
            const imageFile = document.getElementById("image").files[0];
            console.log(nameArtist, descriptionArtist, imageFile);
            // Tạo một đối tượng chứa dữ liệu category
            const formData = new FormData();
            formData.append("name", nameArtist);
            formData.append("desc", descriptionArtist);
            formData.append("image", imageFile);
            // Gửi yêu cầu POST sử dụng Ajax
            fetch("http://localhost:3900/artists/add-artist", {
                method: "POST",
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("Artist added:", data);
                    // Tiến hành xử lý dữ liệu hoặc thông báo thành công tại đây
                })
                .catch((error) => {
                    console.error("Error adding artist:", error);
                    // Xử lý lỗi hoặc hiển thị thông báo lỗi tại đây
                });
            // window.location.href = "index.html";
        });
    } else {
        console.error("Error adding category");
    }
}
addArtist();

async function deleteArtist(artist_Id) {
    try {
        const response = await fetch(
            `http://localhost:3900/artists/deleteArtist/${artist_Id}`,
            {
                method: "DELETE",
            }
        );

        if (!response.ok) {
            throw new Error("Failed to delete category");
        }

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
        const artist_Id = deleteBtn.getAttribute("data-id");
        if (artist_Id) {
            if (confirm("Are you sure to delete?")) {
                deleteArtist(artist_Id);
            }
        }
    }
});
