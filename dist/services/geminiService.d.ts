export interface ChatResponse {
    response: string;
    extractedInfo?: {
        age?: number;
        income?: number;
        state?: string;
        occupation?: string;
        familySize?: number;
    };
    suggestedSchemes?: number[];
}
export declare const processUserQuery: (userQuery: string, language: string, conversationHistory: any[], availableSchemes: any[]) => Promise<ChatResponse>;
//# sourceMappingURL=geminiService.d.ts.map