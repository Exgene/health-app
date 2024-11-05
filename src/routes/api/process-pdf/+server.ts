import { GEMINI_API_KEY } from '$env/static/private';
import { supabase } from '$lib/server/db';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { json } from '@sveltejs/kit';
import { PDFExtract, type PDFExtractOptions } from 'pdf.js-extract';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Configure PDF extract options
const options: PDFExtractOptions = {
	firstPage: 1,
	lastPage: undefined,
	password: '',
	verbosity: -1,
	normalizeWhitespace: true,
	disableCombineTextItems: false,
	// Set custom path for pdf.worker.js
	pdfJS: {
		workerSrc: '/node_modules/pdf.js-extract/lib/pdfjs/pdf.worker.js'
	}
};

export async function POST({ request }) {
	try {
		const formData = await request.formData();
		const pdfFile = formData.get('pdf');

		if (!pdfFile || !(pdfFile instanceof File)) {
			throw new Error('No PDF file provided');
		}

		// Initialize with options
		const pdfExtract = new PDFExtract();
		const arrayBuffer = await pdfFile.arrayBuffer();
		const data = await pdfExtract.extractBuffer(arrayBuffer, options);

		// Combine all page content
		const fullText = data.pages
			.map((page) => page.content.map((item) => item.str).join(' '))
			.join('\n');

		// Get Gemini response and store both
		const geminiResponse = await getGeminiResponse(fullText);
		const dataResult = await storeTextContent(fullText, geminiResponse, arrayBuffer);

		console.log(dataResult);

		return json({ success: true, id: dataResult.id });
	} catch (error) {
		console.error('Error processing PDF:', error);
		return json({ success: false, error: 'Failed to process PDF' }, { status: 500 });
	}
}

async function getGeminiResponse(text: string) {
	const prompt = `You are an AI health assistant analyzing medical reports. Please analyze the following medical report and provide insights in JSON format.

Expected format:
{
	"aiInsights": "Key medical findings, diagnoses, and important observations from the report",
	"foodToEat": "List of recommended foods based on the medical condition",
	"foodNotToEat": "List of foods to avoid based on the medical condition",
	"normal": true/false
}

Example responses:

Abnormal case:
{
	"aiInsights": "Patient shows elevated blood pressure (140/90) and high cholesterol levels (240 mg/dL). Early signs of type 2 diabetes with HbA1c of 6.3%.",
	"foodToEat": "Leafy greens, whole grains, lean proteins, berries, fatty fish, nuts, seeds, legumes",
	"foodNotToEat": "Processed foods, saturated fats, sugary drinks, high-sodium foods, refined carbohydrates",
	"normal": false
}

Normal case:
{
	"aiInsights": "All vital signs and lab results are within normal ranges. Blood pressure 120/80, cholesterol 180 mg/dL, blood sugar 85 mg/dL, and other markers showing optimal health.",
	"foodToEat": "",
	"foodNotToEat": "",
	"normal": true
}

If no relevant medical insights or dietary recommendations can be found, return:
{
	"aiInsights": "",
	"foodToEat": "",
	"foodNotToEat": "",
	"normal": false
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

async function storeTextContent(text: string, geminiResponse: string, arrayBuffer: ArrayBuffer) {
	try {
		// Convert the PDF to base64 for storage
		const pdfBase64 = Buffer.from(arrayBuffer).toString('base64');

		// First check if this PDF already exists
		const { data: existingData, error: searchError } = await supabase
			.from('medical_reports')
			.select('*')
			.eq('raw_text', text)
			.single();

		if (searchError && searchError.code !== 'PGRST116') {
			// PGRST116 is "not found" error
			console.error('Supabase search error:', searchError);
			throw new Error('Failed to search database');
		}

		// If PDF exists, return existing data
		if (existingData) {
			return existingData;
		}

		// If PDF doesn't exist, insert new record
		const { data, error } = await supabase
			.from('medical_reports')
			.insert({
				raw_text: text,
				ai_analysis: geminiResponse,
				pdf_file: pdfBase64,
				created_at: new Date().toISOString()
			})
			.select('*')
			.single();

		if (error) {
			console.error('Supabase error:', error);
			throw new Error('Failed to store data in database');
		}

		return data;
	} catch (error) {
		console.error('Error storing content in Supabase:', error);
		throw new Error('Failed to store data in database');
	}
}
