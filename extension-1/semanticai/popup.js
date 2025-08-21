// @ts-check
/// <reference types="chrome"/>

const wrapper = document.getElementById("wrapper");
const btnContainer = document.querySelector(".btn-container");
const scanBtn = document.getElementById("scan-btn");
const resultArea = document.getElementById("result-area");
let noAltImages = [];

scanBtn?.addEventListener("click", (e) => {
	e.preventDefault();

	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		const tabId = tabs[0]?.id;
		if (typeof tabId === "number") {
			chrome.tabs.sendMessage(tabId, { action: "scan images" }, (res) => {
				noAltImages = res.images || [];

				if (resultArea) {
					if (noAltImages.length === 0) {
						resultArea.innerHTML = `<h6>All images have alt text 🎉</h6>`;
						return;
					}

					resultArea.classList.add("with-images");
					const images = noAltImages
						.map((img) => {
							return `
                <div class="missing-alt">
                  <img class="image" src="${img}" />
                </div>
              `;
						})
						.join("");
					resultArea.innerHTML = `
						<p class="text">Found ${noAltImages.length} images without alt text</p>
						<div class="images-container">${images}</div>
					`;
				}
			});
		}
	});
});
