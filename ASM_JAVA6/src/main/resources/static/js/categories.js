var categoriesApi = "http://localhost:3900/categories";
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

function renderCategories(categories) {
    const listCategories = document.querySelector(
        "#list-categories-singlepage"
    );
    const html = categories.map((category) => {
        return `
        <a href="detail.html?id=${category._id}?name=${category.name}"  style="text-decoration: none">
        <li class="explore-card">
        <div class="img_play">
            <img src="${category.thumbnail}" alt="alan" />
            <i class="bi fa-solid fa-circle-play" i="1"></i>
        </div>
        <h5 >
            <p class="line-clamp">${category.name}: Best of 2023</p>
      
            <div class="subtitle line-clamp line-2">Created by: QMUSIC</div>
            
        </h5>
    </li></a>
    `;
    });
    listCategories.innerHTML = html.join("");
}

getCategories(renderCategories);

