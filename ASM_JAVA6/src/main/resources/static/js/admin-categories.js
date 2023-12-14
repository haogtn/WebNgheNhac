var categoriesApi = "http://localhost:3900/categories";
getCategories(renderCategoriesAdmin);

function getCategories(callback) {
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

function renderCategoriesAdmin(categories) {
    const listCategories = document.getElementById("list-categories-admin");
    const html = categories.map((category, i) => {
        return `
        <tr>
        <th class="text-center">${i + 1}</th>
        <td>
            <img
                src="${category.thumbnail}"
                style="height: 100px" />
        </td>
        <td>${category.name}</td>
        <td>${category.description}</td>

        <td style="width: 50px">
            <a  href="editor.html?id=${category._id}" id="edit-category-btn"
                ><button class="btn btn-light">
                    Edit
                </button></a
            >
        </td>
        <td style="width: 50px">
        <a href="#"  data-id="${
            category._id
        }" data-toggle="tooltip" title="Delete">
            <button class="btn btn-secondary">
                Del
            </button>
            </a>
        </td>
    </tr>
        `;
    });
    listCategories.innerHTML = html.join("");
}

function addCategory(category) {
    const submitCategory = document.getElementById("submit-category");
    console.log(submitCategory);
    if (submitCategory) {
        console.log(submitCategory);
        submitCategory.addEventListener("click", (e) => {
            e.preventDefault();
            const nameCategory = document.getElementById("name").value;
            const descriptionCategory = document.getElementById("desc").value;
            const imageFile = document.getElementById("image").files[0];
            console.log(nameCategory, descriptionCategory, imageFile);
            // Tạo một đối tượng chứa dữ liệu category
            const formData = new FormData();
            formData.append("name", nameCategory);
            formData.append("desc", descriptionCategory);
            formData.append("image", imageFile);
            // Gửi yêu cầu POST sử dụng Ajax
            fetch("http://localhost:3900/categories/add-category", {
                method: "POST",
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("Category added:", data);
                    // Tiến hành xử lý dữ liệu hoặc thông báo thành công tại đây
                })
                .catch((error) => {
                    console.error("Error adding category:", error);
                    // Xử lý lỗi hoặc hiển thị thông báo lỗi tại đây
                });
            // window.location.href = "admin-category.html";
        });
    } else {
        console.error("Error adding category");
    }
}
addCategory();
async function deleteCategory(category_Id) {
    try {
        const response = await fetch(
            `http://localhost:3900/categories/deleteCategory/${category_Id}`,
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
        const category_Id = deleteBtn.getAttribute("data-id");
        if (category_Id) {
            if (confirm("Are you sure to delete?")) {
                deleteCategory(category_Id);
            }
        }
    }
});

