var swiper = new Swiper(".slider-content", {
    slidesPerView: 3,
    spaceBetween: 30,
    freeMode: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});

const loginWrapper = document.querySelector(".login-wrapper");
const loginSubmenu = document.querySelector(".login-submenu");

// Show the submenu when the mouse enters the login area
loginWrapper.addEventListener("mouseenter", () => {
    loginSubmenu.style.display = "";
});

// Close the submenu when the mouse moves out of the login area and login-submenu
loginWrapper.addEventListener("mouseleave", (event) => {
    if (!loginSubmenu.contains(event.relatedTarget)) {
        loginSubmenu.style.display = "none";
    }
});

