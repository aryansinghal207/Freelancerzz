import { useState, useEffect, useRef } from 'react';
import { sendMessage, getMessages, markMessagesAsRead } from '../api';
import { useSocket } from '../SocketContext';
import { useAuth } from '../AuthContext';

export default function MessageModal({ clientId, clientName, _freelancerId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { socket } = useSocket();
  const auth = useAuth();

  useEffect(() => {
    loadMessages();
    markMessagesAsRead(clientId);

    if (socket) {
      const handleNewMessage = (data) => {
        // Only add message if it's from someone else (not from current user)
        const senderId = typeof data.senderId === 'object' ? data.senderId.id : data.senderId;
        if (data.clientId === clientId && senderId !== auth.user.id) {
          setMessages(prev => [...prev, data]);
          markMessagesAsRead(clientId);
        }
      };
      
      socket.on('new-message', handleNewMessage);
      
      return () => {
        socket.off('new-message', handleNewMessage);
      };
    }
  }, [clientId, socket, auth.user.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadMessages() {
    try {
      const data = await getMessages(clientId);
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;

    setLoading(true);
    try {
      const data = await sendMessage({
        clientId,
        message: newMessage.trim()
      });

      // Add message to local state
      setMessages(prev => [...prev, data]);
      setNewMessage('');

      // Emit via socket for real-time delivery to recipient
      if (socket && data.recipientUserId) {
        socket.emit('send-message', {
          ...data,
          clientId,
          recipientId: data.recipientUserId
        });
      }
    } catch (err) {
      alert('Failed to send message: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'var(--panel)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        width: '90%',
        maxWidth: 600,
        height: '80vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: 16,
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0 }}>💬 Chat with {clientName}</h3>
          <button onClick={onClose} className="secondary">✕</button>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>
              No messages yet. Start the conversation!
            </div>
          )}
          {messages.map((msg, idx) => {
            const isOwn = msg.senderId.id === auth.user.id || msg.senderId === auth.user.id;
            return (
              <div key={msg.id || idx} style={{
                display: 'flex',
                justifyContent: isOwn ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '70%',
                  padding: '10px 14px',
                  borderRadius: 12,
                  background: isOwn ? 'var(--brand)' : '#1f2937',
                  color: 'white'
                }}>
                  <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 4 }}>
                    {msg.senderId.name || msg.senderId.email} • {new Date(msg.createdAt).toLocaleTimeString()}
                  </div>
                  <div>{msg.message}</div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} style={{
          padding: 16,
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: 8
        }}>
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            style={{ flex: 1 }}
            disabled={loading}
          />
          <button type="submit" disabled={loading || !newMessage.trim()}>
            {loading ? '...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}
