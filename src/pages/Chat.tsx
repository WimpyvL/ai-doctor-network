import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { User, Bot, Clock, FileText, Search as SearchIcon, Pill, Sparkles } from 'lucide-react'; // Use SearchIcon alias
import ChatInput from '@/components/agents/ChatInput'; // Assuming this is styled appropriately or needs update
import { cn } from '@/lib/utils'; // Import cn
import { PicassoIllustration } from '@/components/illustrations/PicassoIllustration';
import { PicassoBackground } from '@/components/illustrations/PicassoBackground';
import { PicassoAvatar } from '@/components/illustrations/PicassoAvatar';
import { AnimatedIllustration, LoadingIllustration } from '@/components/illustrations/AnimatedIllustration';

interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
}

// This component now renders the core chat UI, assuming parent handles layout
const Chat = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const suggestions = [
        { text: "What's new?", icon: Clock },
        { text: "Find differential", icon: SearchIcon },
        { text: "Summarize study", icon: FileText },
        { text: "Find dose", icon: Pill },
    ];

    const handleSendMessage = (messageText: string, attachments?: File[]) => {
        if (!messageText.trim() && (!attachments || attachments.length === 0)) return;
        const userMessage: ChatMessage = { sender: 'user', text: messageText };
        setMessages(prev => [...prev, userMessage]);
        setIsSending(true);
        setTimeout(() => {
            const botResponseText = `Simulated response for: "${userMessage.text}"`;
            const botMessage: ChatMessage = { sender: 'bot', text: botResponseText };
            setMessages(prev => [...prev, botMessage]);
            setIsSending(false);
        }, 1000 + Math.random() * 500);
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const showInitialState = messages.length === 0;

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    // *** MODIFIED Greeting Component ***
    const Greeting = () => (
        <div className="mb-12"> {/* Removed text-center */}
            {/* Flex container to place illustration next to text */}
            <div className="flex items-center justify-center gap-4"> {/* Added flex container */}
                {/* Decorative element */}
                <div className="text-primary"> {/* Use new primary color */}
                    <PicassoIllustration
                        name="healing"
                        size="lg"
                        color="text-primary"
                        className="animate-float" // Removed mx-auto
                    />
                </div>
                {/* Personal greeting */}
                <h1 className="text-[32px] font-bold text-foreground"> {/* Ensured font-bold */}
                    {getGreeting()}, Doctor
                </h1>
            </div>
        </div>
    );
    // *** END MODIFIED Greeting Component ***


    const MessageDisplay = () => (
        <PicassoBackground
            pattern="abstractArt" // Use the new Picasso-style pattern
            color="text-primary"
            opacity={5}
            className="w-full flex-1 overflow-y-auto space-y-4 pb-4"
        >
            {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start gap-2.5 max-w-[85%]`}>
                   {msg.sender === 'bot' && (
                     <PicassoAvatar
                        name="Leny"
                        illustrationType="healing"
                        size="sm"
                        color="text-primary"
                        className="flex-shrink-0"
                     />
                   )}
                   <div className={cn(
                     "p-3 rounded-lg text-base",
                     msg.sender === 'user'
                       ? 'bg-primary text-primary-foreground rounded-br-none'
                       : 'bg-muted text-foreground rounded-bl-none'
                   )}>
                       <p className="leading-relaxed">{msg.text}</p>
                   </div>
                    </div>
                </div>
            ))}
            {isSending && (
                 <div className="flex justify-start">
                   <div className="flex items-start gap-2.5">
                     <PicassoAvatar
                        name="Leny"
                        illustrationType="brain"
                        size="sm"
                        color="text-primary"
                        className="flex-shrink-0"
                     />
                     <div className="p-3 rounded-lg bg-muted">
                        <LoadingIllustration type="ai" size="sm" />
                     </div>
                   </div>
                 </div>
            )}
            <div ref={messagesEndRef} />
        </PicassoBackground>
    );

    const InputArea = () => (
        <div className="w-full bg-background">
           <ChatInput
             onSendMessage={handleSendMessage}
             isLoading={isSending}
             agentName="Leny"
           />
       </div>
    );

    // *** MODIFIED Suggestions Component ***
    const Suggestions = () => (
        <div className="flex flex-wrap justify-center gap-3 mt-6">
            {suggestions.map((suggestion, index) => {
                const illustrationMap: Record<string, string> = {
                    "What's new?": "chat",
                    "Find differential": "brain",
                    "Summarize study": "chart",
                    "Find dose": "stethoscope"
                };
                const illustrationType = illustrationMap[suggestion.text] || "empty";

                return (
                    <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        // Make default border more visible (primary with 50% opacity) and darken on hover
                        className="rounded-full px-4 py-2 text-sm font-medium text-foreground bg-background border-primary/50 hover:bg-primary/5 hover:border-primary hover:text-foreground group transition-colors duration-200" 
                        onClick={() => handleSendMessage(suggestion.text)}
                    >
                        <div className="mr-2 w-4 h-4">
                            <PicassoIllustration
                                name={illustrationType as any}
                                size="xs"
                                color="text-primary"
                                className="group-hover:animate-pulse"
                            />
                        </div>
                        {suggestion.text}
                    </Button>
                );
            })}
        </div>
    );
    // *** END MODIFIED Suggestions Component ***

    return (
        <div className="flex flex-col h-full">
            {showInitialState ? (
                // Re-applying flex properties to center content vertically and horizontally
                <div className="flex flex-1 flex-col items-center justify-center p-5"> 
                    {/* Background is handled by AppLayout */}
                    <div className="w-full max-w-[700px] flex flex-col items-center"> 
                        <Greeting />
                        <div className="w-full relative mb-[30px]">
                            <InputArea />
                        </div>
                        <Suggestions />
                    </div>
                </div>
            ) : (
                <>
                    <MessageDisplay />
                    <div className="w-full max-w-3xl mx-auto flex-shrink-0 px-4 pb-2">
                      <InputArea />
                    </div>
                </>
            )}
        </div>
    );
};

export default Chat;
