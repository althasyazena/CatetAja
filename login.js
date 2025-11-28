const loginBtn = document.querySelector(".btn-login");
const errorMsg = document.getElementById("errorMsg");

loginBtn.addEventListener("click", function () {

    let username = document.querySelector(".form-input[type='text']").value;
    let password = document.querySelector(".form-input[type='password']").value;

    // Ambil data user dari localStorage
    let savedUser = JSON.parse(localStorage.getItem("userData"));

    if (!savedUser) {
        alert("Belum ada akun! Silakan register dulu.");
        window.location.href = "index.html";
        return;
    }

    if (username === savedUser.username && password === savedUser.password) {
        errorMsg.style.display = "none";

        // tandai sebagai login
        localStorage.setItem("loggedInUser", savedUser.username);

        window.location.href = "home.html";
    } else {
        errorMsg.style.display = "block";
    }
});
