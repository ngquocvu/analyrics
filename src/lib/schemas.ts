import { z } from "zod";

/**
 * Zod schema for individual analysis sections
 */
export const analysisSectionSchema = z.object({
    section: z.string().describe("Tên đoạn - PHẢI dùng format chuẩn: Intro, Verse 1, Verse 2, Pre-Chorus, Chorus, Post-Chorus, Bridge, Outro, hoặc Hook"),
    lyricsQuote: z.string().describe("Nếu đoạn ngắn (dưới 10 câu): trích dẫn TOÀN BỘ lời của đoạn. Nếu đoạn dài: trích 3-4 câu QUAN TRỌNG NHẤT làm đại diện"),
    content: z.string().describe("Phân tích ý nghĩa đoạn này")
});

/**
 * Zod schema for metaphors/slang explanations
 */
export const metaphorSchema = z.object({
    phrase: z.string().describe("Câu hát/Từ ngữ ẩn dụ đắt giá"),
    meaning: z.string().describe("Giải nghĩa slang/ẩn dụ đó")
});

/**
 * Complete Zod schema for lyrics analysis result
 * This matches the AnalysisResult TypeScript interface
 */
export const analysisResultSchema = z.object({
    fullLyrics: z.string().optional().describe("TOÀN BỘ lời bài hát đầy đủ, chính xác từ nguồn web. Giữ nguyên format, xuống dòng, và cấu trúc như trên web."),
    vibe: z.string().describe("1 câu ngắn gọn về vibe/cảm xúc chủ đạo (ví dụ: Suy, Chữa lành, Flex...)"),
    overview: z.string().describe("Tóm tắt ngắn gọn nội dung bài hát (khoảng 2-3 câu)"),
    analysis: z.array(analysisSectionSchema).describe("Phân tích chi tiết từng đoạn của bài hát"),
    metaphors: z.array(metaphorSchema).describe("Các ẩn dụ, slang, và từ ngữ đặc biệt trong bài hát"),
    coreMessage: z.string().describe("Thông điệp cốt lõi ngắn gọn")
});

/**
 * TypeScript type inferred from Zod schema
 * This ensures the Zod schema and TypeScript type are always in sync
 */
export type AnalysisResult = z.infer<typeof analysisResultSchema>;
