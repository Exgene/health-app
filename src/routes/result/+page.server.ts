export function load() {
	// Retrieve the stored PDF content
	const pdfContent = global.pdfContent || '';
	const geminiResponse = global.geminiResponse || '';
	return {
		pdfContent,
		geminiResponse
	};
}

export const ssr = false;
