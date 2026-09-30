"use server";

// This file contains modern Next.js Server Actions.
// These functions run exclusively on the server, eliminating the need for traditional API routes.

export async function saveTestResult(stateCode: string, score: number, total: number) {
  try {
    // Here we will soon use Prisma to save the session to the PostgreSQL database.
    // For now, we securely log it on the server to demonstrate the Server Action flow.
    console.log(`✅ [SERVER ACTION] Test completed for ${stateCode}. Score: ${score}/${total}`);
    
    // We can run heavy backend logic here (AI analysis, DB writes) without exposing it to the browser.
    
    return { success: true, timestamp: new Date().toISOString() };
  } catch (error) {
    console.error("Failed to save test result:", error);
    return { success: false, error: "Failed to save results" };
  }
}