// Kalender Bismillah..
const monthNames = ["Januari", "Februari", "Matet", "April", "Mei", "Juni", "Juli", "Ahustus", "September", "Oktober", "November", "Desember"];  // ini buat nama bulannya
const bgImages = ["img/mapPinkCalendar.png", "img/mapBlueCalendar.png", "img/mapYellowCalendar.png", "img/mapOrangeCalendar.png"];      // ini img yang dipake buat bg kalen dernya ituu


let currentDate = new Date();    // ini buat ngambila hari sama tanggal
let currentMonth = currentDate.getMonth();     // ini buat yang bulannya
let currentYear = currentDate.getFullYear();      // ini tahun
let selectedDate = null;        // kalo yang ini buat nyimpen tanggal yang buat modal
let events = JSON.parse(localStorage.getItem('calendarEvents')) || [/**ini kalo ga ada pake array kosong */];     // ini biar kesimpen ke lokal storage
// currentMonth  //tempat menyimpan angka
// currentDate   //menyimpan tanggal hari ini
// .   //dot operator
// getMonth()    //mengambil angka bulan dari objek Date


// disini kita pake DOM
const el = {
    daysGrid: document.getElementById('daysGrid'),
    currentMonth: document.getElementById('currentMonth'),
    prevMonthBtn: document.getElementById('prevMonth'),
    nextMonthBtn: document.getElementById('nextMonth'),
    // ------------- //
    scheduleList: document.getElementById('scheduleList'),
    addEventBtn: document.getElementById('addEventBtn'),
    eventModal: document.getElementById('-Modal'),
    closeModalBtn: document.getElementById('closeModal'),
    cancelBtn: document.getElementById('cancelBtn'),
    eventForm: document.getElementById('eventForm'),
    // ---------------- //
    eventTitleInput: document.getElementById('eventTitle'),
    eventDateInput: document.getElementById('eventDate'),
    eventTimeInput: document.getElementById('eventTime'),
    eventDescriptionInput: document.getElementById('eventDescription'),
    toast: document.getElementById('toast')
};


function initCalendar() {     // ini buat ngebikin tampilan kalenderny gitu dehh
    renderCalendar();
    renderScheduleList();
    el.eventDateInput.value = formatDateForInput(new Date());  // ini biar ngambil data terbaru
}


const formatDateForInput = date => {      //ini biar otomatis bisa lansung milain tanggal
    const year = date.getFullYear();  
    const month = String(date.getMonth() + 1).padStart(2, '0');    
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};


// render calendar
function renderCalendar() {
    el.currentMonth.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    el.daysGrid.innerHTML = '';
   
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
   
    let index = 0;


    // hari, bulan sebelunya
    for (let i = firstDay - 1; i >= 0; i--) {
        const elDay = createDayElement(daysInPrevMonth - i, currentMonth - 1, currentYear, true);
        elDay.style.backgroundImage = `url(${bgImages[index % bgImages.length]})`;
        el.daysGrid.appendChild(elDay);
        index++;
    }
   
    // hari, bulan saat ini
    for (let i = 1; i <= daysInMonth; i++) {
        const elDay = createDayElement(i, currentMonth, currentYear, false);
        elDay.style.backgroundImage = `url(${bgImages[index % bgImages.length]})`;
        el.daysGrid.appendChild(elDay);
        index++;
    }
   
    // hari, bulan selanjutnya
    const totalCells = el.daysGrid.children.length;
    for (let i = 1; i <= (7 - (totalCells % 7)) % 7; i++) {
        const elDay = createDayElement(i, currentMonth + 1, currentYear, true);
        elDay.style.backgroundImage = `url(${bgImages[index % bgImages.length]})`;
        el.daysGrid.appendChild(elDay);
        index++;
    }
}


// ini ngebikin elemen hari
function createDayElement(day, month, year, isOtherMonth) {
    const dayEl = document.createElement("div");
    dayEl.className = "day" + (isOtherMonth ? " other-month" : "");


    const today = new Date();
    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
   
    if (isToday) dayEl.classList.add("today");


    const dayEvents = getEventsForDate(day, month, year);
    const hasEvents = dayEvents.length > 0 && !isOtherMonth;


    if (hasEvents) {
        const dots = Math.min(dayEvents.length, 3);
        dayEl.innerHTML = `
            <div class="event-indicator">
                ${"<div class='event-dot'></div>".repeat(dots)}
            </div>
            <div class="day-number">${day}</div>
        `;
        dayEl.classList.add("has-event");
    } else {
        dayEl.innerHTML = `<div class="day-number">${day}</div>`;
    }


    if (!isOtherMonth) {
        dayEl.addEventListener("click", () => {
            selectedDate = new Date(year, month, day);
            el.eventDateInput.value = formatDateForInput(selectedDate);
            openModal();
        });
    }


    return dayEl;
}


