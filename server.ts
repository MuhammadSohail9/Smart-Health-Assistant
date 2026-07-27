import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Gemini Client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY environment variable is not set.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System Disclaimer Guidelines for AI Health Assistant
const SYSTEM_DISCLAIMER_PROMPT = `You are an AI Health Assistant.
Your purpose is to explain medical reports in clear language, educate users about laboratory tests and medications, and provide evidence-informed nutrition and lifestyle guidance.
You are not a licensed physician.
Never diagnose diseases with certainty.
Never prescribe medication.
Never recommend changing, starting, or stopping prescription medicines.
Always distinguish educational information from medical advice.
If the user reports emergency symptoms such as chest pain, severe shortness of breath, stroke symptoms (facial drooping, arm weakness, slurred speech), loss of consciousness, severe allergic reactions, or uncontrolled bleeding, immediately urge them to seek immediate emergency medical care (e.g. call 911 / local emergency service).

When interpreting laboratory results:
• Explain each result clearly.
• Compare it with the reference range.
• Describe possible reasons for abnormal findings.
• Suggest general lifestyle measures when appropriate.
• Recommend discussing significant abnormalities with a healthcare professional.
Maintain a compassionate, professional, and cautious tone. Use phrases like "may indicate", "can be associated with", and "discuss with your healthcare provider".`;

// ---------------- API ENDPOINTS ----------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 1. Analyze Medical Report (OCR / Text / Vision)
app.post('/api/analyze-report', async (req, res) => {
  try {
    const { textReport, imageBase64, mimeType } = req.body;
    if (!textReport && !imageBase64) {
      return res.status(400).json({ error: 'Please provide either a text report or image scan.' });
    }

    const ai = getGeminiClient();
    const prompt = `Analyze this medical lab report for a patient. Extract the parameters and generate a comprehensive clinical explanation for each test item.

Format your output strictly as a JSON object with this schema:
{
  "hospitalName": "string or null",
  "patientName": "string or null",
  "testDate": "YYYY-MM-DD or string",
  "doctorName": "string or null",
  "laboratoryName": "string or null",
  "reportType": "e.g. Lipid Profile, Complete Blood Count, Comprehensive Metabolic Panel",
  "summaryText": "A 2-3 sentence overview of overall findings in clear plain language",
  "overallFlag": "Normal | Needs Attention | Abnormal",
  "tests": [
    {
      "testName": "Name of test",
      "category": "CBC | Metabolic | Lipid | Liver | Kidney | Thyroid | Vitamins | Hormones | Other",
      "resultValue": "Exact result string with unit e.g. 7.2%",
      "numericValue": 7.2,
      "referenceRange": "Reference range string e.g. 4.0 - 5.6%",
      "unit": "%",
      "status": "Normal | High | Low | Critical",
      "whatItMeasures": "Plain language explanation of what this test measures",
      "whyItMatters": "Why this biomarker is important for health",
      "possibleCauses": ["List of 2-4 possible non-diagnostic reasons for this result"],
      "lifestyleFactors": ["2-3 evidence-based dietary/lifestyle measures"],
      "questionsForDoctor": ["2-3 specific questions the patient should ask their doctor"],
      "associatedConditions": ["Associated medical conditions or risk factors"],
      "followUpTests": ["Commonly considered follow-up tests"]
    }
  ]
}

Report Input:
${textReport || 'See attached image content'}`;

    let contents: any;
    if (imageBase64 && mimeType) {
      contents = {
        parts: [
          {
            inlineData: {
              data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
              mimeType: mimeType || 'image/jpeg',
            },
          },
          { text: prompt },
        ],
      };
    } else {
      contents = prompt;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_DISCLAIMER_PROMPT,
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '{}';
    const parsedData = JSON.parse(rawText);
    res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error analyzing report:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze report.' });
  }
});

// 2. Medication Review Endpoint
app.post('/api/medication-review', async (req, res) => {
  try {
    const { medicineName, dose, frequency, reason, userProfile } = req.body;
    if (!medicineName) {
      return res.status(400).json({ error: 'Medicine name is required.' });
    }

    const ai = getGeminiClient();
    const prompt = `Review the prescribed medication "${medicineName}" (Dose: ${dose || 'Not specified'}, Frequency: ${frequency || 'Not specified'}, Reason: ${reason || 'Not specified'}).
Patient Context: Age ${userProfile?.age || 'N/A'}, Gender ${userProfile?.gender || 'N/A'}, Known Conditions: ${JSON.stringify(userProfile?.conditions || {})}, Drug Allergies: ${userProfile?.drugAllergies?.join(', ') || 'None'}.

Provide a structured educational breakdown in JSON format:
{
  "purpose": "Detailed explanation of what this medication does and how it works in the body",
  "commonSideEffects": ["List of 3-5 common side effects"],
  "howToTake": "Practical instructions on timing, with food vs water",
  "foodInteractions": "Foods or drinks to enjoy or avoid",
  "alcoholInteractions": "Effect of alcohol consumption with this medicine",
  "missedDoseGuidance": "General guidance on what to do if a dose is missed",
  "storageInstructions": "Storage temperature and light exposure guidance",
  "monitoringNeeded": "Lab tests or vitals commonly monitored with this drug",
  "whenToSeekMedicalHelp": "Red flag symptoms requiring immediate physician contact"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_DISCLAIMER_PROMPT,
        responseMimeType: 'application/json',
      },
    });

    const data = JSON.parse(response.text || '{}');
    res.json({ success: true, data });
  } catch (error: any) {
    console.error('Error in medication review:', error);
    res.status(500).json({ error: error.message || 'Failed to review medication.' });
  }
});

// 3. Drug Interaction Checker Endpoint
app.post('/api/check-interactions', async (req, res) => {
  try {
    const { medications, userProfile } = req.body;
    const ai = getGeminiClient();

    const medNames = (medications || []).map((m: any) => `${m.name} (${m.dose || ''})`).join(', ');

    const prompt = `Perform a comprehensive multi-drug and condition interaction review for these medications: [${medNames}].
Patient Health Profile:
- Age: ${userProfile?.age}, Gender: ${userProfile?.gender}
- Conditions: ${JSON.stringify(userProfile?.conditions || {})}
- Allergies: ${userProfile?.drugAllergies?.join(', ') || 'None'}
- Pregnancy/Nursing Status: ${userProfile?.pregnancyStatus}

Return JSON with this exact structure:
{
  "interactions": [
    {
      "drugA": "Drug Name 1",
      "drugB": "Drug Name 2",
      "severity": "Major | Moderate | Minor",
      "description": "Explanation of how these two drugs interact",
      "recommendation": "What the patient should discuss with their doctor or pharmacist"
    }
  ],
  "foodInteractions": ["Key food/beverage interactions to be aware of e.g. Grapefruit juice, high potassium foods"],
  "alcoholWarnings": ["Specific alcohol safety warnings for this combination"],
  "conditionPrecautions": ["Special warnings related to kidney function, liver function, diabetes, or blood pressure"],
  "summaryAdvice": "Compassionate summary advising consultation with doctor or pharmacist before making any changes"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_DISCLAIMER_PROMPT,
        responseMimeType: 'application/json',
      },
    });

    const data = JSON.parse(response.text || '{}');
    res.json({ success: true, data });
  } catch (error: any) {
    console.error('Error checking interactions:', error);
    res.status(500).json({ error: error.message || 'Failed to check drug interactions.' });
  }
});

