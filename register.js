document.getElementById("registerBtn").addEventListener("click", () => {

    let name = document.getElementById("name").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (name === "" || username === "" || password === "") {
        alert("Semua field harus diisi!");
        return;
    }

    // Simpan ke localStorage
    let userData = {
        name: name,
        username: username,
        password: password
    };

    localStorage.setItem("userData", JSON.stringify(userData));

    alert("Registrasi berhasil! Silakan login.");
    window.location.href = "login.html";
});
