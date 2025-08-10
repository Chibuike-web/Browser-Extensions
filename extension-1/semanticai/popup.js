const heading = document.getElementById("heading");
const paragraph = document.getElementById("paragraph");
const submitBtn = document.querySelector("button");

submitBtn.addEventListener("click", (e) => {
	e.preventDefault();
	const data = {
		heading: heading.value,
		paragraph: paragraph.value,
	};

	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, data);
	});
});