// 4. Food Recommendation Engine Endpoint
app.post('/api/food-recommendations', async (req, res) => {
  try {
    const { userProfile, labResults } = req.body;
    const ai = getGeminiClient();

    const prompt = `Generate evidence-informed personalized nutrition and meal recommendations.
User Profile: Age ${userProfile?.age}, Gender ${userProfile?.gender}, Weight ${userProfile?.weightKg}kg, BMI ${userProfile?.bmi}.
Conditions: ${JSON.stringify(userProfile?.conditions || {})}.
Food Allergies: ${userProfile?.foodAllergies?.join(', ') || 'None'}.
Recent Lab Results: ${JSON.stringify((labResults || []).map((t: any) => `${t.testName}: ${t.resultValue} (${t.status})`))}.

Return JSON:
{
  "condition": "Primary Dietary Focus (e.g. Diabetes & Cardiovascular Health)",
  "recommendedFoods": [
    { "name": "Food Item Name", "category": "Whole Grains | Vegetables | Healthy Fats | Proteins | Fruits", "benefits": "Why it helps this specific profile" }
  ],
  "foodsToLimit": [
    { "name": "Food or Drink Name", "reason": "Scientific reason why it should be limited" }
  ],
  "sampleMealIdeas": {
    "breakfast": "Nutritious breakfast suggestion",
    "lunch": "Heart-healthy lunch suggestion",
    "dinner": "Balanced dinner suggestion",
    "snacks": "Wholesome snack ideas"
  },
  "keyNutritionalFocus": ["3-4 key dietary principles e.g. Low Glycemic Index, High Soluble Fiber, Reduced Sodium"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_DISCLAIMER_PROMPT,
        responseMimeType: 'application/json',
      },
    });

    const data = JSON.parse(response.text || '{}');
    res.json({ success: true, data });
  } catch (error: any) {
    console.error('Error generating food recommendations:', error);
    res.status(500).json({ error: error.message || 'Failed to generate dietary guidance.' });
  }
});

// 5. Lifestyle Coach Endpoint
app.post('/api/lifestyle-coach', async (req, res) => {
  try {
    const { userProfile, labResults } = req.body;
    const ai = getGeminiClient();

    const prompt = `Generate tailored lifestyle and wellness advice for a patient with:
- Age: ${userProfile?.age}, BMI: ${userProfile?.bmi}, Exercise: ${userProfile?.exerciseFrequency}, Sleep: ${userProfile?.sleepHours}h, Stress: ${userProfile?.stressLevel}, Water: ${userProfile?.waterIntakeLiters}L.
- Conditions: ${JSON.stringify(userProfile?.conditions || {})}.
- Recent Labs: ${JSON.stringify((labResults || []).map((t: any) => `${t.testName}: ${t.resultValue} (${t.status})`))}.

Return JSON array of 5 distinct lifestyle recommendation categories:
[
  {
    "category": "Exercise | Hydration | Sleep | Stress | Screen Time | Substance Use",
    "title": "Clear Actionable Title",
    "advice": "Detailed evidence-based explanation",
    "actionableSteps": ["Step 1", "Step 2", "Step 3"],
    "impactScore": "High Impact | Moderate Impact"
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_DISCLAIMER_PROMPT,
        responseMimeType: 'application/json',
      },
    });

    const data = JSON.parse(response.text || '[]');
    res.json({ success: true, data });
  } catch (error: any) {
    console.error('Error generating lifestyle advice:', error);
    res.status(500).json({ error: error.message || 'Failed to generate lifestyle advice.' });
  }
});

