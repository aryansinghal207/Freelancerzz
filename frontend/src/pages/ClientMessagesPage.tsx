import { useEffect, useState } from 'react';
import { getClientInfo, getMessages, sendMessage, markMessagesAsRead } from '../api';
import { useSocket } from '../SocketContext';
import { useAuth } from '../AuthContext';

export default function ClientMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [clientInfo, setClientInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const { socket } = useSocket();
  const auth = useAuth();

  useEffect(() => {
    loadClientInfo();
  }, []);

  useEffect(() => {
    if (clientInfo) {
      loadMessages();
      markMessagesAsRead(clientInfo.id);

      if (socket) {
        const handleNewMessage = (data) => {
          const senderId = typeof data.senderId === 'object' ? data.senderId.id : data.senderId;
          if (data.clientId === clientInfo.id && senderId !== auth.user.id) {
            setMessages(prev => [...prev, data]);
            markMessagesAsRead(clientInfo.id);
          }
        };
        
        socket.on('new-message', handleNewMessage);
        
        return () => {
          socket.off('new-message', handleNewMessage);
        };
      }
    }
  }, [clientInfo, socket, auth.user.id]);

  async function loadClientInfo() {
    try {
      const data = await getClientInfo();
      setClientInfo(data);
    } catch (err) {
      console.error('Failed to load client info:', err);
    }
  }

  async function loadMessages() {
    if (!clientInfo) return;
    try {
      const data = await getMessages(clientInfo.id);
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!newMessage.trim() || loading || !clientInfo) return;

    setLoading(true);
    try {
      const data = await sendMessage({
        clientId: clientInfo.id,
        message: newMessage.trim()
      });

      setMessages(prev => [...prev, data]);
      setNewMessage('');

      // Emit via socket
      if (socket && data.recipientUserId) {
        socket.emit('send-message', {
          ...data,
          clientId: clientInfo.id,
          recipientId: data.recipientUserId
        });
      }
    } catch (err) {
      alert('Failed to send message: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }

  if (!clientInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>💬 Messages with Your Freelancer</h2>
      
      <div style={{
        background: 'var(--panel)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        height: '70vh',
        display: 'flex',
        flexDirection: 'column',
        marginTop: 16
      }}>
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
              No messages yet. Start the conversation with your freelancer!
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
