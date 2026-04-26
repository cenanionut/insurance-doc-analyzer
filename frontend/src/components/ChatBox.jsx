import { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/api';

const ChatBox = ({ conversationId }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        const question = input.trim();
        if (!question || isLoading) return;

        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: question }]);
        setIsLoading(true);

        try {
            const { answer } = await sendChatMessage(conversationId, question);
            setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
        } catch (err) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: '❌ Failed to get a response. Please try again.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '480px' }}>

            {/* Messages */}
            <div style={{
                flex: 1, overflowY: 'auto', padding: '16px',
                display: 'flex', flexDirection: 'column', gap: '12px',
                background: '#f8f9fa', borderRadius: '8px', marginBottom: '12px'
            }}>
                {messages.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#aaa', marginTop: '80px', fontSize: '14px' }}>
                        <div style={{ fontSize: '32px', marginBottom: '8px' }}>💬</div>
                        Ask anything about the document...
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div key={i} style={{
                        display: 'flex',
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    }}>
                        <div style={{
                            maxWidth: '75%',
                            padding: '10px 14px',
                            borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                            background: msg.role === 'user' ? '#2c6fad' : 'white',
                            color: msg.role === 'user' ? 'white' : '#333',
                            fontSize: '13.5px',
                            lineHeight: '1.6',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                            whiteSpace: 'pre-wrap',
                        }}>
                            {msg.content}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <div style={{
                            padding: '10px 16px', background: 'white', borderRadius: '12px 12px 12px 2px',
                            fontSize: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                        }}>
                            ⏳
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ display: 'flex', gap: '8px' }}>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a question about the document... (Enter to send)"
                    disabled={isLoading}
                    rows={2}
                    style={{
                        flex: 1, padding: '10px 14px', borderRadius: '8px',
                        border: '1px solid #ddd', fontSize: '13.5px',
                        resize: 'none', fontFamily: 'inherit',
                        outline: 'none', lineHeight: '1.5',
                    }}
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    style={{
                        padding: '0 20px', borderRadius: '8px', border: 'none',
                        background: isLoading || !input.trim() ? '#ccc' : '#2c6fad',
                        color: 'white', fontWeight: '700', fontSize: '14px',
                        cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                        transition: 'background 0.2s',
                    }}
                >
                    Send
                </button>
            </div>

        </div>
    );
};

export default ChatBox;