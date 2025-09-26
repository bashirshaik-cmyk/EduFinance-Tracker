
import { GoogleGenAI } from "@google/genai";
import type { LoanApplication } from "../types";

// Assume API_KEY is set in the environment variables
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getStuckCaseSuggestion = async (application: LoanApplication): Promise<string> => {
    if (!API_KEY) {
        return Promise.resolve("AI Assistant is offline. Please check the API key configuration.");
    }

    const { learnerName, nbfcName, currentStage, daysInCurrentStage } = application;

    const prompt = `
        A student loan application is stuck. Here are the details:
        - Learner Name: ${learnerName}
        - NBFC: ${nbfcName}
        - Current Stage: ${currentStage}
        - Days in Current Stage: ${daysInCurrentStage}

        Based on the stage "${currentStage}", what are the most common reasons for a delay of ${daysInCurrentStage} days?
        Please provide 2-3 probable reasons and suggest concrete, actionable next steps for a Program Registration Expert to resolve this.
        Format the response clearly with headings for "Probable Reasons" and "Actionable Next Steps".
        Keep the tone helpful and concise.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.5,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching suggestion from Gemini API:", error);
        return "There was an error communicating with the AI assistant. Please try again later.";
    }
};

export const generateWhatsappMessage = async (application: LoanApplication): Promise<string> => {
    if (!API_KEY) {
        return Promise.resolve("AI Assistant is offline. Please check the API key configuration.");
    }

    const { learnerName, currentStage, daysInCurrentStage, nbfcName } = application;
    const isStuck = daysInCurrentStage > 2;

    const prompt = `
        You are a helpful and friendly Program Registration Expert (PRE).
        Write a concise and professional WhatsApp message for a student about their education loan application.

        Here are the details:
        - Learner Name: ${learnerName}
        - NBFC: ${nbfcName}
        - Current Stage: ${currentStage}
        - Days in this Stage: ${daysInCurrentStage}

        Instructions:
        1. Address the student, ${learnerName}, directly by name.
        2. Keep the tone encouraging and supportive.
        3. ${isStuck ? `The application seems stuck. Gently nudge the student to complete the current stage (${currentStage}) and ask if they need help.` : `The application is progressing well. Provide a positive status update for the current stage (${currentStage}).`}
        4. Mention that you are available to help if they have any questions.
        5. End with a friendly closing.
        6. Use emojis sparingly to maintain a professional yet friendly tone.
        7. The message should be ready to send, do not include any placeholders like [Learner Name].
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.6,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating WhatsApp message from Gemini API:", error);
        return "There was an error generating the message. Please try again later.";
    }
}
