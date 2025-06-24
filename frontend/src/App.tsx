import { useStream } from "@langchain/langgraph-sdk/react";
import type { Message } from "@langchain/langgraph-sdk";
import { useState, useEffect, useRef, useCallback } from "react";
import { ProcessedEvent } from "@/components/ActivityTimeline";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { EnhancedWelcomeScreen } from "@/components/EnhancedWelcomeScreen";
import { ChatMessagesView } from "@/components/ChatMessagesView";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

export default function App() {
  const { isDark } = useTheme();
  const [processedEventsTimeline, setProcessedEventsTimeline] = useState<
    ProcessedEvent[]
  >([]);
  const [historicalActivities, setHistoricalActivities] = useState<
    Record<string, ProcessedEvent[]>
  >({});
  const [useEnhancedMode, setUseEnhancedMode] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const hasFinalizeEventOccurredRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const thread = useStream<{
    messages: Message[];
    initial_search_query_count: number;
    max_research_loops: number;
    reasoning_model: string;
  }>({
    apiUrl: import.meta.env.DEV
      ? "http://localhost:2024"
      : "http://localhost:8123",
    assistantId: "agent",
    messagesKey: "messages",
    onUpdateEvent: (event: Record<string, unknown>) => {
      let processedEvent: ProcessedEvent | null = null;
      if (event.generate_query) {
        const generateQuery = event.generate_query as { search_query?: string[] };
        processedEvent = {
          title: "Generating Search Queries",
          data: generateQuery?.search_query?.join(", ") || "",
        };
      } else if (event.web_research) {
        const webResearch = event.web_research as { sources_gathered?: Array<{ label?: string }> };
        const sources = webResearch.sources_gathered || [];
        const numSources = sources.length;
        const uniqueLabels = [
          ...new Set(sources.map((s: Record<string, unknown>) => s.label).filter(Boolean)),
        ];
        const exampleLabels = uniqueLabels.slice(0, 3).join(", ");
        processedEvent = {
          title: "Web Research",
          data: `Gathered ${numSources} sources. Related to: ${
            exampleLabels || "N/A"
          }.`,
        };
      } else if (event.reflection) {
        processedEvent = {
          title: "Reflection",
          data: "Analysing Web Research Results",
        };
      } else if (event.finalize_answer) {
        processedEvent = {
          title: "Finalizing Answer",
          data: "Composing and presenting the final answer.",
        };
        hasFinalizeEventOccurredRef.current = true;
      }
      if (processedEvent) {
        setProcessedEventsTimeline((prevEvents) => [
          ...prevEvents,
          processedEvent!,
        ]);
      }
    },
    onError: (error: unknown) => {
      setError(error instanceof Error ? error.message : String(error));
    },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [thread.messages]);

  useEffect(() => {
    if (
      hasFinalizeEventOccurredRef.current &&
      !thread.isLoading &&
      thread.messages.length > 0
    ) {
      const lastMessage = thread.messages[thread.messages.length - 1];
      if (lastMessage && lastMessage.type === "ai" && lastMessage.id) {
        setHistoricalActivities((prev) => ({
          ...prev,
          [lastMessage.id!]: [...processedEventsTimeline],
        }));
      }
      hasFinalizeEventOccurredRef.current = false;
    }
  }, [thread.messages, thread.isLoading, processedEventsTimeline]);

  const handleSubmit = useCallback(
    (submittedInputValue: string, effort: string, model: string, files?: FileList) => {
      if (!submittedInputValue.trim()) return;
      setProcessedEventsTimeline([]);
      hasFinalizeEventOccurredRef.current = false;

      // convert effort to, initial_search_query_count and max_research_loops
      // low means max 1 loop and 1 query
      // medium means max 3 loops and 3 queries
      // high means max 10 loops and 5 queries
      let initial_search_query_count: number;
      let max_research_loops: number;
      switch (effort) {
        case "low":
          initial_search_query_count = 1;
          max_research_loops = 1;
          break;
        case "medium":
          initial_search_query_count = 3;
          max_research_loops = 3;
          break;
        case "high":
          initial_search_query_count = 5;
          max_research_loops = 10;
          break;
        default:
          initial_search_query_count = 3;
          max_research_loops = 3;
      }

      // Prepare file data for upload
      const uploaded_files = files ? Array.from(files).map(file => ({
        filename: file.name,
        content_type: file.type,
        size: file.size,
        content: null // Would need to read file content in real implementation
      })) : undefined;

      const newMessages: Message[] = [
        ...(thread.messages || []),
        {
          type: "human" as const,
          content: submittedInputValue,
          id: Date.now().toString(),
        },
      ];
      
      try {
        thread.submit({
          messages: newMessages,
          initial_search_query_count,
          max_research_loops,
          reasoning_model: model,
          ...(uploaded_files && { uploaded_files }),
        });
      } catch (error) {
        console.error("Error submitting to thread:", error);
        setError(error instanceof Error ? error.message : "Failed to submit request");
      }
    },
    [thread]
  );

  const handleCancel = useCallback(() => {
    thread.stop();
    window.location.reload();
  }, [thread]);

  const toggleMode = () => {
    setUseEnhancedMode(!useEnhancedMode);
  };

  return (
    <div className={`flex h-screen font-sans antialiased transition-colors duration-300 ${
      isDark 
        ? 'bg-neutral-800 text-neutral-100' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      <main className="h-full w-full max-w-7xl mx-auto">
          {thread.messages.length === 0 ? (
            <div>
              {/* Mode Toggle */}
              <div className="absolute top-6 left-6 z-10">
                <Button
                  onClick={toggleMode}
                  variant="outline"
                  size="sm"
                  className={`backdrop-blur-sm transition-colors ${
                    isDark 
                      ? 'bg-neutral-800/50 border-neutral-700/50 text-neutral-300 hover:bg-neutral-700/50' 
                      : 'bg-white/50 border-gray-300/50 text-gray-700 hover:bg-gray-100/50'
                  }`}
                >
                  {useEnhancedMode ? 'Classic Mode' : 'Enhanced Mode'}
                </Button>
              </div>
              
              {useEnhancedMode ? (
                <EnhancedWelcomeScreen
                  handleSubmit={handleSubmit}
                  isLoading={thread.isLoading}
                  onCancel={handleCancel}
                />
              ) : (
                <WelcomeScreen
                  handleSubmit={handleSubmit}
                  isLoading={thread.isLoading}
                  onCancel={handleCancel}
                />
              )}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className={`flex flex-col items-center justify-center gap-4 p-8 rounded-xl border transition-colors ${
                isDark 
                  ? 'bg-neutral-800/50 border-neutral-700/50' 
                  : 'bg-white/50 border-gray-300/50'
              }`}>
                <h1 className="text-2xl text-red-500 font-bold">Error</h1>
                <p className={`text-red-500 text-center ${isDark ? '' : 'opacity-80'}`}>
                  {JSON.stringify(error)}
                </p>

                <Button
                  variant="destructive"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : (
            <ChatMessagesView
              messages={thread.messages}
              isLoading={thread.isLoading}
              scrollAreaRef={scrollAreaRef}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              liveActivityEvents={processedEventsTimeline}
              historicalActivities={historicalActivities}
            />
          )}
      </main>
    </div>
  );
}
