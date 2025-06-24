import React, { useState } from 'react';
import { InputForm } from "./InputForm";
import { Upload, Search, BarChart3, FileText, Lightbulb, TrendingUp, BookOpen, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useTheme } from '@/contexts/ThemeContext';

interface EnhancedWelcomeScreenProps {
  handleSubmit: (
    submittedInputValue: string,
    effort: string,
    model: string
  ) => void;
  onCancel: () => void;
  isLoading: boolean;
}

interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  effort_level: 'low' | 'medium' | 'high';
  model: string;
  icon: React.ComponentType<{ className?: string }>;
}

const promptTemplates: PromptTemplate[] = [
  {
    id: 'market-research',
    title: 'Market Research Analysis',
    description: 'Deep dive into market trends, competitors, and opportunities',
    prompt: 'Conduct a comprehensive market research analysis on [Enter your topic here]. Include current market size, key players, recent trends, growth projections, challenges, and opportunities. Provide specific data points and cite reliable sources.',
    category: 'business',
    effort_level: 'high',
    model: 'gemini-2.0-flash-thinking-exp',
    icon: TrendingUp
  },
  {
    id: 'technical-explanation',
    title: 'Technical Deep Dive',
    description: 'Explain complex technical concepts with examples',
    prompt: 'Provide a comprehensive technical explanation of [Enter your topic here]. Break down the core concepts, explain how it works, include practical examples, discuss pros and cons, and mention real-world applications. Make it accessible but thorough.',
    category: 'technology',
    effort_level: 'medium',
    model: 'gemini-2.0-flash-thinking-exp',
    icon: BookOpen
  },
  {
    id: 'data-analysis',
    title: 'Data Analysis & Insights',
    description: 'Analyze trends and extract actionable insights',
    prompt: 'Analyze available data and research on [Enter your topic here]. Identify key trends, patterns, and correlations. Provide statistical insights, visualizable data points, and actionable recommendations based on the findings.',
    category: 'analysis',
    effort_level: 'high',
    model: 'gemini-2.0-flash-thinking-exp',
    icon: BarChart3
  },
  {
    id: 'quick-summary',
    title: 'Quick Summary',
    description: 'Get a concise overview of any topic',
    prompt: 'Provide a clear and concise summary of [Enter your topic here]. Include the most important points, key facts, and essential information someone should know. Keep it informative but brief.',
    category: 'general',
    effort_level: 'low',
    model: 'gemini-2.0-flash-exp',
    icon: FileText
  },
  {
    id: 'innovation-research',
    title: 'Innovation & Future Trends',
    description: 'Explore cutting-edge developments and future possibilities',
    prompt: 'Research the latest innovations and future trends in [Enter your topic here]. Focus on emerging technologies, breakthrough research, startup activities, and expert predictions. What are the most promising developments?',
    category: 'innovation',
    effort_level: 'high',
    model: 'gemini-2.0-flash-thinking-exp',
    icon: Lightbulb
  },
  {
    id: 'comparative-analysis',
    title: 'Comparative Analysis',
    description: 'Compare options, alternatives, or competing solutions',
    prompt: 'Conduct a detailed comparative analysis of [Enter your topic here]. Compare different approaches, solutions, or options. Create a pros and cons breakdown, discuss use cases for each, and provide recommendations for different scenarios.',
    category: 'analysis',
    effort_level: 'medium',
    model: 'gemini-2.0-flash-thinking-exp',
    icon: Search
  }
];

