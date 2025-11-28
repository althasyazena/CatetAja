let history = [];

const moodMessages = {
    Happy: "abjeah stay happy ya abjeah",
    Sad: "abjeah dont be sad ya abjeah",
    Angry: "abjeah dont be mad ya abjeah",
    Anxious: "abjeah stay calm ya abjeah"
};

document.querySelectorAll(".mood-option").forEach(btn => {
    btn.addEventListener("click", () => {
        const mood = btn.dataset.mood;

        let today = new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric"
        });

        history.push({ mood, date: today });

        renderHistory();
    });
});

function renderHistory() {
    const container = document.getElementById("weeklyMoodContainer");
    container.innerHTML = "";

    history.slice(-5).reverse().forEach(item => {

        let icon = "img/HappyMascot.png";
        if (item.mood === "Sad") icon = "img/SadMascot.png";
        if (item.mood === "Angry") icon = "img/AngryMascot.png";
        if (item.mood === "Anxious") icon = "img/AnxiousMascot.png";

        const card = document.createElement("div");
        card.classList.add("mood-card");

        let message = moodMessages[item.mood] || "";

        card.innerHTML = `
            <img src="${icon}">
            <div class="mood-info">
                <div class="mood-name">${item.mood}</div>
                <div class="mood-desc">"${message}"</div>
            </div>
        `;

        container.appendChild(card);
    });
}

// Notes
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");
const noteModal = document.getElementById("noteModal");
const saveNote = document.getElementById("saveNote");

const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const notesContainer = document.getElementById("notesContainer");

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

  noteTitle.value = "";
  noteContent.value = "";
  noteModal.classList.remove("active");

  renderNotes();
};

// ini buat delet notes
function deleteNote(index) {
  notes.splice(index, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();
}