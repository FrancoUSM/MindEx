import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Professional, MOCK_PROFESSIONALS } from "@/lib/professionals";

interface Message {
  id: string;
  role: 'bot' | 'user';
  content: string;
  options?: string[];
  matchedProfessionals?: Professional[];
}

interface TriageBotProps {
  onSelectProfessional: (id: string) => void;
  onClose: () => void;
}

const TRIAGE_FLOW = {
  welcome: {
    message: "👋 ¡Hola! Soy el asistente de MINDEXA. Te ayudaré a encontrar al profesional ideal para ti. ¿Qué te trae hoy?",
    options: [
      "Estrés laboral o burnout",
      "Ansiedad o ataques de pánico", 
      "Depresión o tristeza persistente",
      "Problemas de sueño",
      "Otra situación"
    ]
  },
  severity: {
    message: "Entiendo. ¿Cómo describirías la intensidad de lo que estás experimentando?",
    options: [
      "Leve - puedo manejarlo pero quiero apoyo",
      "Moderado - afecta mi día a día",
      "Severo - me cuesta funcionar normalmente",
      "Crisis - necesito ayuda urgente"
    ]
  },
  preference: {
    message: "¿Tienes alguna preferencia sobre el tipo de profesional?",
    options: [
      "Psicólogo/a - terapia conversacional",
      "Psiquiatra - puede recetar medicación",
      "No tengo preferencia",
      "Necesito orientación"
    ]
  },
  matching: {
    message: "¡Perfecto! Basado en lo que me cuentas, he encontrado profesionales especializados que pueden ayudarte. 🎯"
  }
};

export function TriageBot({ onSelectProfessional, onClose }: TriageBotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [currentStep, setCurrentStep] = useState<'welcome' | 'severity' | 'preference' | 'matching' | 'done'>('welcome');
  const [userNeeds, setUserNeeds] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages([
        {
          id: '1',
          role: 'bot',
          content: TRIAGE_FLOW.welcome.message,
          options: TRIAGE_FLOW.welcome.options
        }
      ]);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const simulateTyping = (callback: () => void) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, 1000 + Math.random() * 1000);
  };

  const handleOptionClick = (option: string) => {
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: option
    };
    setMessages(prev => [...prev, userMsg]);
    setUserNeeds(prev => [...prev, option]);

    // Process next step
    simulateTyping(() => {
      let nextMsg: Message;
      
      if (currentStep === 'welcome') {
        setCurrentStep('severity');
        nextMsg = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: TRIAGE_FLOW.severity.message,
          options: TRIAGE_FLOW.severity.options
        };
      } else if (currentStep === 'severity') {
        // Check for crisis
        if (option.includes('Crisis')) {
          nextMsg = {
            id: (Date.now() + 1).toString(),
            role: 'bot',
            content: "🚨 Entiendo que estás pasando por un momento muy difícil. Si estás en crisis, te recomiendo contactar la línea de ayuda 600 360 7777 (Fono Salud Responde). ¿Te gustaría que te conecte con un profesional de urgencia?",
            options: ["Sí, conectarme ahora", "Continuar con la búsqueda normal"]
          };
        } else {
          setCurrentStep('preference');
          nextMsg = {
            id: (Date.now() + 1).toString(),
            role: 'bot',
            content: TRIAGE_FLOW.preference.message,
            options: TRIAGE_FLOW.preference.options
          };
        }
      } else if (currentStep === 'preference') {
        setCurrentStep('matching');
        // Find matching professionals
        const matched = MOCK_PROFESSIONALS
          .filter(p => p.matchScore && p.matchScore > 75)
          .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
          .slice(0, 3);
        
        nextMsg = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: TRIAGE_FLOW.matching.message,
          matchedProfessionals: matched
        };
        setCurrentStep('done');
      } else {
        return;
      }

      setMessages(prev => [...prev, nextMsg]);
    });
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    simulateTyping(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: "Gracias por compartir eso conmigo. Para ayudarte mejor, ¿podrías seleccionar una de las opciones anteriores?",
      };
      setMessages(prev => [...prev, botMsg]);
    });
  };

  return (
    <Card className="h-[600px] flex flex-col border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary-glow/10 border-b">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-semibold">Asistente MINDEXA</p>
            <p className="text-xs text-muted-foreground font-normal">
              Bot de triaje inteligente
            </p>
          </div>
          <Badge className="ml-auto bg-green-100 text-green-700 border-green-200">
            <Sparkles className="h-3 w-3 mr-1" />
            IA
          </Badge>
        </CardTitle>
      </CardHeader>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <Avatar className={`h-8 w-8 ${msg.role === 'bot' ? 'bg-primary' : 'bg-muted'}`}>
                <AvatarFallback>
                  {msg.role === 'bot' ? <Bot className="h-4 w-4 text-primary-foreground" /> : <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              
              <div className={`max-w-[80%] space-y-2 ${msg.role === 'user' ? 'items-end' : ''}`}>
                <div className={`rounded-2xl px-4 py-2 ${
                  msg.role === 'bot' 
                    ? 'bg-muted text-foreground rounded-tl-none' 
                    : 'bg-primary text-primary-foreground rounded-tr-none'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                </div>

                {/* Options */}
                {msg.options && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {msg.options.map((option, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        className="text-xs h-auto py-2 px-3 whitespace-normal text-left"
                        onClick={() => handleOptionClick(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                )}

                {/* Matched Professionals */}
                {msg.matchedProfessionals && (
                  <div className="space-y-2 mt-3">
                    {msg.matchedProfessionals.map((prof) => (
                      <Card 
                        key={prof.id} 
                        className="p-3 cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={() => onSelectProfessional(prof.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 border-2 border-primary/20">
                            <img src={prof.avatar} alt={prof.name} className="object-cover" />
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{prof.name}</p>
                            <p className="text-xs text-muted-foreground">{prof.title}</p>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {prof.matchScore}% compatible
                            </Badge>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 bg-primary">
                <AvatarFallback>
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <CardContent className="border-t p-3">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
