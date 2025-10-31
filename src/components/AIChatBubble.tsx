import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SYSTEM_CONTEXT = 'Your system context here';

const AIChatBubble = () => {
  const [messages, setMessages] = useState([]);

  const callDigitalOceanAgent = async (userMessage) => {
    try {
      const agentEndpoint = import.meta.env.VITE_DO_AGENT_ENDPOINT;
      const agentAccessKey = import.meta.env.VITE_DO_AGENT_ACCESS_KEY;
      
      if (!agentEndpoint || !agentAccessKey) {
        console.error('Error: DigitalOcean Agent credentials not configured');
        setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: 'Lo siento, el servicio de chat no está disponible en este momento.' }]);
        return;
      }

      const response = await axios.post(`${agentEndpoint}/api/v1/chat/completions`, {
        messages: [{ role: 'user', content: userMessage }],
        stream: false,
        include_functions_info: false,
        include_retrieval_info: false,
        include_guardrails_info: false
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${agentAccessKey}`
        }
      });

      const agentMessage = response.data.choices[0].message.content;
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: agentMessage }]);
    } catch (error) {
      console.error('Error calling DigitalOcean Agent:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Error desconocido';
      console.error('Error details:', { status: error.response?.status, message: errorMessage });
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo más tarde.' }]);
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