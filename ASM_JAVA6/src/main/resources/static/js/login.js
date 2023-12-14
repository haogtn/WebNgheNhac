var userApi = "http://localhost:3900/users/";
            const getUser = async () => {
                const response = await fetch(userApi);
                const data = await response.json();
                return data;
                // console.log(data);
            };

            const bntLogin = document.querySelector("#login-btn");
            // console.log(email);

            bntLogin.addEventListener("click", (e) => {
                e.preventDefault();
                const email = document.querySelector(
                    "input[name=email-login]"
                ).value;
                const password = document.querySelector(
                    "input[name=password-login"
                ).value;

                // console.log(email);
                // console.log(password);
                // const validateEmail = (email) => {
                //     return String(email)
                //         .toLowerCase()
                //         .match(
                //             /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                //         );
                // };

                if (email === "" || password === "") {
                    alert("Please enter your email and password");
                } else {
                    getUser().then((data) => {
                        console.log(data);
                        const user = data.find(
                            (user) =>
                                user.email == email && user.password == password
                        );
                        if (user.role === 1) {
                            alert("Login success");
                            let name = user.username;
                            let idUser = user._id;
                            let role = user.role;
                            window.location.href = "webplayer.html";

                            sessionStorage.setItem("name", name);
                            sessionStorage.setItem("idUser", idUser);
                            sessionStorage.setItem("role", role);
                        } else if (user.role === 0 ) {
                            alert("Welcome Admin");
                            let name = user.username;
                            let idUser = user._id;
                            let role = user.role;
                            window.location.href = "admin/index.html";

                            sessionStorage.setItem("name", name);
                            sessionStorage.setItem("idUser", idUser);
                            sessionStorage.setItem("role", role);
                        } else {
                            alert("Login failed");
                        }
                    });
                }
            });
