chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log("Received in content script:", message);

	const { heading, paragraph } = message;

	const noAltImages = [];

	const images = document.querySelectorAll("img");
	images.forEach((image) => {
		if (image.alt === "") {
			console.log("No alt");
			noAltImages.push(image.src);
		} else {
			console.log("There is alt");
		}
	});

	if (noAltImages.length === 0) return;
	const prompt = `Generate descriptive alt text for the following image URLS: \n\n${noAltImages
		.map((url) => `-${url}`)
		.join("\n")}`;

	chrome.runtime.sendMessage({
		action: "callGeminiAPI",
		prompt: prompt,
		images: noAltImages,
	});
});
