import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LayoutDashboard, BookOpen, FileText, MessageSquare, Settings } from "lucide-react";

export default function KnowledgeManagementApp() {
  const [active, setActive] = useState("Dashboard");
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const nav = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Knowledge", icon: BookOpen },
    { name: "Documents", icon: FileText },
    { name: "Chat", icon: MessageSquare },
    { name: "Settings", icon: Settings },
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");

    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('https://jeff.justinglittle.com/webhook/0cd361a4-5c3a-4023-bfd3-66e392d1ed5c/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatInput: userMessage,
          chatHistory: messages
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the response as text first
      const responseText = await response.text();
      console.log('Raw webhook response:', responseText);

      let assistantMessage = 'No response received';

      // Try to parse as JSON first
      try {
        const data = JSON.parse(responseText);
        console.log('Parsed JSON:', data);

        // Check if the response contains an error
        if (data.error) {
          const errorContent = data.error.content || JSON.stringify(data.error);
          throw new Error(`Webhook error: ${errorContent}`);
        }

        // Try to extract the message from various possible response structures
        if (data.response) {
          assistantMessage = data.response;
        } else if (data.message) {
          assistantMessage = data.message;
        } else if (data.output) {
          assistantMessage = data.output;
        } else if (data.text) {
          assistantMessage = data.text;
        } else if (data.content) {
          assistantMessage = data.content;
        } else if (data.data) {
          // Sometimes n8n wraps the response in a data field
          if (typeof data.data === 'string') {
            assistantMessage = data.data;
          } else if (data.data.response || data.data.message) {
            assistantMessage = data.data.response || data.data.message;
          }
        }
      } catch (jsonError) {
        // If JSON parsing fails, use the raw text response
        console.log('Not JSON, using raw text');
        if (responseText && responseText.trim()) {
          assistantMessage = responseText;
        }
      }

      // Add assistant response to chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: assistantMessage
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Error: Failed to get response from the server.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="h-14 flex items-center px-4 border-b font-semibold">Knowledge Manager</div>
        <nav className="flex-1 p-2 space-y-1">
          {nav.map((item) => (
            <button
              key={item.name}
              onClick={() => setActive(item.name)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
                active === item.name
                  ? "bg-slate-100 font-medium"
                  : "hover:bg-slate-100"
              }`}
            >
              <item.icon className="w-4 h-4 text-slate-500" />
              {item.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 text-sm">
          <div className="font-medium">Production</div>
          <div className="text-slate-500">Linux · Docker · Live</div>
        </header>

        {/* Content */}
        <section className="flex-1 p-6 overflow-auto">
          {active === "Dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card><CardContent className="p-4 text-sm">Vectors<br/><span className="text-2xl font-semibold">12,430</span></CardContent></Card>
              <Card><CardContent className="p-4 text-sm">Documents<br/><span className="text-2xl font-semibold">842</span></CardContent></Card>
              <Card><CardContent className="p-4 text-sm">Pipelines<br/><span className="text-2xl font-semibold">6</span></CardContent></Card>
              <Card><CardContent className="p-4 text-sm">Health<br/><span className="text-2xl font-semibold text-green-600">OK</span></CardContent></Card>
            </div>
          )}

          {active === "Documents" && (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h1 className="text-lg font-medium">Documents</h1>
      <input
        type="text"
        placeholder="Filter documents…"
        className="border rounded px-2 py-1 text-sm"
      />
    </div>

    <div className="overflow-auto border rounded bg-white">
      <table className="w-full text-sm">
        <thead className="bg-slate-100 border-b">
          <tr>
            <th className="text-left px-3 py-2">Name</th>
            <th className="text-left px-3 py-2">Type</th>
            <th className="text-left px-3 py-2">Practice</th>
            <th className="text-left px-3 py-2">Status</th>
            <th className="text-left px-3 py-2">Processed</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b hover:bg-slate-50">
            <td className="px-3 py-2">Cloud Migration Guide.pdf</td>
            <td className="px-3 py-2">Reference Architecture</td>
            <td className="px-3 py-2">Cloud Services</td>
            <td className="px-3 py-2 text-green-600">Indexed</td>
            <td className="px-3 py-2">2026-01-14</td>
          </tr>
          <tr className="border-b hover:bg-slate-50">
            <td className="px-3 py-2">Mainframe Ops.md</td>
            <td className="px-3 py-2">Best Practice</td>
            <td className="px-3 py-2">Infrastructure</td>
            <td className="px-3 py-2 text-green-600">Indexed</td>
            <td className="px-3 py-2">2026-01-13</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div className="text-xs text-slate-500">
      Documents shown are those successfully processed through the n8n RAG ingestion pipeline.
    </div>
  </div>
)}

          {active === "Chat" && (
            <Card className="h-full">
              <CardContent className="p-4 flex flex-col h-full">
                <div className="text-sm font-medium mb-2">Knowledge Chat</div>
                <div className="flex-1 border rounded-md bg-white p-3 overflow-auto space-y-3">
                  {messages.length === 0 ? (
                    <div className="text-sm text-slate-500">Ask questions about your knowledge base…</div>
                  ) : (
                    messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`text-sm p-3 rounded-md ${
                          msg.role === 'user'
                            ? 'bg-slate-100 ml-12'
                            : 'bg-blue-50 mr-12'
                        }`}
                      >
                        <div className="font-medium text-xs mb-1 text-slate-600">
                          {msg.role === 'user' ? 'You' : 'Assistant'}
                        </div>
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="text-sm p-3 rounded-md bg-blue-50 mr-12">
                      <div className="font-medium text-xs mb-1 text-slate-600">Assistant</div>
                      <div className="text-slate-500">Thinking...</div>
                    </div>
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <Input
                    className="text-sm"
                    placeholder="Ask something"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    disabled={isLoading}
                  />
                  <Button size="sm" onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>
                    {isLoading ? 'Sending...' : 'Send'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {active === "Knowledge" && (
            <Card>
              <CardContent className="p-4 text-sm">
                <div className="font-medium mb-2">Semantic Knowledge</div>
                <div className="text-slate-600">Practice → Value Proposition → Pattern → Component</div>
              </CardContent>
            </Card>
          )}

          {active === "Settings" && (
            <Card>
              <CardContent className="p-4 text-sm">Integration & system settings</CardContent>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
}
