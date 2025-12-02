//  ambil button login
const loginBtn = document.querySelector(".btn-login");

// ambil message error
const errorMsg = document.getElementById("errorMsg");

// event listener pas button login diclick
loginBtn.addEventListener("click", function () {

    // ambil nilai username dari input type text
    let username = document.querySelector(".form-input[type='text']").value;

    // ambil nilai password dari input type password
    let password = document.querySelector(".form-input[type='password']").value;

    // Ambil data user dari localStorage
    let savedUser = JSON.parse(localStorage.getItem("userData"));

    // kalo gapunya akun yang terdaftar
    if (!savedUser) {
        alert("Belum ada akun! Silakan register dulu.");

        // diarahin ke page regist
        window.location.href = "register.html";
        return; // stop proses login
    }

    // jika username dan password sesuai sama data yang disimpan
    if (username === savedUser.username && password === savedUser.password) {

        // sembunyiin message error
        errorMsg.style.display = "none";

        // tandai sebagai login
        localStorage.setItem("loggedInUser", savedUser.username);

        // arahin user ke page home yey
        window.location.href = "home.html";
    } else {

        // kalo username atau password salah, tampilin pesan error
        errorMsg.style.display = "block";
    }
});
