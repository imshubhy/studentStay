
"use client";

import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Paperclip, Send, Smile, User, Users, MessageSquare } from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  sender: string; // Could be 'You', Contact name, 'System', or Enquiry Sender Name
  text: string;
  time: string;
  isOwn: boolean;
}

interface Contact {
  id: string; // Unique ID for the contact/chat thread
  name: string;
  avatarUrl?: string;
  lastMessage: string;
  unreadCount?: number;
  propertyId?: string; // Link back to the property if it's an enquiry
  propertyTitle?: string; // Added to display property title in chat header for enquiries
  dataAiHint?: string;
  isEnquiry?: boolean; // Flag to identify enquiry chats
}

// Interface for the data stored in localStorage by EnquiryForm
interface EnquiryDetails {
    propertyId: string;
    propertyTitle: string;
    timestamp: number;
    senderName: string;
    initialMessage: string;
}


// Initial mock data (will be combined with dynamic enquiries)
const initialMockContacts: Contact[] = [
  { id: 'host-1', name: 'Host: Rakesh Sharma', avatarUrl: 'https://picsum.photos/seed/host1/40/40', lastMessage: "Yes, it's available.", unreadCount: 2, dataAiHint: "man portrait" },
  { id: 'student-1', name: 'Student: Priya Singh', avatarUrl: 'https://picsum.photos/seed/student1/40/40', lastMessage: 'Can I visit today?', dataAiHint: "woman smiling" },
  { id: 'group-1', name: 'Property Inquiry Group', avatarUrl: undefined, lastMessage: 'New listing shared!', dataAiHint: "group discussion" },
];

const initialMockMessages: { [contactId: string]: Message[] } = {
  'host-1': [
    { id: 'm1', sender: 'Rakesh Sharma', text: "Hello! Thanks for your interest in 'Cozy 2BHK'.", time: '10:00 AM', isOwn: false },
    { id: 'm2', sender: 'You', text: 'Hi Rakesh, is the property still available for rent from next month?', time: '10:01 AM', isOwn: true },
    { id: 'm3', sender: 'Rakesh Sharma', text: "Yes, it's available. Would you like to schedule a visit?", time: '10:02 AM', isOwn: false },
  ],
  'student-1': [
    { id: 'm4', sender: 'Priya Singh', text: 'Hey! Is the studio apartment available?', time: 'Yesterday', isOwn: false },
    { id: 'm5', sender: 'You', text: 'Hi Priya, which one are you referring to?', time: 'Yesterday', isOwn: true },
  ],
  'group-1': [
    { id: 'm6', sender: 'Admin', text: 'Shared new listing: Luxury PG near Gate 3', time: '2 hours ago', isOwn: false },
  ]
};

