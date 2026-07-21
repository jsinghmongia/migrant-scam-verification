import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database for Hackathon Demo
interface Agent {
  id: string;
  name: string;
  licenseNumber: string;
  agencyName: string;
  status: 'CERTIFIED' | 'REVOKED' | 'SUSPENDED' | 'NOT_FOUND';
  certifiedSince?: string;
  validUntil?: string;
  countryScope?: string[];
  contactEmail?: string;
  contactPhone?: string;
  officeAddress?: string;
  rating?: number;
  remarks?: string;
}

interface ScamReport {
  id: string;
  reportedAt: string;
  scamType: 'whatsapp_msg' | 'facebook_ad' | 'job_offer' | 'unlicensed_agent' | 'upfront_fee' | 'other';
  title: string;
  description: string;
  agentName?: string;
  phoneNumber?: string;
  upiId?: string;
  bankAccount?: string;
  countryTargeted: string;
  evidenceText?: string;
  verifiedCount: number;
}

const certifiedAgents: Agent[] = [
  {
    id: "1",
    name: "Overseas Careers Ltd",
    licenseNumber: "RL-1084",
    agencyName: "Overseas Careers Bangladesh Ltd.",
    status: "CERTIFIED",
    certifiedSince: "2018-05-12",
    validUntil: "2028-05-12",
    countryScope: ["Saudi Arabia", "UAE", "Singapore", "Malaysia"],
    contactEmail: "info@overseascareersbd.com",
    contactPhone: "+880 2-9876543",
    officeAddress: "12 Dilkusha C/A, Motijheel, Dhaka, Bangladesh",
    rating: 4.8,
    remarks: "Highly rated agency with zero complaints over 10 years of service."
  },
  {
    id: "2",
    name: "Global Placements Corp",
    licenseNumber: "POEA-832-736",
    agencyName: "Global Placements Philippines Inc.",
    status: "CERTIFIED",
    certifiedSince: "2015-10-20",
    validUntil: "2027-10-20",
    countryScope: ["Japan", "Canada", "Germany", "New Zealand"],
    contactEmail: "recruitment@globalplacement-ph.com",
    contactPhone: "+63 2-8123-4567",
    officeAddress: "789 Taft Avenue, Malate, Manila, Philippines",
    rating: 4.9,
    remarks: "Fully government certified and accredited for high-skilled job pathways."
  },
  {
    id: "3",
    name: "East Africa Job Ventures",
    licenseNumber: "NEA-RE-00412",
    agencyName: "NEA Kenya Recruitment Services",
    status: "CERTIFIED",
    certifiedSince: "2020-02-15",
    validUntil: "2026-12-31",
    countryScope: ["Qatar", "Bahrain", "Kuwait", "Oman"],
    contactEmail: "apply@eajobventures.co.ke",
    contactPhone: "+254 20 123 4567",
    officeAddress: "4th Floor, Jubilee Insurance House, Wabera St, Nairobi, Kenya",
    rating: 4.2,
    remarks: "Reputable East African certified agency focusing on hotel and logistics roles."
  },
  {
    id: "4",
    name: "Alpha Trust Recruiters",
    licenseNumber: "RL-0921",
    agencyName: "Alpha Trust Recruiting Services Ltd.",
    status: "REVOKED",
    certifiedSince: "2014-04-01",
    validUntil: "2024-03-31",
    countryScope: ["Malaysia", "Singapore", "Thailand"],
    officeAddress: "Sector 4, Uttara, Dhaka, Bangladesh",
    remarks: "License revoked indefinitely by the Department of Employment due to illegal charging of upfront service fees, confiscation of passports, and arranging tourist visas for work roles."
  },
  {
    id: "5",
    name: "Apex Job Finder Inc.",
    licenseNumber: "POEA-412-2021",
    agencyName: "Apex Job Finder Recruiting Agency",
    status: "SUSPENDED",
    certifiedSince: "2021-08-11",
    validUntil: "2026-08-11",
    countryScope: ["Saudi Arabia", "Taiwan", "Qatar"],
    officeAddress: "Ortigas Center, Pasig City, Philippines",
    remarks: "Suspended pending official investigation into reports of contract substitution, lower salary payouts, and unsafe work environments."
  },
  {
    id: "6",
    name: "Vikas Overseas Consultancies",
    licenseNumber: "MEA-IND-891",
    agencyName: "Vikas Overseas Consultancies Pvt. Ltd.",
    status: "CERTIFIED",
    certifiedSince: "2017-09-01",
    validUntil: "2027-09-01",
    countryScope: ["UAE", "Oman", "Singapore", "UK"],
    contactEmail: "contact@vikasoverseas.in",
    contactPhone: "+91 22 2845 6112",
    officeAddress: "Nariman Point, Mumbai, Maharashtra, India",
    rating: 4.5,
    remarks: "Certified by the Ministry of External Affairs, India. Valid license holder."
  },
  {
    id: "7",
    name: "Direct Path Poland Agency",
    licenseNumber: "POL-UNLICENSED-404",
    agencyName: "Direct Path Poland Recruitment",
    status: "REVOKED",
    remarks: "Impersonated a certified legal entity. Blacklisted by European recruitment bodies for charging exorbitant processing fees under the table."
  }
];

