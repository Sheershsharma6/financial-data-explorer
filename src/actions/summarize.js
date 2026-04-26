'use server';

export async function summarizeFinancials(data) {
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  if (!API_KEY) {
    console.error("Gemini API key not configured");
    return "AI configuration incomplete.";
  }

  if (!data || !data.entityName || !data.facts) {
    console.error("Invalid data structure for summarizeFinancials:", data);
    return "AI summary data invalid.";
  }

  const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  try {
    const prompt = `Analyze these financial facts for ${data.entityName}. 
Assets data: ${JSON.stringify(data.facts.Assets)}
Revenues data: ${JSON.stringify(data.facts.Revenues)}
Provide a concise 2-sentence executive summary highlighting key trends.`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    const result = await response.json();

    // Log response structure for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log("Gemini response status:", response.status);
      console.log("Gemini response structure:", result);
    }

    // Handle API errors
    if (!response.ok || result.error) {
      console.error("Gemini API error:", result.error?.message || response.statusText);
      return `AI service error: ${result.error?.message || 'Unknown error'}`;
    }

    // Extract text from response
    if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
      return result.candidates[0].content.parts[0].text;
    }

    return "AI summary unavailable: unexpected response format.";
  } catch (error) {
    console.error("Server Action fetch error:", error.message);
    return "Unable to generate AI summary at this time.";
  }
}