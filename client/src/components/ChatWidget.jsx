import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Sparkles, RefreshCcw } from 'lucide-react';

const QUICK_REPLIES = [
  'What services do you offer?',
  'How much does SEO cost?',
  'I need a new website',
  'Tell me about PPC Ads',
];

const WELCOME_MESSAGE = {
  text: "👋 Hi there! I'm **TechBot**, your AI guide at **Tech Digi**.\n\nI can help you with SEO, Social Media, Web Design, PPC, and more. How can I help you grow today?",
  sender: 'bot'
};

function parseMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('techbot_history');
    return saved ? JSON.parse(saved) : [WELCOME_MESSAGE];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef(null);
  const chatRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    localStorage.setItem('techbot_history', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Lock background scroll when chatbot is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.setProperty('overflow', 'hidden', 'important');
      document.documentElement.style.setProperty('overflow', 'hidden', 'important');
      if (window.lenis) window.lenis.stop();
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (window.lenis) window.lenis.start();
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (window.lenis) window.lenis.start();
    };
  }, [isOpen]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = { text, sender: 'user', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);
    setShowQuickReplies(false);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          // Gemini API requires history to start with 'user'. Filter out leading bot messages.
          history: messages.filter(m => m.sender !== 'system').filter((m, idx, arr) => {
            // Only include if we have seen at least one user message
            const firstUserIdx = arr.findIndex(msg => msg.sender === 'user');
            return firstUserIdx !== -1 && idx >= firstUserIdx;
          })
        })
      });

      const data = await response.json();

      if (!response.ok || !data.reply) {
        throw new Error(data.error || 'Invalid API response');
      }

      const botMessage = {
        text: data.reply,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);

      if (text.includes('@') && text.includes('.')) {
        setTimeout(async () => {
          try {
            // Auto-capture the lead from chat
            const extractName = messages.find(m => m.sender === 'user' && !m.text.includes('@'))?.text.split(' ')[0] || 'Chat User';
            await fetch('/api/leads', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: extractName,
                email: text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi)?.[0] || text,
                service: 'AI Chat Inquiry',
                message: messages.map(m => m.text).join(' | ')
              })
            });

            setMessages(prev => [...prev, {
              text: "✅ Awesome! I've saved your details. Our expert team will reach out to your email shortly.",
              sender: 'bot',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
          } catch (err) {
            console.error("Failed to auto-capture lead", err);
          }
        }, 1200);
      }

    } catch (error) {
      setMessages(prev => [...prev, { text: 'Sorry, I am having trouble connecting. Please try again!', sender: 'bot' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const scrollToContact = () => {
    setIsOpen(false);
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const clearHistory = () => {
    localStorage.removeItem('techbot_history');
    setMessages([WELCOME_MESSAGE]);
    setShowQuickReplies(true);
  };

  return (
    <div ref={chatRef} className="fixed bottom-[115px] right-4 sm:bottom-[125px] sm:right-5 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="absolute bottom-14 sm:bottom-16 right-0 w-[calc(100vw-32px)] sm:w-[355px] max-w-[355px] max-h-[calc(100vh-180px)] sm:max-h-[calc(100vh-200px)] bg-slate-900 rounded-2xl flex flex-col overflow-hidden border border-slate-700/50 shadow-[0_8px_40px_rgba(99,102,241,0.22)]"
          >
            {/* Ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-indigo-500/15 rounded-full blur-[50px] pointer-events-none"></div>

            {/* ── Header ── */}
            <div className="relative z-10 px-4 py-3 flex justify-between items-center bg-gradient-to-br from-indigo-600/15 via-slate-900 to-purple-600/10 border-b border-slate-800/70">
              <div className="flex items-center gap-2.5">
                {/* Avatar ring */}
                <div className="relative">
                  <div className="w-9 h-9 rounded-full p-[1.5px] bg-gradient-to-br from-indigo-500 to-purple-500 shadow-[0_0_12px_rgba(99,102,241,0.45)]">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                      <Bot size={17} className="text-indigo-400" />
                    </div>
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-slate-900 shadow-[0_0_6px_rgba(74,222,128,0.7)]"></span>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="font-semibold text-white text-[13px] tracking-wide">TechBot</h3>
                    <Sparkles size={11} className="text-yellow-400" />
                  </div>
                  <p className="text-[10px] text-green-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse"></span>
                    Online · Replies instantly
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={clearHistory} title="Clear Chat" className="text-slate-500 hover:text-slate-300 p-1.5 hover:bg-slate-800 rounded-full transition-all">
                  <RefreshCcw size={13} />
                </button>
                <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-all p-1.5 bg-slate-800/50 hover:bg-slate-700 rounded-full">
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* ── Messages ── */}
            <div 
              className="flex-1 overflow-y-auto overscroll-contain px-3.5 py-4 space-y-4 min-h-[260px]"
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-end gap-1.5`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500/25 to-purple-500/25 border border-slate-700 flex items-center justify-center flex-shrink-0 mb-1">
                      <Bot size={12} className="text-indigo-400" />
                    </div>
                  )}

                  <div className="flex flex-col gap-0.5 max-w-[82%]">
                    <div className={`px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${msg.sender === 'user'
                        ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-tr-sm'
                        : 'bg-slate-800 border border-slate-700/50 text-slate-100 rounded-tl-sm'
                      }`}>
                      <p dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }} />
                      {msg.action === 'lead_form' && (
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={scrollToContact}
                          className="mt-2.5 w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl text-xs shadow-[0_0_12px_rgba(99,102,241,0.35)] hover:shadow-[0_0_20px_rgba(99,102,241,0.55)] transition-all"
                        >
                          Yes, contact me! →
                        </motion.button>
                      )}
                    </div>
                    {msg.time && (
                      <span className={`text-[10px] text-slate-600 font-medium px-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                        {msg.time}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-end gap-1.5"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500/25 to-purple-500/25 border border-slate-700 flex items-center justify-center flex-shrink-0">
                    <Bot size={12} className="text-indigo-400" />
                  </div>
                  <div className="bg-slate-800 border border-slate-700/50 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-wave"></span>
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-wave animation-delay-200"></span>
                    <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-wave animation-delay-400"></span>
                  </div>
                </motion.div>
              )}

              {/* Quick replies */}
              <AnimatePresence>
                {showQuickReplies && !isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex flex-wrap gap-1.5 pt-1"
                  >
                    {QUICK_REPLIES.map((qr) => (
                      <button
                        key={qr}
                        onClick={() => sendMessage(qr)}
                        className="text-[11px] px-2.5 py-1.5 rounded-full border border-indigo-500/35 text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 hover:border-indigo-400 hover:text-white transition-all font-medium"
                      >
                        {qr}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* ── Input ── */}
            <div className="px-3.5 pb-3.5 pt-2.5 bg-slate-900 border-t border-slate-800/70">
              <form onSubmit={handleSubmit} className="relative flex items-center">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/25 to-purple-500/25 rounded-xl blur opacity-0 focus-within:opacity-100 transition-opacity duration-300"></div>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question..."
                  className="w-full relative z-10 bg-slate-800/80 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-[13px] text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:bg-slate-800 transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-1.5 z-20 w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white disabled:opacity-35 disabled:cursor-not-allowed shadow-[0_0_12px_rgba(99,102,241,0.35)] hover:shadow-[0_0_20px_rgba(99,102,241,0.55)] transition-all"
                >
                  <Send size={14} className="ml-0.5" />
                </motion.button>
              </form>
              <p className="text-center text-[10px] text-slate-600 mt-1.5 font-medium">Powered by <span className="text-indigo-500">Tech Digi AI</span> · Gemini</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toggle Button (Small & Premium) ── */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-12 h-12 flex items-center justify-center"
      >
        {/* Soft glow ring */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur-sm opacity-50"></div>
        {/* Button body */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700 rounded-2xl border border-white/10 shadow-lg flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X size={20} className="text-white" />
              </motion.div>
            ) : (
              <motion.div key="msg" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <MessageSquare size={20} className="text-white fill-white/20" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Online dot */}
        {!isOpen && (
          <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-slate-900 shadow-[0_0_6px_rgba(74,222,128,0.7)]"></span>
        )}
      </motion.button>
    </div>
  );
}
