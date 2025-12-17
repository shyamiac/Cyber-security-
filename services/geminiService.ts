import { GoogleGenAI } from "@google/genai";
import { Packet } from "../types";

// Initialize Gemini Client
// Requires process.env.API_KEY to be set
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeThreatWithGemini = async (packet: Packet): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please provide a valid Gemini API Key to use the analysis feature.";
  }

  try {
    const prompt = `
      You are a cybersecurity expert analyzing a suspicious network packet caught by an NIDS.
      
      Packet Details:
      - Source IP: ${packet.sourceIp}
      - Destination IP: ${packet.destIp}
      - Protocol: ${packet.protocol}
      - Destination Port: ${packet.destPort}
      - Flag: ${packet.flag || 'N/A'}
      - Initial Assessment: ${packet.description}
      - Threat Level: ${packet.threatLevel}

      Please provide a brief, technical analysis of why this might be malicious and suggest 2-3 specific mitigation steps.
      Format the response as a concise JSON object with 'analysis' and 'mitigation' (array of strings) fields.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return JSON.stringify({
      analysis: "Failed to connect to AI analysis service.",
      mitigation: ["Check internet connection", "Verify API Key"]
    });
  }
};