export const EnhancedWelcomeScreen: React.FC<EnhancedWelcomeScreenProps> = ({
  handleSubmit,
  onCancel,
  isLoading,
}) => {
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const { isDark, toggleTheme } = useTheme();

  const handleTemplateSelect = (template: PromptTemplate) => {
    setSelectedPrompt(template.prompt);
  };

  const handleSubmitWithTemplate = (submittedInputValue: string, effort: string, model: string) => {
    handleSubmit(submittedInputValue, effort, model);
  };

  const getCategoryColor = (category: string) => {
    if (isDark) {
      switch (category) {
        case 'business': return 'bg-gradient-to-r from-blue-500/20 to-blue-600/30 text-blue-300 border border-blue-400/20 shadow-sm';
        case 'technology': return 'bg-gradient-to-r from-green-500/20 to-green-600/30 text-green-300 border border-green-400/20 shadow-sm';
        case 'analysis': return 'bg-gradient-to-r from-purple-500/20 to-purple-600/30 text-purple-300 border border-purple-400/20 shadow-sm';
        case 'innovation': return 'bg-gradient-to-r from-orange-500/20 to-orange-600/30 text-orange-300 border border-orange-400/20 shadow-sm';
        case 'general': return 'bg-gradient-to-r from-neutral-500/20 to-neutral-600/30 text-neutral-300 border border-neutral-400/20 shadow-sm';
        default: return 'bg-gradient-to-r from-neutral-500/20 to-neutral-600/30 text-neutral-300 border border-neutral-400/20 shadow-sm';
      }
    } else {
      switch (category) {
        case 'business': return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300/50 shadow-sm';
        case 'technology': return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300/50 shadow-sm';
        case 'analysis': return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300/50 shadow-sm';
        case 'innovation': return 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border border-orange-300/50 shadow-sm';
        case 'general': return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300/50 shadow-sm';
        default: return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300/50 shadow-sm';
      }
    }
  };

  const getEffortBadge = (effort: string) => {
    if (isDark) {
      switch (effort) {
        case 'low': return 'bg-gradient-to-r from-green-600 to-green-700 text-green-50 shadow-lg border border-green-500/30';
        case 'medium': return 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-yellow-50 shadow-lg border border-yellow-500/30';
        case 'high': return 'bg-gradient-to-r from-red-600 to-red-700 text-red-50 shadow-lg border border-red-500/30';
        default: return 'bg-gradient-to-r from-neutral-600 to-neutral-700 text-neutral-50 shadow-lg border border-neutral-500/30';
      }
    } else {
      switch (effort) {
        case 'low': return 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg border border-green-400/30';
        case 'medium': return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg border border-yellow-400/30';
        case 'high': return 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg border border-red-400/30';
        default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg border border-gray-400/30';
      }
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6 py-8 transition-colors duration-300">
      {/* Centered Header */}
      <div className="mb-8 space-y-4">
        {/* Logo */}
        <div className="flex justify-center">
          <h2 className={`text-4xl font-bold tracking-tight transition-colors ${
            isDark ? 'text-white' : 'text-black'
          }`}>
            udio
          </h2>
        </div>
        
        <div className="space-y-2">
          <h1 className={`text-xl md:text-2xl font-semibold transition-colors ${
            isDark ? 'text-neutral-100' : 'text-gray-900'
          }`}>
            Enhanced Research Assistant
          </h1>
          <p className={`text-sm max-w-md mx-auto transition-colors ${
            isDark ? 'text-neutral-400' : 'text-gray-600'
          }`}>
            AI-powered research with smart templates
          </p>
        </div>
      </div>

      {/* Theme Toggle - Moved to a subtle position */}
      <div className={`absolute top-6 right-6 flex items-center space-x-2 backdrop-blur-sm rounded-full p-2 border transition-colors ${
        isDark 
          ? 'bg-neutral-800/50 border-neutral-700/50' 
          : 'bg-white/50 border-gray-300/50'
      }`}>
        <Sun className={`h-3 w-3 transition-colors ${isDark ? 'text-neutral-500' : 'text-yellow-500'}`} />
        <button
          onClick={toggleTheme}
          className={`w-8 h-4 rounded-full relative transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 ${
            isDark ? 'bg-neutral-700' : 'bg-gray-300'
          }`}
        >
          <div
            className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${
              isDark ? 'translate-x-4' : 'translate-x-0.5'
            }`}
          />
        </button>
        <Moon className={`h-3 w-3 transition-colors ${isDark ? 'text-blue-400' : 'text-neutral-500'}`} />
      </div>

      {/* Centered Chat Options */}
      <div className="w-full max-w-4xl mx-auto">
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className={`grid w-full grid-cols-3 mb-8 backdrop-blur-sm border h-12 transition-colors ${
            isDark 
              ? 'bg-neutral-800/50 border-neutral-700/50' 
              : 'bg-white/50 border-gray-300/50'
          }`}>
            <TabsTrigger value="chat" className="text-sm font-medium">Quick Chat</TabsTrigger>
            <TabsTrigger value="templates" className="text-sm font-medium">Smart Templates</TabsTrigger>
            <TabsTrigger value="files" className="text-sm font-medium">File Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-6">
            <div className="w-full max-w-2xl mx-auto text-center">
              <div className="space-y-3 mb-8">
                <h3 className={`text-lg font-semibold transition-colors ${
                  isDark ? 'text-neutral-100' : 'text-black'
                }`}>Ask Anything</h3>
                <p className={`text-sm transition-colors ${
                  isDark ? 'text-neutral-400' : 'text-gray-600'
                }`}>
                  Get comprehensive research with web sources and citations
                </p>
              </div>
              <InputForm
                onSubmit={handleSubmitWithTemplate}
                isLoading={isLoading}
                onCancel={onCancel}
                hasHistory={false}
                initialValue={selectedPrompt}
              />
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className={`text-xl font-semibold mb-2 transition-colors ${
                  isDark ? 'text-neutral-100' : 'text-black'
                }`}>Smart Research Templates</h3>
                <p className={`max-w-2xl mx-auto transition-colors ${
                  isDark ? 'text-neutral-400' : 'text-gray-600'
                }`}>
                  Choose from expertly crafted templates optimized for different research scenarios and goals.
                </p>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
                {promptTemplates.map((template) => {
                  const IconComponent = template.icon;
                  return (
                                        <Card key={template.id} className={`group relative p-6 hover:scale-[1.02] transition-all duration-500 backdrop-blur-sm overflow-hidden ${
                      isDark 
                        ? 'bg-gradient-to-br from-neutral-800/60 to-neutral-900/40 border-neutral-700/50 hover:border-neutral-600/70 hover:shadow-2xl hover:shadow-neutral-900/50' 
                        : 'bg-gradient-to-br from-white/90 to-gray-50/80 border-gray-200/60 hover:border-gray-300/80 shadow-lg hover:shadow-2xl hover:shadow-gray-900/10'
                    }`}>
                      {/* Subtle gradient overlay */}
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                        isDark 
                          ? 'bg-gradient-to-br from-blue-500/5 to-purple-500/5' 
                          : 'bg-gradient-to-br from-blue-50/50 to-purple-50/50'
                      }`} />
                      
                      <div className="relative z-10">
                        {/* Header with icon and badges */}
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-xl transition-all duration-300 group-hover:scale-110 ${
                            isDark 
                              ? 'text-neutral-300 bg-gradient-to-br from-neutral-700/80 to-neutral-800/60 shadow-lg' 
                              : 'text-gray-700 bg-gradient-to-br from-gray-100 to-gray-200/80 shadow-md'
                          }`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          
                          <div className="flex flex-col space-y-2">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-300 ${getCategoryColor(template.category)}`}>
                              {template.category}
                            </span>
                            <span className={`px-3 py-1 text-xs font-bold rounded-full transition-all duration-300 ${getEffortBadge(template.effort_level)}`}>
                              {template.effort_level}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-4">
                          <h4 className={`text-lg font-bold leading-tight transition-colors ${
                            isDark ? 'text-neutral-100 group-hover:text-white' : 'text-gray-900 group-hover:text-gray-800'
                          }`}>
                            {template.title}
                          </h4>
                          
                          <p className={`text-sm leading-relaxed line-clamp-3 transition-colors ${
                            isDark ? 'text-neutral-400 group-hover:text-neutral-300' : 'text-gray-600 group-hover:text-gray-700'
                          }`}>
                            {template.description}
                          </p>
                          
                          {/* Action button */}
                          <Button
                            onClick={() => handleTemplateSelect(template)}
                            variant="outline"
                            size="sm"
                            className={`w-full text-sm font-semibold py-3 transition-all duration-300 group-hover:scale-105 ${
                              isDark 
                                ? 'bg-gradient-to-r from-neutral-700/50 to-neutral-600/50 hover:from-neutral-600/70 hover:to-neutral-500/70 border-neutral-600/50 hover:border-neutral-500/70 text-neutral-200 hover:text-white' 
                                : 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-50 hover:to-indigo-50 border-gray-300/60 hover:border-blue-300/60 text-gray-700 hover:text-blue-700'
                            }`}
                          >
                            <span className="flex items-center justify-center space-x-2">
                              <span>Use Template</span>
                              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </span>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
              
              {selectedPrompt && (
                <div className={`w-full max-w-3xl mx-auto mt-8 p-6 backdrop-blur-sm rounded-xl border transition-colors ${
                  isDark 
                    ? 'bg-neutral-800/30 border-neutral-700/50' 
                    : 'bg-white/50 border-gray-300/50'
                }`}>
                  <h4 className={`text-lg font-medium mb-4 text-center transition-colors ${
                    isDark ? 'text-neutral-200' : 'text-gray-800'
                  }`}>Selected Template Ready</h4>
                  <InputForm
                    onSubmit={handleSubmitWithTemplate}
                    isLoading={isLoading}
                    onCancel={onCancel}
                    hasHistory={false}
                    initialValue={selectedPrompt}
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="files" className="space-y-6">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className={`text-xl font-semibold mb-2 transition-colors ${
                  isDark ? 'text-neutral-100' : 'text-black'
                }`}>Document Analysis</h3>
                <p className={`max-w-2xl mx-auto transition-colors ${
                  isDark ? 'text-neutral-400' : 'text-gray-600'
                }`}>
                  Upload documents, PDFs, spreadsheets, or images to analyze and ask intelligent questions about your content.
                </p>
              </div>
              
              <div className="max-w-2xl mx-auto">
                <div className="border-2 border-dashed border-neutral-600/50 rounded-xl p-10 text-center hover:border-neutral-500/50 transition-all duration-300 bg-neutral-800/20 backdrop-blur-sm">
                  <Upload className="w-16 h-16 mx-auto mb-6 text-neutral-400" />
                  <p className="text-neutral-300 mb-2 text-lg font-medium">
                    Drag & drop files here, or click to select
                  </p>
                  <p className="text-sm text-neutral-500 mb-6">
                    Supports PDF, DOCX, CSV, Excel, images, and text files (max 50MB each)
                  </p>
                  <Button variant="outline" className="mb-4 bg-neutral-700/30 hover:bg-neutral-600/50 border-neutral-600/50">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                  </Button>
                  <p className="text-xs text-neutral-600">
                    Advanced file processing with AI analysis is fully operational!
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className={`text-xs transition-colors ${
          isDark ? 'text-neutral-500' : 'text-gray-500'
        }`}>
          Powered by Google Gemini, LangChain LangGraph, and enhanced with AI research tools
        </p>
      </div>
    </div>
  );
}; 