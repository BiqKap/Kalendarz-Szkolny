document.addEventListener("DOMContentLoaded", () => {
	const btnTheme = document.getElementById("ThemeSwitch");
	const btnSave = document.getElementById("saveEventBtn");

	if (localStorage.getItem("theme") === "dark") {
		document.body.classList.add("dark-theme");
	}

	btnTheme.addEventListener("click", () => {
		document.body.classList.toggle("dark-theme");
		localStorage.setItem(
			"theme",
			document.body.classList.contains("dark-theme") ? "dark" : "light",
		);
	});

	function renderEvents() {
		const eventsContainer = document.getElementById("CheckCalendar");
		const events = JSON.parse(localStorage.getItem("schoolEvents") || "[]");

		eventsContainer.innerHTML = events
			.map(
				(e, index) => `
            <div class="event">
                <button class="deleteEventBtn" data-index="${index}">✕</button>
                <h3>${e.title}</h3>
                <p>${e.date} ${e.time ? "– godzina lekcyjna " + e.time : ""}</p>
                <p>${e.desc}</p>
            </div>
        `,
			)
			.join("");

		const deleteButtons = document.querySelectorAll(".deleteEventBtn");
		deleteButtons.forEach((btn) => {
			btn.addEventListener("click", (ev) => {
				const idx = ev.target.getAttribute("data-index");
				let events = JSON.parse(localStorage.getItem("schoolEvents") || "[]");
				events.splice(idx, 1);
				localStorage.setItem("schoolEvents", JSON.stringify(events));
				renderEvents();
			});
		});
	}

	btnSave.addEventListener("click", () => {
		const title = document.getElementById("eventType").value;
		const time = document.getElementById("lessonHour").value;
		const date = document.getElementById("eventDate").value;
		const desc = document.getElementById("eventDescription").value.trim();

		if (!title || !date) {
			console.warn("Event needs at least a title and date.");
			return;
		}

		const newEvent = { title, date, time, desc };
		let events = JSON.parse(localStorage.getItem("schoolEvents") || "[]");
		events.push(newEvent);
		localStorage.setItem("schoolEvents", JSON.stringify(events));

		document.getElementById("eventDate").value = "";
		document.getElementById("lessonHour").value = "";
		document.getElementById("eventDescription").value = "";

		renderEvents();
	});

	renderEvents();
});

const homeBtn = document.getElementById("HomeButton");
homeBtn.addEventListener("click", () => {
	window.location.href = "Main-page.html";
});