const reportedScams: ScamReport[] = [
  {
    id: "r1",
    reportedAt: "2026-07-18T10:30:00Z",
    scamType: "upfront_fee",
    title: "Fake Poland Fruit Picking Job Offer",
    description: "Advertised on Telegram and Facebook claiming high salaries of €2,400 per month with free accommodation. Requires paying a €450 'Visa Processing and Medical' fee upfront to a private bank account. Once paid, the recruiter blocked the victims.",
    agentName: "Global Overseas Travels (Fake Agency)",
    phoneNumber: "+91 98765 43210",
    upiId: "polandjobs@paytm",
    countryTargeted: "Poland",
    evidenceText: "Salary €2400/mo. No English or experience needed. Send passport scan + registration fee Rs. 38,000 to upi polandjobs@paytm.",
    verifiedCount: 24
  },
  {
    id: "r2",
    reportedAt: "2026-07-17T14:15:00Z",
    scamType: "whatsapp_msg",
    title: "Dubai Security Guard Tourist Visa Scam",
    description: "WhatsApp broadcast message requesting 50 security guards for a mall in Dubai. Tells candidates to travel on a 3-month visitor visa, assuring them that the agency will convert it to a work visa upon arrival. Charges $500 for ticket and visitor visa. The agency vanishes or leaves candidates stranded at the airport.",
    phoneNumber: "+971 50 123 4567",
    countryTargeted: "UAE",
    evidenceText: "URGENT hiring security guard Dubai. Salary 4000 AED. Fly on tourist visa next week. Medical + flight is $500. Message +971501234567.",
    verifiedCount: 18
  },
  {
    id: "r3",
    reportedAt: "2026-07-16T08:45:00Z",
    scamType: "facebook_ad",
    title: "Singapore Changi Airport Baggage Handler Job",
    description: "Facebook ads targeting rural youth in Southeast Asia promising $3,500 SGD salary as airport baggage handlers. Demands upfront fee of $300 for security clearance badge. No interview or certificate required, just immediate payment to secure the slot.",
    bankAccount: "DBS Savings 123-4567-890",
    countryTargeted: "Singapore",
    evidenceText: "Baggage Handler Singapore Airport. Earn $3500 SGD. No studies required. Just send $300 deposit to DBS Savings 123-4567-890 to secure your entry badge.",
    verifiedCount: 35
  },
  {
    id: "r4",
    reportedAt: "2026-07-15T11:20:00Z",
    scamType: "unlicensed_agent",
    title: "Unlicensed Sub-Agent Operating in Rural Punjab",
    description: "Local middleman going door-to-door in villages promising fruit packing jobs in Italy. Collecting original passports and cash advance of Rs. 1,50,000 ($1,800) per person. No license number, no physical office, operates entirely using a mobile phone.",
    agentName: "Gurpreet Singh (Local Broker)",
    phoneNumber: "+91 99123 45678",
    countryTargeted: "Italy",
    verifiedCount: 12
  }
];

// Lazy-initialize Gemini AI
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      console.warn("⚠️ GEMINI_API_KEY is not set or has dummy value. Using high-quality mock engine fallback.");
      return null;
    }
    try {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    } catch (err) {
      console.error("Error creating Gemini Client:", err);
      return null;
    }
  }
  return aiClient;
}

