import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("YOUR_NEW_API_KEY_HERE");


async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Say Hello Gemini!");
    console.log(result.response.text());
  } catch (err) {
    console.error("Gemini API Test Error:", err);
  }
}

test();
