const categoryId = new URLSearchParams(window.location.search).get("id");
console.log("cateid ne", categoryId);
if (categoryId) {
    // lấy dữ liệu category theo id
    async function getCategoryData() {
        try {
            const response = await fetch(
                `http://localhost:3900/categories/${categoryId}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch category");
            }
            const category = await response.json();
            // Hiện thị dữ liệu
            document.querySelector(".name-edit").value = category.name;
            document.querySelector(".desc-edit").value = category.description;
            const imagePreview = document.getElementById("image-preview");
            imagePreview.src = category.thumbnail;
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
    window.onload = getCategoryData;

    // update dữ liệu
    async function updateCategory() {
        const nameCategory = document.querySelector(".name-edit").value;
        const descriptionCategory = document.querySelector(".desc-edit").value;
        const imageFile = document.getElementById("image").files[0];
        // console.log(nameCategory, descriptionCategory, imageFile);

        // tạo một đối tượng để chứa dữ liệu
        // Tạo một đối tượng FormData để chứa dữ liệu
        const updatedCategoryData = new FormData();
        updatedCategoryData.append("name", nameCategory);
        updatedCategoryData.append("desc", descriptionCategory);
        updatedCategoryData.append("image", imageFile);

        try {
            // update dữ liệu bằng put
            const response = await fetch(
                `http://localhost:3900/categories/updateCategory/${categoryId}`,
                {
                    method: "PUT", // or 'PATCH' depending on your server setup
                    body: updatedCategoryData,
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update category");
            }

            // Update thành công
            console.log("Category updated successfully");
        } catch (error) {
            console.error("Error updating category:", error);
        }
    }

    // gọi nút sự kiện
    document
        .getElementById("submit-edit-category")
        .addEventListener("click", (e) => {
            e.preventDefault();
            updateCategory();
            // chuyển trang
            // window.location.href = "index.html";
        });
} else {
    // Handle the case when categoryId is null
    console.error("No category ID found. Redirecting to index.");
    // Redirect the user to the admin-category.html
    // window.location.href = "admin-category.html";
}