// REST APIs
app.get("/api/agents/search", (req, res) => {
  const query = (req.query.query as string || "").toLowerCase().trim();
  if (!query) {
    return res.json([]);
  }

  const results = certifiedAgents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(query) ||
      agent.licenseNumber.toLowerCase().includes(query) ||
      (agent.agencyName && agent.agencyName.toLowerCase().includes(query))
  );

  res.json(results);
});

app.get("/api/scams", (req, res) => {
  res.json(reportedScams);
});

app.get("/api/scams/search", (req, res) => {
  const query = (req.query.query as string || "").toLowerCase().trim();
  if (!query) {
    return res.json(reportedScams);
  }

  const results = reportedScams.filter(
    (scam) =>
      scam.title.toLowerCase().includes(query) ||
      scam.description.toLowerCase().includes(query) ||
      (scam.phoneNumber && scam.phoneNumber.toLowerCase().includes(query)) ||
      (scam.upiId && scam.upiId.toLowerCase().includes(query)) ||
      (scam.bankAccount && scam.bankAccount.toLowerCase().includes(query)) ||
      (scam.agentName && scam.agentName.toLowerCase().includes(query))
  );

  res.json(results);
});

app.post("/api/scams", (req, res) => {
  const { title, description, scamType, agentName, phoneNumber, upiId, bankAccount, countryTargeted, evidenceText } = req.body;

  if (!title || !description || !scamType || !countryTargeted) {
    return res.status(400).json({ error: "Missing required fields for reporting a scam." });
  }

  const newReport: ScamReport = {
    id: "r_" + Math.random().toString(36).substr(2, 9),
    reportedAt: new Date().toISOString(),
    scamType,
    title,
    description,
    agentName,
    phoneNumber,
    upiId,
    bankAccount,
    countryTargeted,
    evidenceText,
    verifiedCount: 1
  };

  reportedScams.unshift(newReport);
  res.status(201).json(newReport);
});

app.post("/api/scams/:id/upvote", (req, res) => {
  const scam = reportedScams.find((r) => r.id === req.params.id);
  if (!scam) {
    return res.status(404).json({ error: "Scam report not found." });
  }
  scam.verifiedCount += 1;
  res.json(scam);
});

// AI analysis fallback engine
function generateMockAIResponse(text: string) {
  const lowercase = text.toLowerCase();
  
  // Rule-based high quality analyzer
  let riskRating: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  let confidence = 85;
  const redFlags: string[] = [];
  const actionSteps: string[] = [
    "Always check the government POEA / MEA / NEA database for agency license numbers before making any commitment.",
    "Refuse any cash, bank, or mobile money payments without an official tax invoice and certified receipt.",
    "Ask for a written Employment Contract verified by your local embassy or Department of Labor."
  ];
  const scamPatternsDetected: string[] = [];
  let explanation = "";

  const hasUpfrontFees = lowercase.includes("fee") || lowercase.includes("charge") || lowercase.includes("pay upfront") || lowercase.includes("deposit") || lowercase.includes("processing cost") || lowercase.includes("medical fee") || lowercase.includes("payment") || lowercase.includes("money") || lowercase.includes("advance") || lowercase.includes("ticket cost");
  const hasTouristVisa = lowercase.includes("tourist") || lowercase.includes("visit visa") || lowercase.includes("visitor visa") || lowercase.includes("convert") || lowercase.includes("tourist visa");
  const hasVagueJob = lowercase.includes("no experience") || lowercase.includes("no skills") || lowercase.includes("earn big") || lowercase.includes("immediate join") || lowercase.includes("unskilled") || lowercase.includes("no study");
  const redirectChat = lowercase.includes("telegram") || lowercase.includes("whatsapp") || lowercase.includes("inbox") || lowercase.includes("dm me") || lowercase.includes("private message");

  if (hasUpfrontFees) {
    riskRating = 'HIGH';
    redFlags.push("Demand for Upfront Payments: Legitimate employers or licensed recruiters NEVER charge job seekers for visa, medical, or job placement costs prior to official deployment contract signing.");
    scamPatternsDetected.push("upfront_fees");
    actionSteps.unshift("DO NOT transfer any money or pay via mobile wallets, UPI, or cash. Immediate payments are the #1 sign of recruitment fraud.");
  }
  if (hasTouristVisa) {
    riskRating = 'HIGH';
    redFlags.push("Tourist Visa Conversion Trap: Traveling to a foreign country on a tourist or visit visa with the promise of 'converting it' to a work permit is highly illegal and a major trafficking danger. You can face deportation, blacklisting, or arrest.");
    scamPatternsDetected.push("tourist_visa");
    actionSteps.unshift("Refuse to fly on a visitor or tourist visa. A valid work visa must be physically issued and stamped on your passport in your home country before you travel.");
  }
  if (hasVagueJob) {
    if (riskRating === 'LOW') riskRating = 'MEDIUM';
    redFlags.push("Unrealistic Salary for No Qualifications: Promising thousands of dollars for simple labor without any interview, background verification, or skills assessment is extremely suspect.");
    scamPatternsDetected.push("vague_job");
  }
  if (redirectChat) {
    if (riskRating === 'LOW') riskRating = 'MEDIUM';
    redFlags.push("Communication Diverted to Unofficial Channels: Moving conversations exclusively to WhatsApp, Telegram, or personal emails instead of a licensed corporate domain or official office address is a red flag.");
    scamPatternsDetected.push("private_chat_redirection");
  }

  if (riskRating === 'HIGH') {
    explanation = "⚠️ This message has a SEVERE risk profile and is highly likely to be a migrant recruitment scam. We detected clear fraudulent patterns, particularly regarding upfront finances and/or risky visa pathways. Extreme caution is advised.";
  } else if (riskRating === 'MEDIUM') {
    explanation = "⚠️ This message shows several warnings or suspicious features typical of unverified recruitment advertisements. Proceed with caution and verify the agency license before sharing private documents.";
  } else {
    explanation = "✅ This message does not exhibit blatant scam keywords like immediate upfront fees or tourist visa conversions. However, you must still manually verify any recruiter's registration number and secure an embassy-verified contract.";
  }

  if (redFlags.length === 0) {
    redFlags.push("No explicit keywords detected, but caution is still required. Ensure the recruiter provides an official, verifiable registration number.");
  }

  return {
    riskRating,
    confidence,
    explanation,
    redFlags,
    actionSteps,
    scamPatternsDetected
  };
}

