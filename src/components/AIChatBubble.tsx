import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SYSTEM_CONTEXT = 'Your system context here';

const AIChatBubble = () => {
  const [messages, setMessages] = useState([]);

  const callDigitalOceanAgent = async (userMessage) => {
    try {
      const response = await axios.post(`${process.env.VITE_DO_AGENT_ENDPOINT}/chat/completions`, {
        messages: [{ role: 'user', content: userMessage }],
        system_context: SYSTEM_CONTEXT
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.VITE_DO_AGENT_ACCESS_KEY}`
        }
      });

      const agentMessage = response.data.choices[0].message.content;
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: agentMessage }]);
    } catch (error) {
      console.error('Error communicating with DigitalOcean Agent:', error);
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: 'Error communicating with DigitalOcean Agent.' }]);
    }
  };

  // Other existing functionality...

  return (
    <div>
      {/* UI components rendering messages */}
    </div>
  );
};

export default AIChatBubble;