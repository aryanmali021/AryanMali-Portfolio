import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, Send, Mic, MicOff, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
}

export default function AIAvatar() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'bot', text: "Hi! I'm Aryan's AI clone. Ask me anything about his skills or projects!" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const synth = window.speechSynthesis;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const speak = (text: string) => {
    if (synth.speaking) {
      synth.cancel();
    }
    
    // Choose a voice
    const voices = synth.getVoices();
    const voice = voices.find(v => v.lang.includes('en') && v.name.includes('Male')) || voices[0];
    
    const utterance = new SpeechSynthesisUtterance(text);
    if (voice) {
      utterance.voice = voice;
    }
    utterance.pitch = 1;
    utterance.rate = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synth.speak(utterance);
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSendMessage = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      
      const data = await response.json();
      if (response.ok && data.reply) {
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'bot', text: data.reply }]);
        speak(data.reply);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'bot', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[100] p-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:shadow-cyan-500/50 hover:-translate-y-1 transition-all duration-300"
          >
            <Bot className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-2 right-2 sm:bottom-6 sm:right-6 z-[100] w-[calc(100vw-1rem)] sm:w-[350px] max-h-[calc(100vh-2rem)] sm:max-h-[85vh] shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Aryan AI</h3>
                  <div className="flex items-center gap-1.5 text-xs text-white/80">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Online
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={toggleSpeech}
                  className={`p-1.5 rounded-full hover:bg-white/20 transition-colors ${!isSpeaking ? 'opacity-70' : ''}`}
                  title={isSpeaking ? "Stop Speaking" : "Speech Synthesis Active"}
                >
                  {isSpeaking ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 min-h-[350px] overflow-y-auto flex flex-col gap-3 bg-slate-50 dark:bg-slate-900/50">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-cyan-500 text-white rounded-tr-none' 
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-2xl rounded-tl-none px-4 py-3 border border-slate-100 dark:border-slate-700 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />
                    <span className="text-xs text-slate-500">Aryan is typing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-500/50 pr-10"
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="absolute right-1 p-1.5 text-cyan-500 hover:text-cyan-600 disabled:opacity-50 disabled:hover:text-cyan-500 transition-colors bg-white dark:bg-slate-700 rounded-full shadow-sm"
                >
                  <Send className="w-4 h-4 mr-0.5 mt-0.5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
