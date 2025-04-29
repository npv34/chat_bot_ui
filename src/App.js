import React, { useState } from 'react';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [question, setQuestion] = useState("");

  const sender_id = "client123"; // giả lập ID người dùng

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // Thêm tin nhắn người dùng
    const userMessage = {
      message: text,
      sender: 'user',
      direction: 'outgoing',
      position: 'single',
    };
    setMessages(prev => [...prev, userMessage]);
    setQuestion("");
    setIsTyping(true); // 🔥 Bắt đầu typing

    try {
      const res = await axios.post("https://13.229.223.125/api/message", {
        sender_id,
        question: text,
      });

      // Giả lập typing delay nhỏ (option)
      setTimeout(() => {
        const botMessage = {
          message: res.data.answer,
          sender: 'bot',
          direction: 'incoming',
          position: 'single',
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false); // 🔥 Dừng typing
      }, 1000); // ví dụ delay thêm 1s
    } catch (err) {
      console.error("Error:", err);
      setIsTyping(false);
    }
  };

  return (
      <div style={{ position: "relative", height: "100vh" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
                typingIndicator={isTyping ? <TypingIndicator content="Bot đang trả lời..." /> : null}
            >
              {messages.map((msg, idx) => (
                  <Message
                      key={idx}
                      model={{
                        message: msg.message,
                        sentTime: "just now",
                        sender: msg.sender,
                        direction: msg.direction,
                        position: msg.position,
                      }}
                  />
              ))}
            </MessageList>

            <MessageInput
                placeholder="Nhập câu hỏi..."
                value={question}
                onChange={(val) => setQuestion(val)}
                onSend={() => sendMessage(question)}
            />
          </ChatContainer>
        </MainContainer>
      </div>
  );
}

export default App;
