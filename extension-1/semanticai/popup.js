/// <reference types="chrome"/>

const wrapper = document.getElementById("wrapper");
const btnContainer = document.querySelector(".btn-container");
const scanBtn = document.getElementById("scan-btn");
const addAltBtn = document.getElementById("add-alt-btn");
const resultArea = document.getElementById("result-area");
let noAltImagesSrc = [];

scanBtn?.addEventListener("click", (e) => {
	e.preventDefault();

	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		const tabId = tabs[0]?.id;
		if (typeof tabId === "number") {
			chrome.tabs.sendMessage(tabId, { action: "scan images" }, (res) => {
				noAltImagesSrc = res.images || [];

				if (resultArea) {
					if (noAltImagesSrc.length === 0) {
						resultArea.innerHTML = `<p class="status-message success">All images have alt text 🎉</p>`;
						return;
					}

					resultArea.classList.add("with-images");
					const images = noAltImagesSrc

						.map(
							/**
							 * @param {string} img
							 * @param {number} index
							 * @returns {string}
							 */ (img, index) => {
								return /*html*/ `
                <div class="missing-alt">
                  <img class="image" src="${img}" />
									<input id="input-${index}" class="alt-input"/>
                </div>
              `;
							}
						)
						.join("");
					resultArea.innerHTML = `
						<p class="status-message warning">Found ${noAltImagesSrc.length} images without alt text</p>
						<div class="images-container">${images}</div>
					`;
				}
			});
		}
	});
});

addAltBtn.addEventListener("click", (e) => {
	e.preventDefault();

	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		const tabId = tabs[0]?.id;
		if (typeof tabId === "number") {
			chrome.tabs.sendMessage(tabId, { action: "add alt" }, (res) => {});
		}
	});

	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
		if (message.info === "alt text added") {
			resultArea.innerHTML = `<p class="status-message success">All images have alt text 🎉</p>`;
		}
	});
});
