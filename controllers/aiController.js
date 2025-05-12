const OpenAI = require('openai');

// You can set your OpenAI API key in the .env file as OPENAI_API_KEY
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

exports.suggestMessage = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name && !description) {
      return res.status(400).json({ message: 'Name or description required' });
    }
    const prompt = `Write a short, engaging marketing message for a campaign called "${name}". Description: ${description}`;
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful marketing assistant.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 60
    });
    const suggestion = completion.choices[0].message.content.trim();
    res.json({ suggestion });
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate suggestion', error: err.message });
  }
};

exports.parseSegmentRule = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ message: 'Prompt is required' });

    // If OpenAI is configured, use it; otherwise, mock a response
    let rule;
    if (openai) {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an expert CRM segment rule parser. Convert user prompts into logical JSON rules.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 200
      });
      // Expecting a JSON object in the response
      rule = completion.choices[0].message.content;
      try {
        rule = JSON.parse(rule);
      } catch {
        // If not valid JSON, return as string
      }
    } else {
      // Mocked response for demo
      rule = {
        and: [
          { lastPurchase: { $lt: '6 months ago' } },
          { totalSpent: { $gt: 10000 } }
        ]
      };
    }
    res.json({ rule });
  } catch (err) {
    res.status(500).json({ message: 'AI parsing error', error: err.message });
  }
}; 