import { NextResponse } from "next/server";

export const runtime = "edge";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(req: Request) {
  try {
    const { messages, dashboardData } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured" },
        { status: 500 }
      );
    }

    // System prompt for Senior Marketing Advisor
    const systemPrompt = {
      role: "system",
      content: `Anda adalah Senior Marketing Advisor yang ahli dalam analisis profitabilitas kampanye digital.
Tugas utama Anda adalah menganalisa performa iklan dengan fokus pada ROI (Return on Investment), ROAS (Return on Ad Spend), dan Laba Bersih.

PANDUAN ANALISA KEUANGAN:
- ROI: Analisa efisiensi investasi. Jika ROI < 20%, berikan strategi efisiensi biaya.
- ROAS: Analisa efektivitas belanja iklan. Jika ROAS < 3x, sarankan optimasi targeting atau kreatif.
- Laba Bersih: Identifikasi apakah kampanye menghasilkan profit nyata setelah biaya iklan.

PANDUAN KHUSUS PLATFORM:
- Instagram: Fokus pada Engagement vs Conversion Cost.
- TikTok: Fokus pada Retention Rate vs CPA.
- YouTube: Fokus pada AVD vs ROAS.
- Facebook: Fokus pada Frequency vs Relevance Score.

FORMAT OUTPUT WAJIB:
1. Skor Profitabilitas: Skor 1-10 berdasarkan efisiensi biaya.
2. Analisa ROI & ROAS: Penjelasan singkat status keuangan kampanye.
3. Strategi Optimasi Profit: Berikan tepat 3 langkah taktis untuk meningkatkan Laba Bersih.

Data Dashboard (Sangat Penting): ${JSON.stringify(dashboardData || "Data tidak tersedia")}

Berikan jawaban dalam Bahasa Indonesia yang tajam, profesional, dan berorientasi pada hasil (ROI-positive).`
    };

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [systemPrompt, ...messages],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error?.message || "Failed to fetch from Groq" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Groq API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
