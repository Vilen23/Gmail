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

  //   const prompt = emails
  //     .map((email, index) => `Email ${index + 1}: ${email}`)
  //     .join("\n\n");
  //   const fullPrompt = `Classify the following emails into one of these categories: important, promotional, social, marketing, spam.\n\n${prompt}\n\nCategories:`;

  //   const request = await model.generateContent(prompt);
  //   const response = await request.response;
  //     console.log(response);
  //     const data = JSON.parse(response.content);
  //   const result = data.choices[0].text
  //     .trim()
  //     .split("\n")
  //     .map((line: string) => line.split(": ")[1]);
  const jsonSchema = {
    title: "Current population of Kyoto, Osaka, Aichi, Fukuoka, Tokyo in Japan",
    description:
      "Return the current population of Kyoto, Osaka, Aichi, Fukuoka, Tokyo in Japan",
    type: "object",
    properties: {
      propertyNames: { description: "Prefecture names" },
      patternProperties: { "": { type: "number", description: "Population" } },
    },
  };
  const prompt = `Follow JSON schema.<JSONSchema>${JSON.stringify(
    jsonSchema
  )}</JSONSchema>`;
  const result = await model.generateContent(prompt);
  const text = await result.response.text();
  console.log(text);
  return text;
};
