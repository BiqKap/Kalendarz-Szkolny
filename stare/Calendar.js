document.addEventListener("DOMContentLoaded", () => {
	const themeBtn = document.getElementById("ThemeSwitch");

	// Restore saved theme
	if (localStorage.getItem("theme") === "dark") {
		document.body.classList.add("dark-theme");
	}

	function updateThemeIcon() {
		themeBtn.textContent = document.body.classList.contains("dark-theme")
			? "☀️"
			: "🌙";
	}
	updateThemeIcon();

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
		let fullHtml = "";

		for (let offset = 0; offset < 3; offset++) {
			const refDate = new Date(today.getFullYear(), today.getMonth() + offset, 1);
			const year = refDate.getFullYear();
			const month = refDate.getMonth();
			const firstDay = new Date(year, month, 1).getDay();
			const daysInMonth = new Date(year, month + 1, 0).getDate();

			const monthName = refDate.toLocaleString("pl-PL", {
				month: "long",
				year: "numeric",
			});

			fullHtml += `<h2 class="month-heading">${monthName.charAt(0).toUpperCase() + monthName.slice(1)}</h2>`;
			fullHtml += '<div class="calendar-grid">';

			const weekdays = ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "So"];
			weekdays.forEach(
				(day) => (fullHtml += `<div class="calendar-header">${day}</div>`)
			);

			for (let i = 0; i < firstDay; i++) {
				fullHtml += `<div class="calendar-cell empty"></div>`;
			}

			for (let d = 1; d <= daysInMonth; d++) {
				const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
					d
				).padStart(2, "0")}`;
				const dayEvents = events.filter((e) => e.date === dateStr);

				// Highlight today
				const isToday =
					offset === 0 &&
					d === today.getDate() &&
					month === today.getMonth() &&
					year === today.getFullYear();

				fullHtml += `<div class="calendar-cell${isToday ? " today" : ""}"><div class="day-number">${d}</div>`;

				dayEvents.forEach((ev) => {
					const globalIndex = events.indexOf(ev);
					fullHtml += `<div class="event-block"
						data-index="${globalIndex}"
						style="
							background-color:${typeColors[theme][ev.title] || "#eee"};
							color:${theme === "dark" ? "#e0e0e0" : "#000"};
						">
						${ev.title}${ev.time ? " – lekcja " + ev.time : ""}
					</div>`;
				});

				fullHtml += `</div>`;
			}

			fullHtml += "</div>";
		}

		calendarContainer.innerHTML = fullHtml;
		attachEventListeners(events);
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
		updateThemeIcon();
		renderCalendar();
	});
});

const homeBtn = document.getElementById("HomeButton");
homeBtn.addEventListener("click", () => {
	window.location.href = "Main-page.html";
});
