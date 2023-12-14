var usersApi = "http://localhost:3900/users";
getUsers(renderUsersAdmin);
function getUsers(callback) {
    fetch(usersApi)
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
        .catch((err) => {
            console.log(err);
        });
}


function renderUsersAdmin(users){
    const listUsers = document.getElementById("list-users-admin");
    const html = users.map((user,i) =>{
        if(user.role === 0){
        return `
        <tr>
        <th class="text-center">${i+1}</th>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.role===0 ? "admin" : "user"}</td>
        <td style="width: 50px">
            <a href="#"  "
                ><button class="btn btn-light">
                    Edit
                </button></a
            >
        </td>
        <td style="width: 50px">
        </td>
    </tr>
        `;
    } else {
        return `
        <tr>
        <th class="text-center">${i+1}</th>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.role===0 ? "admin" : "user"}</td>
        <td style="width: 50px">
            <a href="#"
                ><button class="btn btn-light">
                    Edit
                </button></a
            >
        </td>
        <td style="width: 50px">
            <button
                onclick=""
                class="btn btn-secondary">
                Del
            </button>
        </td>
    </tr>`;
    }
})
    listUsers.innerHTML = html.join("");
}