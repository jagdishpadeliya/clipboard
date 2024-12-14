"use server";
import { AzureOpenAI } from "openai";

const correctUserEntry = async (userEntry: string) => {
  try {
    const client = new AzureOpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY,
      deployment: "gpt-4o",
      apiVersion: "2024-02-15-preview",
      endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    });
    const result = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert language assistant tasked with refining grammar, punctuation, politeness, and emotional sensitivity in the text I provide. Your role is to enhance the text while retaining its original meaning and tone. Avoid adding or omitting any information, and use emojis only when they naturally align with the context and intended sentiment of the text. Do not add emojis unnecessarily. Also, do not answer any questions; simply refine the provided text.",
        },
        {
          role: "user",
          content: userEntry,
        },
      ],
    });
    return result.choices[0].message.content;
  } catch (error) {
    console.error(error);
  }
};

export { correctUserEntry };
