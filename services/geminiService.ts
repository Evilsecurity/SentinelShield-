import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
// Initialize securely - in a real app, this might proxy through a backend
const ai = new GoogleGenAI({ apiKey });

export const analyzeThreat = async (
  context: string,
  data: string
): Promise<string> => {
  if (!apiKey) return "API Key missing. Cannot perform AI analysis.";

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      You are an advanced Cybersecurity AI Specialist analyzing Android system data.
      Context: ${context}
      Data Trace: ${data}
      
      Task:
      1. Identify potential security risks (Rootkits, RATs, Spyware, APTs).
      2. Explain the technical implications of the anomaly.
      3. Recommend specific remediation steps (Kill process, Revoke permission, Quarantine).
      
      Output Format:
      - Concise, technical summary in Arabic (Security Report style).
      - Use bullet points for recommendations.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: 0.2, // Low temperature for analytical precision
      }
    });

    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return "فشل التحليل الذكي. يرجى التحقق من الاتصال.";
  }
};

export const getBehavioralInsight = async (logs: string[]): Promise<string> => {
   if (!apiKey) return "AI Offline";
   
   try {
     const response = await ai.models.generateContent({
       model: 'gemini-2.5-flash',
       contents: `Analyze these simplified Android system logs for suspicious behavior patterns (e.g. background data exfiltration, unauthorized mic access): \n${logs.join('\n')}\n\nRespond in Arabic.`,
     });
     return response.text || "No insights found.";
   } catch (e) {
     return "Error analyzing behavior.";
   }
}