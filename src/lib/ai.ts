import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GOOGLE_API_KEY || "";

export interface AnalysisResult {
    fullLyrics?: string;
    vibe: string;
    overview: string;
    analysis: Array<{ section: string; lyricsQuote: string; content: string }>;
    metaphors: Array<{ phrase: string; meaning: string }>;
    coreMessage: string;
}

export const generateMeaning = async (songTitle: string, artist: string): Promise<AnalysisResult | null> => {
    if (!apiKey) {
        console.error("API Key missing");
        return null;
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
    Nhiệm vụ: Phân tích bài hát "${songTitle}" của "${artist}"
    
    BƯỚC 1 - TÌM VÀ ĐỌC TOÀN BỘ LỜI BÀI HÁT:
    1. Sử dụng công cụ Google Search để tìm lời bài hát CHÍNH THỨC của bài này
    2. Tìm trên các nguồn uy tín: Genius.com, AZLyrics, hoặc các trang lời bài hát khác
    3. Sau khi tìm được link, sử dụng URL Context tool để đọc TOÀN BỘ lời bài hát từ trang web
    4. QUAN TRỌNG: Phải sao chép CHÍNH XÁC toàn bộ lời bài hát từ nguồn, không được tự bịa hoặc thay đổi
    
    BƯỚC 2 - PHÂN TÍCH:
    Sau khi đã đọc được lời bài hát chính xác từ trang web, hãy đóng vai trò là một nhà phê bình âm nhạc am hiểu văn hóa Gen Z và phân tích bài hát.
    
    YÊU CẦU BẮT BUỘC:
    - PHẢI tìm kiếm và đọc lời bài hát từ web trước khi phân tích
    - PHẢI sao chép CHÍNH XÁC toàn bộ lời bài hát vào trường "fullLyrics"
    - Chỉ phân tích dựa trên lời bài hát thực sự đọc được từ trang web
    - KHÔNG ĐƯỢC tự bịa hoặc đoán lời bài hát
    - Nếu không tìm được lời bài hát, trả về null cho fullLyrics
    
    YÊU CẦU VỀ FORMAT TRẢ VỀ:
    - PHẢI trả về JSON thuần túy, KHÔNG được bọc trong markdown code blocks
    - KHÔNG thêm bất kỳ text nào trước hoặc sau JSON
    - Đảm bảo JSON hợp lệ và có thể parse được ngay
    - Tất cả các trường đều phải ngắn gọn, súc tích, đi thẳng vào vấn đề
    
    Cấu trúc JSON:
    {
      "fullLyrics": "TOÀN BỘ lời bài hát đầy đủ, chính xác từ nguồn web. Giữ nguyên format, xuống dòng, và cấu trúc như trên web.",
      "vibe": "1 câu NGẮN GỌN về vibe/cảm xúc chủ đạo (tối đa 3-5 từ, ví dụ: Suy, Chữa lành, Flex...)",
      "overview": "Tóm tắt NGẮN GỌN nội dung bài hát (1-2 câu ngắn, tối đa 150 từ).",
      "analysis": [
        { 
          "section": "Tên đoạn - PHẢI dùng format chuẩn: Intro, Verse 1, Verse 2, Pre-Chorus, Chorus, Post-Chorus, Bridge, Outro, hoặc Hook", 
          "lyricsQuote": "Nếu đoạn ngắn (dưới 7 câu): trích dẫn TOÀN BỘ lời của đoạn. Nếu đoạn dài: trích 3-4 câu QUAN TRỌNG NHẤT làm đại diện",
          "content": "Phân tích ý nghĩa đoạn này (NGẮN GỌN, 2-3 câu, đi thẳng vào ý chính)." 
        }
      ],
      "metaphors": [
        { "phrase": "Câu hát/Từ ngữ ẩn dụ đắt giá", "meaning": "Giải nghĩa slang/ẩn dụ đó (NGẮN GỌN, 1-2 câu)." }
      ],
      "coreMessage": "Thông điệp cốt lõi NGẮN GỌN (1 câu duy nhất, tối đa 100 từ)."
    }

    YÊU CẦU QUAN TRỌNG VỀ TÊN ĐOẠN (section):
    - PHẢI sử dụng tên chuẩn theo cấu trúc bài hát: Intro, Verse 1, Verse 2, Verse 3, Pre-Chorus, Chorus, Post-Chorus, Bridge, Outro, Hook
    - Đánh số các Verse theo thứ tự: Verse 1, Verse 2, Verse 3...
    - Nếu có nhiều Chorus giống nhau, có thể ghi "Chorus" hoặc "Chorus (lặp lại)"
    - KHÔNG được tự đặt tên tùy ý như "Đoạn 1", "Phần mở đầu", v.v.
    - Giữ tên tiếng Anh để thống nhất giữa các bài

    YÊU CẦU VỀ ĐỘ DÀI:
    - Mọi phân tích phải NGẮN GỌN, SÚC TÍCH
    - Đi thẳng vào vấn đề, không dài dòng
    - Mỗi phần content trong analysis: 2-3 câu
    - Mỗi meaning trong metaphors: 1-2 câu
    - coreMessage: 1 câu duy nhất

    Giọng văn: Khách quan, sâu sắc, hiện đại, ngôn ngữ Gen Z Việt Nam, NGẮN GỌN.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [prompt],
            config: {
                tools: [{ urlContext: {} }, { googleSearch: {} }],
            },
        });

        if (!response || !response.text) {
            console.error("Empty response from Gemini API");
            console.log("Full response:", JSON.stringify(response, null, 2));
            return null;
        }

        const textResponse = response.text;

        // Log URL context metadata if available
        if (response.candidates?.[0]?.urlContextMetadata) {
            console.log("URL Context Retrieved:", JSON.stringify(response.candidates[0].urlContextMetadata, null, 2));
        }

        // Log search grounding metadata if available
        if (response.candidates?.[0]?.groundingMetadata) {
            console.log("Search Grounding Used:", JSON.stringify(response.candidates[0].groundingMetadata, null, 2));
        }

        // Clean up potential markdown code blocks if AI adds them
        const cleanJson = textResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();

        try {
            return JSON.parse(cleanJson);
        } catch (parseError) {
            console.error("JSON Parse Error. Raw Text:", textResponse);
            console.error("Cleaned Text:", cleanJson);
            return null;
        }

    } catch (error) {
        console.error("AI Generation Error:", error);
        return null;
    }
};
