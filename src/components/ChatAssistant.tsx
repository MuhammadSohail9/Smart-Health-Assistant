import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquareText,
  Send,
  Sparkles,
  Loader2,
  User,
  Bot,
  AlertTriangle,
  Stethoscope,
  ShieldAlert,
  ChevronRight,
  PhoneCall,
  RotateCcw,
} from 'lucide-react';
import {
  ChatMessage,
  UserProfile,
  MedicalReport,
  Medication,
} from '../types';

interface ChatAssistantProps {
  userProfile: UserProfile;
  reports: MedicalReport[];
  medications: Medication[];
  initialQuestion?: string;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  userProfile,
  reports,
  medications,
  initialQuestion,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      sender: 'assistant',
      text: `Hello ${userProfile.name}! I am your AI Health Assistant. I have context on your recent lab results (HbA1c 7.2%, Total Cholesterol 228 mg/dL) and current active medications (${medications.map(m => m.name).join(', ')}). \n\nHow can I help you today? You can ask me about lab values, medication side effects, food suggestions, or questions to ask your physician.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState(initialQuestion || '');
  const [isLoading, setIsLoading] = useState(false);
  const [emergencyAlert, setEmergencyAlert] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialQuestion) {
      setInput(initialQuestion);
    }
  }, [initialQuestion]);

  const quickPrompts = [
    'Why is my HbA1c elevated at 7.2%?',
    'What foods help naturally lower my LDL cholesterol?',
    'Can Metformin interact with grapefruit or alcohol?',
    'What questions should I ask my doctor at my next visit?',
    'How can I safely improve my Vitamin D level?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);
    setEmergencyAlert(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages,
          userProfile,
          activeReports: reports,
          medications,
        }),
      });

      const result = await response.json();

      if (result.isEmergencyAlert) {
        setEmergencyAlert('Emergency symptoms detected. If experiencing chest pain, severe shortness of breath, slurred speech, or acute distress, call 911 immediately.');
      }

      const assistantMsg: ChatMessage = {
        id: `msg_a_${Date.now()}`,
        sender: 'assistant',
        text: result.text || 'I apologize, but I encountered an issue generating a response. Please try asking again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEmergencyAlert: result.isEmergencyAlert,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        sender: 'assistant',
        text: 'I am temporarily unable to connect to the health knowledge engine. Please ensure your connection is active and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wide">
            <MessageSquareText className="w-4 h-4 text-emerald-400" />
            <span>Module 11 — Interactive AI Health Chat Assistant</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Context-Aware AI Health Assistant</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ask questions about lab results, drug mechanisms, dietary tips, or doctor appointment preparation.
          </p>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: `msg_reset_${Date.now()}`,
                sender: 'assistant',
                text: `Conversation cleared. I am ready for your next health question, ${userProfile.name}.`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
            setEmergencyAlert(null);
          }}
          className="text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors flex items-center space-x-1 shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Chat History</span>
        </button>
      </div>

      {/* Emergency Warning Banner if detected */}
      {emergencyAlert && (
        <div className="bg-rose-950/80 border border-rose-500/50 text-rose-200 p-4 rounded-xl flex items-center justify-between gap-4 text-xs animate-in fade-in">
          <div className="flex items-center space-x-3">
            <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0" />
            <div>
              <strong className="text-white block text-sm font-bold">URGENT EMERGENCY NOTICE</strong>
              <span>{emergencyAlert}</span>
            </div>
          </div>
          <a
            href="tel:911"
            className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2 rounded-lg flex items-center space-x-1 shrink-0 shadow-md"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 911</span>
          </a>
        </div>
      )}

      {/* Quick Prompt Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
        <span className="text-[11px] font-bold text-slate-400 shrink-0">Quick Questions:</span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-slate-300 text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-all shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 h-[480px] flex flex-col justify-between shadow-inner">
        <div className="overflow-y-auto space-y-4 pr-2">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-teal-600 text-white'
                      : 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-emerald-400" />}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-teal-600 text-white rounded-tr-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none space-y-2'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <div className={`text-[10px] mt-1 text-right ${isUser ? 'text-teal-200' : 'text-slate-500'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-950 border border-slate-800 text-slate-400 p-4 rounded-2xl rounded-tl-none text-xs flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span>AI Health Assistant is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a health question e.g. 'Why is my HbA1c 7.2%?' or 'Can I eat bananas?'..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              disabled={isLoading}
              id="input-chat-query"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow-md shrink-0"
              id="btn-send-chat-message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-[10px] text-slate-500 mt-2 text-center">
            AI Assistant provides evidence-informed educational information. Always consult a licensed clinician for medical advice.
          </div>
        </div>
      </div>
    </div>
  );
};
