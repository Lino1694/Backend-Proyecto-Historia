const express = require('express');
const ollamaService = require('../services/OllamaService');

const router = express.Router();

// Route to chat with Ollama models
router.post('/chat', async (req, res) => {
  try {
    const { character, prompt } = req.body;

    if (!character || !prompt) {
      return res.status(400).json({ error: 'Character and prompt are required' });
    }

    // Validate character
    const allowedCharacters = ['inka', 'viceroyalty', 'caral', 'conquistador', 'independencia', 'republica'];
    if (!allowedCharacters.includes(character)) {
      return res.status(400).json({ error: 'Invalid character. Allowed: inka, viceroyalty, caral, conquistador, independencia, republica' });
    }

    const response = await ollamaService.generateResponse(character, prompt);

    res.json({
      character: character,
      response: response
    });
  } catch (error) {
    console.error('Ollama chat error:', error);
    res.status(500).json({ error: 'Error communicating with Ollama' });
  }
});

// Route to generate lessons
router.post('/lesson', async (req, res) => {
  try {
    const { character, topic, progress, userLevel } = req.body;

    const lesson = await ollamaService.generateLesson(character, topic, progress, userLevel);

    res.json({
      lesson: lesson
    });
  } catch (error) {
    console.error('Ollama lesson error:', error);
    res.status(500).json({ error: 'Error generating lesson with Ollama' });
  }
});

// Route to generate challenges
router.post('/challenge', async (req, res) => {
  try {
    const { character, topic, numQuestions, difficulty } = req.body;

    if (!character || !topic || !numQuestions || !difficulty) {
      return res.status(400).json({ error: 'Character, topic, numQuestions, and difficulty are required' });
    }

    const challenge = await ollamaService.generateChallenge(character, topic, numQuestions, difficulty);

    res.json({
      challenge: challenge
    });
  } catch (error) {
    console.error('Ollama challenge error:', error);
    res.status(500).json({ error: 'Error generating challenge with Ollama' });
  }
});

module.exports = router;