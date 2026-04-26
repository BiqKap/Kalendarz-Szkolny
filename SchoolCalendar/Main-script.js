const btn = document.getElementById("ThemeSwitch");

function updateThemeIcon() {
	btn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
}

if (localStorage.getItem("theme") === "dark") {
	document.body.classList.add("dark");
}
updateThemeIcon();

btn.addEventListener("click", () => {
	document.body.classList.toggle("dark");
	localStorage.setItem(
		"theme",
		document.body.classList.contains("dark") ? "dark" : "light",
	);
	updateThemeIcon();
});
