            // register user
            var userAddApi = "http://localhost:3900/users/add-user";
            const btnSignUp = document.querySelector("#signup-btn");
            if (btnSignUp) {
                btnSignUp.addEventListener("click", (e) => {
                    e.preventDefault();
                    const name = document.querySelector(
                        'input[name="name-register"]'
                    ).value;
                    const email = document.querySelector(
                        'input[name="email-register"]'
                    ).value;
                    const password = document.querySelector(
                        'input[name="password-regis"]'
                    ).value;
                    const confirmPass = document.querySelector(
                        'input[name="password-regis-confirm"]'
                    ).value;
                    console.log(name, email, password, confirmPass);

                    if (
                        name === "" ||
                        email === "" ||
                        password === "" ||
                        confirmPass === ""
                    ) {
                        alert("Please enter your username and password");
                    } else if (password !== confirmPass) {
                        alert("Password and Confirm Password must match");
                    } else {
                        const user = {
                            username: name,
                            password: password,
                            email: email,
                        };
                        fetch(userAddApi, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(user),
                        })
                            .then((res) => res.json())
                            .then((data) => {
                                console.log(data);
                                alert("SignUp Success!");
                                window.location.href = "login.html";
                            })
                            .catch((error) => {
                                console.error("Error:", error);
                                alert("SignUp Failed!");
                            });
                    }
                });
            } else {
                console.error("SignUp Failed!");
            }

