// backend.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
}));

// Initialize the Google Generative AI client
const client = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Skill Tagging Endpoint
app.post('/api/skill-tagging', async (req, res) => {
    const { resumeText } = req.body;

    if (!resumeText) {
        return res.status(400).json({ error: 'Resume text is required' });
    }

    try {
        const model = client.getGenerativeModel({ model: 'gemini-pro' });
        const content = await model.generateContent(`Tag skills from the following resume: ${resumeText}`);
        const response = await content.response;

        const skills = response?.candidates[0]?.content?.parts[0]?.text;

        res.json({ skills });
    } catch (error) {
        console.error('Error in Skill Tagging:', error);
        res.status(500).json({ error: 'Error processing request' });
    }
});

// Sentiment Analysis Endpoint
app.post('/api/sentiment-analysis', async (req, res) => {
    const { transcript } = req.body; // Ensure this matches your frontend request structure

    if (!transcript) {
        return res.status(400).json({ error: 'Transcript is required' });
    }

    try {
        // Perform sentiment analysis logic here
        const sentiment = 'positive'; // Replace this with actual sentiment analysis logic
        res.json({ sentiment });
    } catch (error) {
        console.error('Error in Sentiment Analysis:', error);
        res.status(500).json({ error: 'Error processing request' });
    }
});

// Chatbot Endpoint
app.post('/api/chat', async (req, res) => {
    const { userMessage } = req.body;

    if (!userMessage) {
        return res.status(400).json({ error: 'User message is required' });
    }

    try {
        const model = client.getGenerativeModel({ model: 'gemini-pro' });
        const content = await model.generateContent(`User says: ${userMessage}`);
        const response = await content.response;

        const botResponse = response?.candidates[0]?.content?.parts[0]?.text || 'Sorry, I did not understand that.';
        res.json({ botResponse });
    } catch (error) {
        console.error('Error in Chatbot:', error);
        res.status(500).json({ error: 'Error processing request' });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
