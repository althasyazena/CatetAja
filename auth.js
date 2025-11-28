// Cegah masuk tanpa login
let user = localStorage.getItem("loggedInUser");
if (!user) {
    window.location.href = "login.html";
}