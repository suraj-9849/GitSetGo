const Groq = require("groq-sdk");
require("dotenv").config();
const groq = new Groq({ apiKey: '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' });
async function askgroq(data) {
    let prompt = `given below is the description of the symptoms i have , classify under what design it falls under and tell which doctor is has analyse ${data}.give a json of only two elements , desease and a doctor category`;
    let response = "";
    try {
    const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama3-70b-8192",
        //"model": "gemma2-9b-it",
        //"model": "mixtral-8x7b-32768",
        //"model": "llama3-groq-70b-8192-tool-use-preview",
        temperature: 0,
        max_tokens: 8192,
        top_p: 1,
        stream: true,
        stop: null,
    });

    for await (const chunk of chatCompletion) {
        response += chunk.choices[0]?.delta?.content || "";
    }
    console.log("Complete Response:", response);
    const match = response.match(/```([^`]*)```/);
    if (match) {
        const respObj = JSON.parse(match[1]);
      console.log(respObj);
      return respObj
    } else {
      console.error("JSON block not found in response.");
    }
    } catch (error) {
        console.error("Error generating HTML:", error);
    }
}

module.exports = askgroq;