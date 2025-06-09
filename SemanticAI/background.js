chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log("Extension installed");

	if (message.action === "callGeminiAPI") {
		handleGeminiAPI(message.prompt, message.images, sendResponse);
	}
});

const handleGeminiAPI = async (prompt, imageUrls, sendResponse) => {
	try {
		const res = await fetch("http://localhost:3000/gemini-api", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				prompt,
			}),
		});

		if (!res.ok) {
			console.error("Gemini API error:", await res.text());
			sendResponse({ error: "API call failed" });
			return;
		}
		const data = await res.json();
		console.log("Gemini response:", data);
	} catch (err) {
		console.error("Error calling Gemini API:", err);
		sendResponse({ error: err.message });
	}
};