// 6. Interactive AI Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, userProfile, activeReports, medications } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message text is required.' });
    }

    const ai = getGeminiClient();

    // Check for emergency keywords
    const emergencyKeywords = ['chest pain', 'heart attack', 'stroke', 'difficulty breathing', 'severe bleeding', 'unconscious', 'anaphylaxis', 'slurred speech', 'facial droop'];
    const lowerMessage = message.toLowerCase();
    const isEmergency = emergencyKeywords.some(kw => lowerMessage.includes(kw));

    const contextHeader = `Patient Context:
- Name: ${userProfile?.name || 'Patient'}, Age: ${userProfile?.age || 'N/A'}, Gender: ${userProfile?.gender || 'N/A'}
- Medical Conditions: ${JSON.stringify(userProfile?.conditions || {})}
- Current Medications: ${(medications || []).map((m: any) => `${m.name} ${m.dose}`).join(', ') || 'None'}
- Recent Lab Highlights: ${(activeReports?.[0]?.tests || []).filter((t: any) => t.status !== 'Normal').map((t: any) => `${t.testName}: ${t.resultValue} (${t.status})`).join('; ') || 'All recent labs normal'}
`;

    const formattedHistory = (history || []).map((h: any) => ({
      role: h.sender === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }],
    }));

    const chat = ai.chats.create({
      model: 'gemini-3.6-flash',
      history: formattedHistory,
      config: {
        systemInstruction: `${SYSTEM_DISCLAIMER_PROMPT}\n\n${contextHeader}`,
      },
    });

    const chatResponse = await chat.sendMessage({
      message: `${message}\n\n[System Note: Provide a compassionate, clear, well-structured educational response. Suggest 2-3 short relevant follow-up questions at the end under a header 'Suggested Follow-up Questions:'.]`,
    });

    const responseText = chatResponse.text || '';

    res.json({
      success: true,
      text: responseText,
      isEmergencyAlert: isEmergency,
    });
  } catch (error: any) {
    console.error('Error in chat route:', error);
    res.status(500).json({ error: error.message || 'Failed to process chat message.' });
  }
});

// 7. Health Summary Generator Endpoint
app.post('/api/health-summary', async (req, res) => {
  try {
    const { userProfile, reports, medications } = req.body;
    const ai = getGeminiClient();

    const prompt = `Synthesize a comprehensive, single-page clinical conversation preparation summary for the patient to bring to their next doctor appointment.
User Profile: Age ${userProfile?.age}, Gender ${userProfile?.gender}, Conditions: ${JSON.stringify(userProfile?.conditions || {})}.
Active Medications: ${JSON.stringify((medications || []).map((m: any) => `${m.name} ${m.dose} (${m.reason})`))}.
Recent Lab Reports: ${JSON.stringify((reports || []).map((r: any) => ({ title: r.title, date: r.testDate, abnormalTests: r.tests.filter((t: any) => t.status !== 'Normal').map((t: any) => `${t.testName}: ${t.resultValue} (${t.status})`) })))}.

Return JSON:
{
  "generatedDate": "${new Date().toISOString().split('T')[0]}",
  "patientOverview": "A professional 2-3 sentence summary of patient age, active conditions, and general health trajectory",
  "keyAbnormalities": ["List of abnormal lab findings and why they need clinician review"],
  "medicationSummary": ["Summary of current regimens and key items to monitor"],
  "dietaryPlanOverview": "Overview of personalized dietary focus (e.g. low glycemic, cardiovascular health)",
  "lifestyleActionPlan": ["Actionable steps patient is undertaking e.g. exercise, sleep, stress"],
  "questionsToAskDoctor": ["5 clear, prioritized, highly relevant questions to ask at the next doctor appointment"],
  "recommendedFollowUpIntervals": "General recommended timeline for next routine blood rechecks and checkups"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_DISCLAIMER_PROMPT,
        responseMimeType: 'application/json',
      },
    });

    const data = JSON.parse(response.text || '{}');
    res.json({ success: true, data });
  } catch (error: any) {
    console.error('Error generating health summary:', error);
    res.status(500).json({ error: error.message || 'Failed to generate health summary.' });
  }
});

// ---------------- VITE MIDDLEWARE / PRODUCTION SERVING ----------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Health Assistant server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
