const express = require('express');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const { generateInterviewQuestion, giveFeedback } = require('./gpt');
require('dotenv').config();

const app = express();
const PORT = 4000;

app.use(cors({
  origin: 'http://localhost:3000', // 프론트엔드 주소
  credentials: true
}));
app.use(express.json());

app.post('/upload-resume', async (req, res) => {
  const { resumeText } = req.body;

  res.json({ message: 'Resume received' });
});

// 서버 + WebSocket
const server = app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', async (message) => {
    const data = JSON.parse(message.toString());

    if (data.type === 'ask-question') {
      const question = await generateInterviewQuestion(data.resumeText);
      ws.send(JSON.stringify({ type: 'question', text: question }));
    }

    if (data.type === 'user-answer') {
      const feedback = await giveFeedback(data.answerText);
      ws.send(JSON.stringify({ type: 'feedback', text: feedback }));
    }
  });
});
