// event listener pas button diclick
document.getElementById("registerBtn").addEventListener("click", () => {

    // ambil nilai dari input name
    let name = document.getElementById("name").value;

    // ambil nilai dari input username
    let username = document.getElementById("username").value;

    // ambil nilai dari input password
    let password = document.getElementById("password").value;

    // validasi dulu, kalo ada input yang kosong muncul alert
    if (name === "" || username === "" || password === "") {
        alert("Semua field harus diisi!");
        return; // stop proses kalo ada yang kosong
    }

    // object buat simpen data user ke localStorage
    let userData = {
        name: name,
        username: username,
        password: password
    };

    // simpan data user ke localStorage dalam bentuk JSON
    localStorage.setItem("userData", JSON.stringify(userData));

    // tampilin message berhasil
    alert("Registrasi berhasil! Silakan login.");

    // diarahin ke login
    window.location.href = "login.html";
});
