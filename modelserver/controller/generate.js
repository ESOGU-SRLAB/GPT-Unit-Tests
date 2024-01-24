const dotenv = require('dotenv')
const OpenAI = require('openai')
const express = require("express")
const fs = require('fs')

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'],
});

async function sendQuery(
    kod,
    temperature,
    maxLenght,
    stopSequences,
    topP,
    frequencyPenalty,
    presencePenalty,
    modelSelection) {
    const SYSTEM_PROMPT =
        'GENERATE A PYTHON3 UNIT TEST FOR THE GIVEN FUNCTION OR THE METHODS OF THE GIVEN CLASS. USE "unittest" LIBRARY. THE RESPONSE MUST BE AN DIRECTLY EXECUTABLE PYTHON CODE ONLY WITHOUT ANY ADDITIONAL EXPLANATIONS OR COMMENTS. DO NOT INCLUDE \`\`\`python IN YOUR OUTPUT! INCLUDE THE GIVEN CODE IN YOUR OUTPUT CODE TOO, SO YOUR OUTPUT CAN BE EXECUTABLE WITHOUT MODIFICATIONS. DO NOT FORGET TO ADD THE __main__ TO RUN THE TEST CODES IN IT';

    const PROMPT =
        SYSTEM_PROMPT + kod;

    const chatCompletion = await openai.chat.completions.create({
        model: modelSelection,
        messages: [
            {
                role: 'system',
                content: SYSTEM_PROMPT,
            },
            {
                role: 'user',
                content: PROMPT,
            },
        ],
        max_tokens: maxLenght,
        temperature: temperature,
        top_p: topP,
        frequency_penalty: frequencyPenalty,
        presence_penalty: presencePenalty,
        stop: stopSequences
    });
    let total_tokens = chatCompletion.usage.total_tokens;
    fs.appendFile('./total_tokens.txt', total_tokens.toString() + '\n', (err) => { });
    return chatCompletion.choices[0].message.content;
}

async function Generate(req, res) {
    try {
        const { focalCode, modelSettings } = req.body
        let testFunction = await sendQuery(
            focalCode,
            parseFloat(modelSettings.temperature),
            parseInt(modelSettings.maxLength),
            modelSettings.stopSequences,
            parseFloat(modelSettings.topP),
            parseFloat(modelSettings.frequencyPenalty),
            parseFloat(modelSettings.presencePenalty),
            modelSettings.modelSelection).catch(console.error);

        const responseObject = {
            code: "200",
            testFunction,
        }
        console.log(responseObject);
        res.json(responseObject)
        
    } catch (error) {
        const catchErrorResponse = {
            code : "500"
        }
        console.log(error.message);

        res.json(catchErrorResponse)
    }

}

module.exports = {Generate}