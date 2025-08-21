// @ts-check
/// <reference types="chrome"/>

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log("Received in content script:", message);
	if (message.action === "scan images") {
		const noAltImagesSrc = scanImages();
		sendResponse({ images: noAltImagesSrc });
		chrome.runtime.sendMessage({ imageSrcs: noAltImagesSrc }, (res) => {
			if (res.error) {
				console.log(res.error, res.details);
			} else {
				attachAltTexts(res.data);
			}
		});
	}
});

function scanImages() {
	const allImages = document.querySelectorAll("img");
	const noAltImages = [];
	allImages.forEach((img) => {
		if (!img.hasAttribute("alt") || img.alt.trim() === "") {
			noAltImages.push(img);
		}
	});

	const noAltImagesSrc = noAltImages.map((i) => i.src);

	return noAltImagesSrc;
}

function attachAltTexts(results) {
	results.forEach((item) => {
		const imgs = document.querySelectorAll(`img[src="${item.src}"]`);
		imgs.forEach((img) => {
			img.setAttribute("alt", item.alt);
			console.log(`✅ Alt set: ${item.alt} → ${item.src}`);
		});
	});
	const allImages = document.querySelectorAll("img");
}
