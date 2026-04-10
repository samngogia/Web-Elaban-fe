import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Cần thêm cái này để chuyển trang

// --- ĐỊNH NGHĨA KIỂU DỮ LIỆU ---
interface Button {
  title: string;
  payload: string;
}

interface Message {
  sender: 'user' | 'bot';
  text: string;
  buttons?: Button[]; // 2. Thêm để nhận danh sách nút từ Rasa
}

const Chatbot: React.FC = () => {
  const navigate = useNavigate(); // Hook để điều hướng
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Xin chào! Trợ lý ảo ElaBan có thể giúp gì cho bạn?' }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // --- HÀM XỬ LÝ KHI BẤM NÚT ---
  const handleButtonClick = (payload: string) => {
    // Nếu payload là một đường dẫn sản phẩm (ví dụ /product/112)
    if (payload.startsWith('/product/')) {
      navigate(payload);
      setIsOpen(false); // Đóng chat sau khi chuyển trang
    } else {
      // Nếu là các payload khác thì gửi như một tin nhắn
      setInput(payload);
      // Bạn có thể gọi trực tiếp hàm gửi tin nhắn ở đây
    }
  };

  // --- HÀM GỬI TIN NHẮN ---
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput('');

    try {
      const response = await fetch("http://localhost:5005/webhooks/rest/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: "user_react", message: currentInput }),
      });

      const data = await response.json();

      if (data && data.length > 0) {
        data.forEach((res: any) => {
          // 3. Cập nhật để lưu cả text và buttons
          setMessages((prev) => [
            ...prev, 
            { 
              sender: 'bot', 
              text: res.text, 
              buttons: res.buttons // Lưu buttons vào state
            }
          ]);
        });
      } else {
        setMessages((prev) => [...prev, { sender: 'bot', text: "Xin lỗi, tôi chưa hiểu ý bạn." }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { sender: 'bot', text: "Lỗi kết nối đến máy chủ Rasa!" }]);
    }
  };

  // --- GIAO DIỆN (GIỮ NGUYÊN STYLES CŨ VÀ THÊM STYLE CHO BUTTON) ---
  const styles: { [key: string]: React.CSSProperties } = {
    // ... (Các style cũ bạn giữ nguyên nhé)
    widgetButton: { position: 'fixed', bottom: '20px', right: '20px', width: '60px', height: '60px', backgroundColor: '#2c3e50', color: 'white', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', zIndex: 1000 },
    chatWindow: { position: 'fixed', bottom: '90px', right: '20px', width: '350px', height: '500px', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 5px 25px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 1000 },
    header: { backgroundColor: '#2c3e50', color: 'white', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' },
    body: { flex: 1, padding: '15px', overflowY: 'auto', backgroundColor: '#f4f7f6', display: 'flex', flexDirection: 'column', gap: '10px' },
    msgUser: { alignSelf: 'flex-end', backgroundColor: '#3498db', color: 'white', padding: '8px 12px', borderRadius: '15px 15px 0 15px', maxWidth: '80%', fontSize: '14px' },
    msgBot: { alignSelf: 'flex-start', backgroundColor: '#e9ecef', color: '#333', padding: '8px 12px', borderRadius: '15px 15px 15px 0', maxWidth: '80%', fontSize: '14px' },
    footer: { display: 'flex', padding: '10px', borderTop: '1px solid #eee' },
    input: { flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '20px', outline: 'none' },
    sendBtn: { marginLeft: '10px', border: 'none', backgroundColor: '#3498db', color: 'white', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer' },
    // Style cho nút bấm của Bot
    inlineBtn: {
      padding: '5px 12px', marginTop: '5px', borderRadius: '15px', border: '1px solid #3498db',
      backgroundColor: 'white', color: '#3498db', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold'
    }
  };

  return (
    <>
      {!isOpen ? (
        <div style={styles.widgetButton} onClick={() => setIsOpen(true)}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </div>
      ) : (
        <div style={styles.chatWindow}>
          <div style={styles.header}>
            <span>ElaBan Chat</span>
            <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px' }} onClick={() => setIsOpen(false)}>×</button>
          </div>
          <div style={styles.body}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={msg.sender === 'user' ? styles.msgUser : styles.msgBot}>
                  {msg.text}
                </div>
                {/* 4. Hiển thị nút bấm nếu có */}
                {msg.buttons && (
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '5px' }}>
                    {msg.buttons.map((btn, idx) => (
                      <button 
                        key={idx} 
                        style={styles.inlineBtn}
                        onClick={() => handleButtonClick(btn.payload)}
                      >
                        {btn.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div style={styles.footer}>
            <input
              style={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Hỏi về Sofa..."
            />
            <button style={styles.sendBtn} onClick={handleSendMessage}>➤</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;