export default function ChatInterface() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<{ [contactId: string]: Message[] }>({});
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Effect to load initial data and check for pending enquiries from localStorage
  useEffect(() => {
    let newContacts = [...initialMockContacts];
    let newMessages = { ...initialMockMessages };
    let contactToSelect: Contact | null = null;
    let needsUpdate = false;

    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith('pendingEnquiry_')) {
              const item = localStorage.getItem(key);
              if (item) {
                  const enquiryDetails: EnquiryDetails = JSON.parse(item);
                  const contactId = `enquiry-${enquiryDetails.propertyId}-${enquiryDetails.timestamp}`; // Unique ID

                  // Check if this enquiry chat already exists
                  if (!newContacts.some(c => c.id === contactId)) {
                      const newContact: Contact = {
                          id: contactId,
                          name: `Enquiry: ${enquiryDetails.propertyTitle}`,
                          lastMessage: enquiryDetails.initialMessage || 'Enquiry initiated.',
                          propertyId: enquiryDetails.propertyId,
                          propertyTitle: enquiryDetails.propertyTitle, // Store property title
                          unreadCount: 1, 
                          dataAiHint: "question mark", 
                          isEnquiry: true,
                      };
                      newContacts = [newContact, ...newContacts]; 

                      const systemMessage: Message = {
                           id: `msg-${contactId}-sys`,
                           sender: 'System',
                           text: `Enquiry started for property: ${enquiryDetails.propertyTitle} by ${enquiryDetails.senderName}.`,
                           time: new Date(enquiryDetails.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                           isOwn: false
                      };
                      const userMessage: Message = {
                          id: `msg-${contactId}-init`,
                          sender: enquiryDetails.senderName, 
                          text: enquiryDetails.initialMessage,
                          time: new Date(enquiryDetails.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                          isOwn: false 
                      };
                      newMessages[contactId] = [systemMessage, userMessage];

                       if (!contactToSelect) {
                         contactToSelect = newContact; 
                       }
                      needsUpdate = true;
                  }
                  keysToRemove.push(key);
              }
          }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));

    } catch (error) {
        console.error("Error processing pending enquiries from localStorage:", error);
    }

     if (needsUpdate || contacts.length === 0) {
       const combinedContacts = newContacts.reduce((acc, contact) => {
         if (!acc.some(existing => existing.id === contact.id)) {
           acc.push(contact);
         }
         return acc;
       }, [] as Contact[]);

       setContacts(combinedContacts);
       setMessages(prev => ({ ...prev, ...newMessages })); 

        if (contactToSelect) {
            setActiveContact(contactToSelect);
        } else if (!activeContact && combinedContacts.length > 0) {
            setActiveContact(combinedContacts[0]);
        }
    } else if (!activeContact && contacts.length > 0) {
         setActiveContact(contacts[0]);
    }

  }, []); 

  useEffect(() => {
      if (scrollAreaRef.current) {
           const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]') as HTMLDivElement;
           if (viewport) {
               viewport.scrollTop = viewport.scrollHeight;
           }
      }
  }, [messages, activeContact]);


  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !activeContact) return;

    const newMsg: Message = {
      id: `msg-${activeContact.id}-${Date.now()}`, 
      sender: 'You', 
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
    };

    setMessages(prevMessages => ({
      ...prevMessages,
      [activeContact.id]: [...(prevMessages[activeContact.id] || []), newMsg],
    }));

    setContacts(prevContacts => prevContacts.map(contact =>
        contact.id === activeContact.id
            ? { ...contact, lastMessage: `You: ${newMessage}` } 
            : contact
    ));

    setNewMessage('');
  };

   const handleSelectContact = (contact: Contact) => {
      setActiveContact(contact);
      setContacts(prevContacts => prevContacts.map(c =>
          c.id === contact.id ? { ...c, unreadCount: 0 } : c
      ));
  };


  return (
    <div className="flex h-[calc(100vh-12rem)] min-h-[500px] border border-border/50 rounded-lg shadow-lg overflow-hidden bg-card text-card-foreground">
      {/* Contacts List */}
      <div className="w-1/3 border-r border-border/50 bg-background flex flex-col">
        <div className="p-4 border-b border-border/50">
          <Input placeholder="Search contacts..." className="bg-input border-border focus:border-ring focus:ring-ring" />
        </div>
        <ScrollArea className="flex-1">
           {contacts.length === 0 && (
             <div className="p-4 text-center text-muted-foreground text-sm">No chats yet. Start an enquiry from a property listing!</div>
           )}
          {contacts.map((contact) => (
            <button
              key={contact.id}
              className={cn(
                  "flex items-center w-full p-4 hover:bg-muted/50 transition-colors text-left border-b border-border/30", 
                  activeContact?.id === contact.id ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground hover:text-primary' 
               )}
              onClick={() => handleSelectContact(contact)}
            >
              <Avatar className="h-10 w-10 mr-3 flex-shrink-0 border-2 border-border">
                <AvatarImage src={contact.avatarUrl} alt={contact.name} data-ai-hint={contact.dataAiHint} />
                <AvatarFallback className="bg-muted text-muted-foreground">
                  {contact.avatarUrl ? contact.name.substring(0, 1).toUpperCase() :
                   contact.isEnquiry ? <MessageSquare className="h-5 w-5"/> :
                   contact.name.includes("Group") ? <Users className="h-5 w-5"/> :
                   <User className="h-5 w-5"/>}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <h3 className={cn("font-medium text-sm truncate", activeContact?.id === contact.id ? 'text-primary' : 'text-foreground')}>{contact.name}</h3>
                <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
              </div>
              {contact.unreadCount && contact.unreadCount > 0 && (
                 <Badge variant={activeContact?.id === contact.id ? "default" : "destructive"} className={cn("ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs flex-shrink-0", activeContact?.id === contact.id ? 'bg-primary text-primary-foreground' : 'bg-destructive text-destructive-foreground')}>
                  {contact.unreadCount}
                </Badge>
              )}
            </button>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-background"> 
        {activeContact ? (
          <>
            <div className="flex items-center p-4 border-b border-border/50 bg-card">
               <Avatar className="h-10 w-10 mr-3 flex-shrink-0 border-2 border-border">
                 <AvatarImage src={activeContact.avatarUrl} alt={activeContact.name} data-ai-hint={activeContact.dataAiHint} />
                 <AvatarFallback className="bg-muted text-muted-foreground">
                    {activeContact.avatarUrl ? activeContact.name.substring(0,1).toUpperCase() :
                     activeContact.isEnquiry ? <MessageSquare className="h-5 w-5"/> :
                     activeContact.name.includes("Group") ? <Users className="h-5 w-5"/> :
                     <User className="h-5 w-5"/>}
                  </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-foreground">{activeContact.name}</h2>
                 {activeContact.isEnquiry && activeContact.propertyTitle && (
                   <p className="text-xs text-muted-foreground">Regarding Property: {activeContact.propertyTitle}</p>
                 )}
              </div>
            </div>

            <ScrollArea className="flex-1 p-4 space-y-4 bg-background" ref={scrollAreaRef}>
              {(messages[activeContact.id] || []).map((msg) => (
                <div key={msg.id} className={cn('flex', msg.isOwn ? 'justify-end' : 'justify-start')}>
                  <div className={cn(
                      'max-w-xs lg:max-w-md p-3 rounded-xl shadow-sm text-sm break-words', 
                       msg.isOwn
                         ? 'bg-primary text-primary-foreground' 
                         : 'bg-card border border-border/50 text-foreground', 
                       msg.sender === 'System' && 'bg-muted text-muted-foreground italic text-center w-full max-w-none shadow-none border-none' 
                    )}>
                    {msg.sender !== 'You' && msg.sender !== 'System' && (
                      <p className={cn("text-xs font-semibold mb-1", msg.isOwn ? 'text-primary-foreground/80' : 'text-accent')}>{msg.sender}</p> 
                    )}
                    <p>{msg.text}</p>
                     {msg.sender !== 'System' && (
                       <p className={cn(
                           'text-xs mt-1.5 opacity-70', 
                            msg.isOwn ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground text-left'
                          )}>
                          {msg.time}
                        </p>
                     )}
                  </div>
                </div>
              ))}
                 {(!messages[activeContact.id] || messages[activeContact.id].length === 0) && (
                   <div className="text-center text-muted-foreground text-sm p-4">No messages yet.</div>
                )}
            </ScrollArea>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-border/50 bg-card">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" type="button" className="text-muted-foreground hover:text-primary hover:bg-primary/10"><Smile className="h-5 w-5" /></Button>
                <Button variant="ghost" size="icon" type="button" className="text-muted-foreground hover:text-primary hover:bg-primary/10"><Paperclip className="h-5 w-5" /></Button>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-input border-border focus:border-ring focus:ring-ring"
                  aria-label="Chat message input"
                />
                <Button type="submit" size="icon" aria-label="Send message" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground text-center p-4">
             <MessageSquare className="h-16 w-16 mb-4 text-primary/30" /> 
            <p className="font-semibold text-lg text-foreground">Select a chat</p>
            <p className="text-sm">Choose a contact or start an enquiry from a property listing.</p>
          </div>
        )}
      </div>
    </div>
  );
}
