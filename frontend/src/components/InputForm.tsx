import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SquarePen, Brain, Send, StopCircle, Zap, Cpu } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeContext";

// Updated InputFormProps
interface InputFormProps {
  onSubmit: (inputValue: string, effort: string, model: string) => void;
  onCancel: () => void;
  isLoading: boolean;
  hasHistory: boolean;
  initialValue?: string; // New optional prop for template support
}

export const InputForm: React.FC<InputFormProps> = ({
  onSubmit,
  onCancel,
  isLoading,
  hasHistory,
  initialValue = "", // Default to empty string
}) => {
  const { isDark } = useTheme();
  const [internalInputValue, setInternalInputValue] = useState(initialValue);
  const [effort, setEffort] = useState("medium");
  const [model, setModel] = useState("gemini-2.5-flash-preview-04-17");

  // Update internal value when initialValue changes
  useEffect(() => {
    setInternalInputValue(initialValue);
  }, [initialValue]);

  const handleInternalSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!internalInputValue.trim()) return;
    onSubmit(internalInputValue, effort, model);
    setInternalInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit with Ctrl+Enter (Windows/Linux) or Cmd+Enter (Mac)
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleInternalSubmit();
    }
  };

  const isSubmitDisabled = !internalInputValue.trim() || isLoading;

  return (
    <form
      onSubmit={handleInternalSubmit}
      className={`flex flex-col gap-2 p-3 pb-4`}
    >
      <div
        className={`flex flex-row items-center justify-between rounded-3xl rounded-bl-sm ${
          hasHistory ? "rounded-br-sm" : ""
        } break-words min-h-7 px-4 pt-3 transition-colors ${
          isDark 
            ? 'text-white bg-neutral-700' 
            : 'text-gray-900 bg-gray-100 border border-gray-300'
        }`}
      >
        <Textarea
          value={internalInputValue}
          onChange={(e) => setInternalInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={initialValue || "Who won the Euro 2024 and scored the most goals?"}
          className={`w-full resize-none border-0 focus:outline-none focus:ring-0 outline-none focus-visible:ring-0 shadow-none
                        md:text-base min-h-[56px] max-h-[200px] bg-transparent transition-colors ${
            isDark 
              ? 'text-neutral-100 placeholder-neutral-500' 
              : 'text-gray-900 placeholder-gray-500'
          }`}
          rows={initialValue ? Math.min(Math.max(initialValue.split('\n').length, 3), 8) : 1}
        />
        <div className="-mt-3">
          {isLoading ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-400 hover:bg-red-500/10 p-2 cursor-pointer rounded-full transition-all duration-200"
              onClick={onCancel}
            >
              <StopCircle className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="ghost"
              className={`${
                isSubmitDisabled
                  ? "text-neutral-500"
                  : "text-blue-500 hover:text-blue-400 hover:bg-blue-500/10"
              } p-2 cursor-pointer rounded-full transition-all duration-200 text-base`}
              disabled={isSubmitDisabled}
            >
              Search
              <Send className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-row gap-2">
          <div className={`flex flex-row gap-2 focus:ring-neutral-500 rounded-xl rounded-t-sm pl-2 max-w-[100%] sm:max-w-[90%] transition-colors ${
            isDark 
              ? 'bg-neutral-700 border-neutral-600 text-neutral-300' 
              : 'bg-gray-100 border-gray-300 text-gray-700'
          }`}>
            <div className="flex flex-row items-center text-sm">
              <Brain className="h-4 w-4 mr-2" />
              Effort
            </div>
            <Select value={effort} onValueChange={setEffort}>
              <SelectTrigger className="w-[120px] bg-transparent border-none cursor-pointer">
                <SelectValue placeholder="Effort" />
              </SelectTrigger>
              <SelectContent className={`cursor-pointer transition-colors ${
                isDark 
                  ? 'bg-neutral-700 border-neutral-600 text-neutral-300' 
                  : 'bg-white border-gray-300 text-gray-700'
              }`}>
                <SelectItem
                  value="low"
                  className={`cursor-pointer transition-colors ${
                    isDark 
                      ? 'hover:bg-neutral-600 focus:bg-neutral-600' 
                      : 'hover:bg-gray-100 focus:bg-gray-100'
                  }`}
                >
                  Low
                </SelectItem>
                <SelectItem
                  value="medium"
                  className={`cursor-pointer transition-colors ${
                    isDark 
                      ? 'hover:bg-neutral-600 focus:bg-neutral-600' 
                      : 'hover:bg-gray-100 focus:bg-gray-100'
                  }`}
                >
                  Medium
                </SelectItem>
                <SelectItem
                  value="high"
                  className={`cursor-pointer transition-colors ${
                    isDark 
                      ? 'hover:bg-neutral-600 focus:bg-neutral-600' 
                      : 'hover:bg-gray-100 focus:bg-gray-100'
                  }`}
                >
                  High
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className={`flex flex-row gap-2 focus:ring-neutral-500 rounded-xl rounded-t-sm pl-2 max-w-[100%] sm:max-w-[90%] transition-colors ${
            isDark 
              ? 'bg-neutral-700 border-neutral-600 text-neutral-300' 
              : 'bg-gray-100 border-gray-300 text-gray-700'
          }`}>
            <div className="flex flex-row items-center text-sm ml-2">
              <Cpu className="h-4 w-4 mr-2" />
              Model
            </div>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-[150px] bg-transparent border-none cursor-pointer">
                <SelectValue placeholder="Model" />
              </SelectTrigger>
              <SelectContent className={`cursor-pointer transition-colors ${
                isDark 
                  ? 'bg-neutral-700 border-neutral-600 text-neutral-300' 
                  : 'bg-white border-gray-300 text-gray-700'
              }`}>
                <SelectItem
                  value="gemini-2.0-flash"
                  className={`cursor-pointer transition-colors ${
                    isDark 
                      ? 'hover:bg-neutral-600 focus:bg-neutral-600' 
                      : 'hover:bg-gray-100 focus:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-yellow-400" /> 2.0 Flash
                  </div>
                </SelectItem>
                <SelectItem
                  value="gemini-2.5-flash-preview-04-17"
                  className={`cursor-pointer transition-colors ${
                    isDark 
                      ? 'hover:bg-neutral-600 focus:bg-neutral-600' 
                      : 'hover:bg-gray-100 focus:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-orange-400" /> 2.5 Flash
                  </div>
                </SelectItem>
                <SelectItem
                  value="gemini-2.5-pro-preview-05-06"
                  className={`cursor-pointer transition-colors ${
                    isDark 
                      ? 'hover:bg-neutral-600 focus:bg-neutral-600' 
                      : 'hover:bg-gray-100 focus:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    <Cpu className="h-4 w-4 mr-2 text-purple-400" /> 2.5 Pro
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {hasHistory && (
          <Button
            className={`cursor-pointer rounded-xl rounded-t-sm pl-2 transition-colors ${
              isDark 
                ? 'bg-neutral-700 border-neutral-600 text-neutral-300' 
                : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
            }`}
            variant="default"
            onClick={() => window.location.reload()}
          >
            <SquarePen size={16} />
            New Search
          </Button>
        )}
      </div>
    </form>
  );
};
