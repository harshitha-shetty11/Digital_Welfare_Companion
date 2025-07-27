import React, { useEffect, useRef } from 'react';
import { Message } from '../types';

interface ConversationDisplayProps {
  messages: Message[];
  isLoading?: boolean;
  className?: string;
}

const ConversationDisplay: React.FC<ConversationDisplayProps> = ({
  messages,
  isLoading = false,
  className = ''
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp);
  };

  return (
    <div className={`conversation-display ${className}`}>
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <div className="welcome-icon">🤝</div>
            <h2>Welcome to Digital Welfare Companion</h2>
            <p>
              I'm here to help you find government welfare schemes and benefits.
              You can ask me questions in your preferred language!
            </p>
            <div className="example-questions">
              <h3>Try asking:</h3>
              <ul>
                <li>"What schemes are available for farmers?"</li>
                <li>"How can I apply for a scholarship?"</li>
                <li>"Show me health insurance schemes"</li>
              </ul>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender === 'user' ? 'user-message' : 'assistant-message'}`}
            >
              <div className="message-avatar">
                {message.sender === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-content">
                <div className="message-text">{message.text}</div>
                <div className="message-time">
                  {formatTime(message.timestamp)}
                  {message.language && message.language !== 'en' && (
                    <span className="message-language">
                      • {message.language.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="message assistant-message">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export { ConversationDisplay };
export default ConversationDisplay;