app.post("/api/analyze-scam", async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Missing text for analysis" });
  }

  const ai = getGeminiClient();
  if (!ai) {
    // Return high quality rule-based AI simulation
    const mockResponse = generateMockAIResponse(text);
    return res.json(mockResponse);
  }

  try {
    const prompt = `Analyze the following foreign job offer, WhatsApp forward, social media post, or recruiter text for potential recruitment scam red flags.
Look carefully for:
1. Demands for upfront payments (processing, visa, medical test, or registration fees).
2. Promises of high pay for zero skills/experience.
3. Suggesting to travel on a tourist/visit/visitor visa first and converting it to a work visa later (highly illegal/dangerous).
4. Forcing communications to informal or personal chats (WhatsApp/Telegram only).
5. Vague details, lack of physical corporate address or unverified agency license numbers.

Input text:
"${text}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert advisor in Media and Information Literacy (MIL) and anti-human trafficking. Your task is to critically analyze foreign employment job advertisements or recruiter chats to warn vulnerable youth and job seekers about scams. Speak in clear, empathetic, easily understandable plain language. Be direct and precise.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskRating: {
              type: Type.STRING,
              description: "The calculated risk assessment level: LOW, MEDIUM, or HIGH"
            },
            confidence: {
              type: Type.INTEGER,
              description: "Confidence percentage rating from 1 to 100"
            },
            explanation: {
              type: Type.STRING,
              description: "An empathetic, highly accessible explanation in plain language explaining why the message is a scam or warning signs to watch out for."
            },
            redFlags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Specific bullet points detailing each red flag found in the text (such as upfront payment request or tourist visa conversion)."
            },
            actionSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Clear, practical, actionable next steps the seeker should take to remain safe (such as refusing upfront fees, requesting contract, checking government records)."
            },
            scamPatternsDetected: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Keywords representing specific scam patterns found. Options: upfront_fees, vague_job, tourist_visa, private_chat_redirection, fake_agent"
            }
          },
          required: ["riskRating", "confidence", "explanation", "redFlags", "actionSteps", "scamPatternsDetected"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini");
    }

    const jsonResult = JSON.parse(resultText.trim());
    res.json(jsonResult);
  } catch (err) {
    console.error("Gemini API calling failed:", err);
    // Graceful fallback
    const mockResponse = generateMockAIResponse(text);
    res.json(mockResponse);
  }
});

// Setup Vite Dev Server / Static Assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
