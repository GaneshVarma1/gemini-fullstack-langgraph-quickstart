import React from 'react';
import { Search, BarChart3, FileText, Lightbulb, TrendingUp, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  effort_level: 'low' | 'medium' | 'high';
  model: string;
  icon: React.ReactNode;
}

const promptTemplates: PromptTemplate[] = [
  {
    id: 'market-research',
    title: 'Market Research Analysis',
    description: 'Deep dive into market trends, competitors, and opportunities',
    prompt: 'Conduct a comprehensive market research analysis on {topic}. Include current market size, key players, recent trends, growth projections, challenges, and opportunities. Provide specific data points and cite reliable sources.',
    category: 'business',
    effort_level: 'high',
    model: 'gemini-2.0-flash-thinking-exp',
    icon: <TrendingUp className="w-5 h-5" />
  },
  {
    id: 'technical-explanation',
    title: 'Technical Deep Dive',
    description: 'Explain complex technical concepts with examples',
    prompt: 'Provide a comprehensive technical explanation of {topic}. Break down the core concepts, explain how it works, include practical examples, discuss pros and cons, and mention real-world applications. Make it accessible but thorough.',
    category: 'technology',
    effort_level: 'medium',
    model: 'gemini-2.0-flash-thinking-exp',
    icon: <BookOpen className="w-5 h-5" />
  },
  {
    id: 'data-analysis',
    title: 'Data Analysis & Insights',
    description: 'Analyze trends and extract actionable insights',
    prompt: 'Analyze available data and research on {topic}. Identify key trends, patterns, and correlations. Provide statistical insights, visualizable data points, and actionable recommendations based on the findings.',
    category: 'analysis',
    effort_level: 'high',
    model: 'gemini-2.0-flash-thinking-exp',
    icon: <BarChart3 className="w-5 h-5" />
  },
  {
    id: 'quick-summary',
    title: 'Quick Summary',
    description: 'Get a concise overview of any topic',
    prompt: 'Provide a clear and concise summary of {topic}. Include the most important points, key facts, and essential information someone should know. Keep it informative but brief.',
    category: 'general',
    effort_level: 'low',
    model: 'gemini-2.0-flash-exp',
    icon: <FileText className="w-5 h-5" />
  },
  {
    id: 'innovation-research',
    title: 'Innovation & Future Trends',
    description: 'Explore cutting-edge developments and future possibilities',
    prompt: 'Research the latest innovations and future trends in {topic}. Focus on emerging technologies, breakthrough research, startup activities, and expert predictions. What are the most promising developments?',
    category: 'innovation',
    effort_level: 'high',
    model: 'gemini-2.0-flash-thinking-exp',
    icon: <Lightbulb className="w-5 h-5" />
  },
  {
    id: 'comparative-analysis',
    title: 'Comparative Analysis',
    description: 'Compare options, alternatives, or competing solutions',
    prompt: 'Conduct a detailed comparative analysis of {topic}. Compare different approaches, solutions, or options. Create a pros and cons breakdown, discuss use cases for each, and provide recommendations for different scenarios.',
    category: 'analysis',
    effort_level: 'medium',
    model: 'gemini-2.0-flash-thinking-exp',
    icon: <Search className="w-5 h-5" />
  }
];

interface PromptTemplatesProps {
  onSelectTemplate: (prompt: string, effort: string, model: string) => void;
}

export const PromptTemplates: React.FC<PromptTemplatesProps> = ({ onSelectTemplate }) => {
  const handleTemplateSelect = (template: PromptTemplate) => {
    // Replace {topic} placeholder with a prompt for the user to fill in
    const promptWithPlaceholder = template.prompt.replace('{topic}', '[Enter your topic here]');
    onSelectTemplate(promptWithPlaceholder, template.effort_level, template.model);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'business': return 'bg-blue-500/20 text-blue-400';
      case 'technology': return 'bg-green-500/20 text-green-400';
      case 'analysis': return 'bg-purple-500/20 text-purple-400';
      case 'innovation': return 'bg-orange-500/20 text-orange-400';
      case 'general': return 'bg-neutral-500/20 text-neutral-400';
      default: return 'bg-neutral-500/20 text-neutral-400';
    }
  };

  const getEffortBadge = (effort: string) => {
    switch (effort) {
      case 'low': return 'bg-green-600 text-green-100';
      case 'medium': return 'bg-yellow-600 text-yellow-100';
      case 'high': return 'bg-red-600 text-red-100';
      default: return 'bg-neutral-600 text-neutral-100';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-neutral-100 mb-2">Prompt Templates</h3>
        <p className="text-sm text-neutral-400 mb-4">
          Choose a template to get started with optimized prompts for different research needs.
        </p>
      </div>
      
      <div className="grid gap-3 md:grid-cols-2">
        {promptTemplates.map((template) => (
          <Card key={template.id} className="p-4 bg-neutral-800 border-neutral-700 hover:bg-neutral-750 transition-colors">
            <div className="flex items-start space-x-3">
              <div className="text-neutral-400 mt-1">
                {template.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-neutral-100">{template.title}</h4>
                  <div className="flex space-x-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(template.category)}`}>
                      {template.category}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getEffortBadge(template.effort_level)}`}>
                      {template.effort_level}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-neutral-400 mb-3">{template.description}</p>
                <Button
                  onClick={() => handleTemplateSelect(template)}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                >
                  Use Template
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}; 