const getEventsForDate = (day, month, year) =>
    events.filter(event => {
        const eDate = new Date(event.date);
        return eDate.getDate() === day && eDate.getMonth() === month && eDate.getFullYear() === year;
    });


// render schedule list
function renderScheduleList() {
    el.scheduleList.innerHTML = '';
   
    if (events.length === 0) {
        el.scheduleList.innerHTML = '<p style="text-align: center; color: #6C757D;">Tidak ada jadwal</p>';
        return;
    }
   
    const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
   
    sortedEvents.slice(0, 5).forEach(event => {
        const eDate = new Date(event.date);
        const item = document.createElement('div');
        item.className = 'schedule-item';
        item.innerHTML = `
            <div class="schedule-date">${eDate.getDate()}</div>
            <div class="schedule-details">
                <div class="schedule-title">${event.title}</div>
                <div class="schedule-time">${event.time} - ${monthNames[eDate.getMonth()]} ${eDate.getDate()}, ${eDate.getFullYear()}</div>
            </div>
        `;
        item.addEventListener('click', () => showToast(`Detail: ${event.description || 'Tidak ada deskripsi'}`));
        el.scheduleList.appendChild(item);
    });
   
    if (events.length > 5) {
        const moreItem = document.createElement('div');
        moreItem.className = 'schedule-item';
        moreItem.style.justifyContent = 'center';
        moreItem.innerHTML = `<div class="schedule-details" style="text-align: center;">... dan ${events.length - 5} jadwal lainnya</div>`;
        el.scheduleList.appendChild(moreItem);
    }
}


// modal
const openModal = () => {
    el.eventModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
};


const closeModal = () => {
    el.eventModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    el.eventForm.reset();
    if (!selectedDate) el.eventDateInput.value = formatDateForInput(new Date());
};


const showToast = message => {
    el.toast.textContent = message;
    el.toast.classList.add('show');
    setTimeout(() => el.toast.classList.remove('show'), 3000);
};


el.prevMonthBtn.addEventListener('click', () => {
    if (currentMonth-- === 0) { currentMonth = 11; currentYear--; }
    renderCalendar();
});


el.nextMonthBtn.addEventListener('click', () => {
    if (currentMonth++ === 11) { currentMonth = 0; currentYear++; }
    renderCalendar();
});


el.addEventBtn.addEventListener('click', () => { selectedDate = null; openModal(); });
el.closeModalBtn.addEventListener('click', closeModal);
el.cancelBtn.addEventListener('click', closeModal);
el.eventModal.addEventListener('click', (e) => { if (e.target === el.eventModal) closeModal(); });


el.eventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    events.push({
        id: Date.now(),
        title: el.eventTitleInput.value,
        date: el.eventDateInput.value,
        time: el.eventTimeInput.value,
        description: el.eventDescriptionInput.value
    });
    localStorage.setItem('calendarEvents', JSON.stringify(events));
    renderCalendar();
    renderScheduleList();
    closeModal();
    showToast('Jadwal berhasil ditambahkan!');
});


initCalendar();

// Updated functions for day rendering to show number at top-left and events below
function createDayElement(day, month, year, isOtherMonth) {
    const dayEl = document.createElement("div");
    dayEl.className = "day" + (isOtherMonth ? " other-month" : "");

    const today = new Date();
    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    if (isToday) dayEl.classList.add("today");

    const dayEvents = getEventsForDate(day, month, year);
    const hasEvents = dayEvents.length > 0 && !isOtherMonth;

    // base layout
    dayEl.innerHTML = `
        <div class="day-number" style="position:absolute; top:6px; left:6px; font-size:16px; font-weight:700;">${day}</div>
        <div class="day-events" style="position:absolute; bottom:4px; left:6px; right:6px; font-size:10px; line-height:1.1; max-height:32px; overflow:hidden;"></div>
    `;

    if (hasEvents) {
        const container = dayEl.querySelector('.day-events');
        dayEvents.slice(0,2).forEach(ev => {
            const div = document.createElement('div');
            div.textContent = ev.title;
            div.style.background = "rgba(0,0,0,0.3)";
            div.style.color = "white";
            div.style.padding = "1px 3px";
            div.style.borderRadius = "4px";
            div.style.marginBottom = "2px";
            container.appendChild(div);
        });
        if (dayEvents.length > 2) {
            const more = document.createElement('div');
            more.textContent = `+${dayEvents.length - 2} lagi`;
            more.style.fontSize = "9px";
            container.appendChild(more);
        }
    }

    if (!isOtherMonth) {
        dayEl.addEventListener("click", () => {
            selectedDate = new Date(year, month, day);
            el.eventDateInput.value = formatDateForInput(selectedDate);
            openModal();
        });
    }

    return dayEl;
}
