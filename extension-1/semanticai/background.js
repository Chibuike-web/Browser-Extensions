// @ts-check
/// <reference types="chrome"/>

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log("Extension installed");

	if (message.imageSrcs) {
		const srcs = message.imageSrcs;
		const srcsInText = srcs.join("\n"); // better than split/join since imageSrcs is already an array

		const prompt = `
			You are an assistant generating accurate and accessible image alt text for web accessibility
			(WCAG compliance). Guidelines: - Be clear, concise, and descriptive (usually 1 sentence, max
			15 words). - Focus on the essential content or action in the image. - Avoid redundant phrases
			like "Image of" or "Picture of." - If text appears in the image, include it. - If the image is
			decorative (no meaningful content), return "decorative". - Tailor description depending on
			type (e.g., product → mention brand/color; chart → describe key trend). Now generate alt text
			for each image below. Return JSON as: [ { "src": "<image_url
				>", "alt": "<alt_text>" } ] Images: ${srcsInText} </alt_text></image_url
			>
		`;

		handleGeminiAPI(prompt, sendResponse);
		return true;
	}
});

const handleGeminiAPI = async (prompt, sendResponse) => {
	try {
		const res = await fetch("http://localhost:7248/gemini-api", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ prompt }),
		});

		if (!res.ok) {
			const errMsg = await res.text();
			console.error("Gemini API error:", errMsg);
			sendResponse({ error: "API call failed", details: errMsg });
			return;
		}
		const data = await res.json();
		console.log("Gemini response:", data.altText);

		sendResponse({ success: true, data: data.altText });
	} catch (err) {
		console.error("Error calling Gemini API:", err);
		sendResponse({ error: err.message });
	}
};
