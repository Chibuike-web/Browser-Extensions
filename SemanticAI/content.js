chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log("Received in content script:", message);

	const { heading, paragraph } = message;
	const h1 = document.querySelector("h1");
	const p = document.querySelector("p");
	if (h1) {
		h1.textContent = heading;
	} else {
		console.log("No <h1> found on this page");
	}

	if (p) {
		p.textContent = paragraph;
	} else {
		console.log("No <p> found on this page");
	}
});
