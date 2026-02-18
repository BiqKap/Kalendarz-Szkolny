document.addEventListener("DOMContentLoaded", () => {
	const themeBtn = document.getElementById("ThemeSwitch");

	// Restore saved theme
	if (localStorage.getItem("theme") === "dark") {
		document.body.classList.add("dark-theme");
	}

	const typeColors = {
		light: {
			Kartkówka: "#ff9999",
			Sprawdzian: "#99ccff",
			"Praca domowa": "#99ff99",
			Inne: "#cccccc",
		},
		dark: {
			Kartkówka: "#a20000ff",
			Sprawdzian: "#014c97ff",
			"Praca domowa": "#008521ff",
			Inne: "#5b5a5aff",
		},
	};

	function renderCalendar() {
		const calendarContainer = document.getElementById("CalendarDisplay");
		const events = JSON.parse(localStorage.getItem("schoolEvents") || "[]");
		const theme = document.body.classList.contains("dark-theme")
			? "dark"
			: "light";

		const today = new Date();
		const year = today.getFullYear();
		const month = today.getMonth();
		const firstDay = new Date(year, month, 1).getDay();
		const daysInMonth = new Date(year, month + 1, 0).getDate();

		let html = '<div class="calendar-grid">';
		const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		weekdays.forEach(
			(day) => (html += `<div class="calendar-header">${day}</div>`)
		);

		for (let i = 0; i < firstDay; i++) {
			html += `<div class="calendar-cell empty"></div>`;
		}

		for (let d = 1; d <= daysInMonth; d++) {
			const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
				d
			).padStart(2, "0")}`;
			const dayEvents = events.filter((e) => e.date === dateStr);

			html += `<div class="calendar-cell"><div class="day-number">${d}</div>`;

			dayEvents.forEach((ev) => {
				const globalIndex = events.indexOf(ev); 
				html += `<div class="event-block"
                data-index="${globalIndex}"
                style="
                    background-color:${typeColors[theme][ev.title] || "#eee"};
                    color:${theme === "dark" ? "#e0e0e0" : "#000"};
                ">
                ${ev.title}${ev.time ? " – lekcja " + ev.time : ""}
            </div>`;
			});

			html += `</div>`;
		}

		html += "</div>";
		calendarContainer.innerHTML = html;

		attachEventListeners(events); // Attach modal listeners after rendering
	}

	function attachEventListeners(events) {
		const modal = document.getElementById("EventModal");
		const closeBtn = document.getElementById("CloseModal");
		const titleEl = document.getElementById("ModalTitle");
		const dateEl = document.getElementById("ModalDate");
		const timeEl = document.getElementById("ModalTime");
		const descEl = document.getElementById("ModalDescription");

		document.querySelectorAll(".event-block").forEach((block) => {
			block.addEventListener("click", () => {
				const index = block.dataset.index;
				const ev = events[index];

				titleEl.textContent = ev.title;
				dateEl.textContent = `Data: ${ev.date}`;
				timeEl.textContent = ev.time ? `Godzina lekcyjna: ${ev.time}` : "";
				descEl.textContent = ev.description || "";

				modal.style.display = "flex";
			});
		});

		closeBtn.addEventListener("click", () => {
			modal.style.display = "none";
		});

		window.addEventListener("click", (e) => {
			if (e.target === modal) modal.style.display = "none";
		});
	}

	renderCalendar();

	themeBtn.addEventListener("click", () => {
		document.body.classList.toggle("dark-theme");
		localStorage.setItem(
			"theme",
			document.body.classList.contains("dark-theme") ? "dark" : "light"
		);
		renderCalendar(); // re-render calendar & event colors
	});
});

const homeBtn = document.getElementById("HomeButton");
homeBtn.addEventListener("click", () => {
	window.location.href = "Main-page.html"; 
});
