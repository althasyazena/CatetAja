// Ambil data dari localStorage pas halaman dibuka
// kalo belom ada data, pakai array kosong
let history = JSON.parse(localStorage.getItem("moodHistory")) || [];

// ini message buat setiap mood
const moodMessages = {
    Happy: "abjeah stay happy ya abjeah",
    Sad: "abjeah dont be sad ya abjeah",
    Angry: "abjeah dont be mad ya abjeah",
    Anxious: "abjeah stay calm ya abjeah"
};

// Render data yang udah kesimpen pas pertama kali ke load
renderHistory();

// event listener buat setiap tombol mood
document.querySelectorAll(".mood-option").forEach(btn => {
    btn.addEventListener("click", () => {

         // ambil nilai mood dari atribut data-mood pada tombol
        const mood = btn.dataset.mood;

        // ambil tanggal hari ini dengan format
        let today = new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric"
        });

        // save mood dan tanggal ke dalam array history
        history.push({ mood, date: today });

        // save ke localStorage setiap kali ditambah
        localStorage.setItem("moodHistory", JSON.stringify(history));

        // tampilin ulang data mood setelah ditambah
        renderHistory();
    });
});

// buat nampilin history mood ke halaman
function renderHistory() {
    const container = document.getElementById("weeklyMoodContainer");

    // kosongin isi container sebelum dirender ulang
    container.innerHTML = "";

    // ammbil 5 mood terakhir dan urutin dari yang terbaru
    history.slice(-5).reverse().forEach(item => {

        // buat nentuin icon berdasarkan moodnya
        let icon = "img/HappyMascot.png";
        if (item.mood === "Sad") icon = "img/SadMascot.png";
        if (item.mood === "Angry") icon = "img/AngryMascot.png";
        if (item.mood === "Anxious") icon = "img/AnxiousMascot.png";

        // buat elemen card mood
        const card = document.createElement("div");
        card.classList.add("mood-card");

        // ngambil message sesuai mood
        let message = moodMessages[item.mood] || "";

        // ini buat isi isi didalem card moodnya
        card.innerHTML = `
            <img src="${icon}">
            <div class="mood-info">
                <div class="mood-name">${item.mood}</div>
                <div class="mood-desc">"${message}"</div>
            </div>
        `;

        // masukin card ke container
        container.appendChild(card);
    });
}


// Notes
// buat ambil elemen dari html
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");
const noteModal = document.getElementById("noteModal");
const saveNote = document.getElementById("saveNote");

const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const notesContainer = document.getElementById("notesContainer");

// warba default notesnya
let selectedColor = "#4DA3FF";

// buka & tutup modal
openModal.onclick = () => noteModal.classList.add("active");
closeModal.onclick = () => noteModal.classList.remove("active");

// buat milih warna notesnya
document.querySelectorAll(".color").forEach(color => {
    color.onclick = () => {
        document.querySelectorAll(".color").forEach(c => c.classList.remove("active"));
        color.classList.add("active");
        selectedColor = color.dataset.color;
    };
});

// load storage
let notes = JSON.parse(localStorage.getItem("notes")) || [];

// ini buat nge-render notes
function renderNotes() {
    notesContainer.innerHTML = "";
    notes.forEach((note, index) => {
        notesContainer.innerHTML += `
      <div class="note-card" style="background:${note.color}">
        <button class="delete-btn" onclick="deleteNote(${index})">
          <i class="ri-delete-bin-6-line"></i>
        </button>
        <h4>${note.title}</h4>
        <p>${note.content}</p>
      </div>
    `;
    });
}
renderNotes();

// buat save notes
saveNote.onclick = () => {
    if (noteTitle.value === "" || noteContent.value === "") return alert("Isi dulu!");

    notes.push({
        title: noteTitle.value,
        content: noteContent.value,
        color: selectedColor
    });

    localStorage.setItem("notes", JSON.stringify(notes));

    // reset notes setelah disave
    noteTitle.value = "";
    noteContent.value = "";

    // tutup modal
    noteModal.classList.remove("active");

    // nampilin daftar notesnya
    renderNotes();
};

// ini buat delet notes
function deleteNote(index) {
    notes.splice(index, 1); // ngehapus satu data
    localStorage.setItem("notes", JSON.stringify(notes)); // simpen ulang
    renderNotes(); // tampilin ulang deh
}