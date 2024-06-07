import { GoogleGenerativeAI } from "@google/generative-ai";
export const handleClassification = async (
  emails: string[],
  apiKey: string
): Promise<string> => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro-latest",
    generationConfig: { responseMimeType: "application/json" },
  });

    const prompt = emails
      .map((email, index) => `Email ${index + 1}: ${email}`)
      .join("\n\n");
    const fullPrompt = `Classify the following emails into one of these categories: important, promotional, social, marketing, spam.\n\n${prompt}\n\nCategories:`;

  const result = await model.generateContent(fullPrompt);
  const text = await result.response.text();
  return text;
};
