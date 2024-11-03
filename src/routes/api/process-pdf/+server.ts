import { GEMINI_API_KEY } from '$env/static/private';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { json } from '@sveltejs/kit';
import * as pdfjsLib from 'pdfjs-dist';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function POST({ request }) {
	try {
		const formData = await request.formData();
		const pdfFile = formData.get('pdf');

		if (!pdfFile || !(pdfFile instanceof File)) {
			throw new Error('No PDF file provided');
		}

		const arrayBuffer = await pdfFile.arrayBuffer();
		const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

		let fullText = '';

		for (let i = 1; i <= pdf.numPages; i++) {
			const page = await pdf.getPage(i);
			const textContent = await page.getTextContent();
			const pageText = textContent.items.map((item) => ('str' in item ? item.str : '')).join(' ');
			fullText += pageText + '\n';
		}

		// Get Gemini response and store both
		const geminiResponse = await getGeminiResponse(fullText);
		await storeTextContent(fullText, geminiResponse);


		return json({ success: true });
	} catch (error) {
		console.error('Error processing PDF:', error);
		return json({ success: false, error: 'Failed to process PDF' }, { status: 500 });
	}
}

async function getGeminiResponse(text: string) {
	const prompt = `You are an AI health assistant analyzing medical reports. Please analyze the following medical report and provide insights in JSON format.

Expected format:
{
	"ai-insights": "Key medical findings, diagnoses, and important observations from the report",
	"food-to-eat": "List of recommended foods based on the medical condition",
	"food-not-to-eat": "List of foods to avoid based on the medical condition"
}

Example response:
{
	"ai-insights": "Patient shows elevated blood pressure (140/90) and high cholesterol levels (240 mg/dL). Early signs of type 2 diabetes with HbA1c of 6.3%.",
	"food-to-eat": "Leafy greens, whole grains, lean proteins, berries, fatty fish, nuts, seeds, legumes",
	"food-not-to-eat": "Processed foods, saturated fats, sugary drinks, high-sodium foods, refined carbohydrates"
}

If no relevant medical insights or dietary recommendations can be found, return:
{
	"ai-insights": "",
	"food-to-eat": "",
	"food-not-to-eat": ""
}

Please analyze this medical report:
${text}`;

	// For text-only input, use the gemini-pro modelpdfFile
	const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

	const result = await model.generateContent(prompt);
	const response = await result.response;
	console.log(response.text());

	return response.text();
}

async function storeTextContent(text: string, geminiResponse: string) {
	global.pdfContent = text;
	global.geminiResponse = geminiResponse;
}
