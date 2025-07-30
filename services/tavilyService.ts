import axios from 'axios';

const TAVILY_API_KEY = process.env.TAVILY_API_KEY || 'your_tavily_api_key_here';
const TAVILY_API_URL = 'https://api.tavily.com/search';

export interface TavilySearchRequest {
  query: string;
  search_depth?: 'basic' | 'advanced';
  include_answer?: boolean;
  include_raw_content?: boolean;
  max_results?: number;
  include_domains?: string[];
  exclude_domains?: string[];
}

export interface TavilySearchResponse {
  answer: string;
  query: string;
  response_time: number;
  images: string[];
  results: Array<{
    title: string;
    url: string;
    content: string;
    raw_content?: string;
    score: number;
  }>;
}

export const explainCodeWithTavily = async (code: string): Promise<string> => {
  try {
    const searchRequest: TavilySearchRequest = {
      query: `Analyze this code for bugs, syntax errors, and provide explanations. Code: ${code}`,
      search_depth: 'basic',
      include_answer: true,
      include_raw_content: false,
      max_results: 5,
      include_domains: [
        'stackoverflow.com',
        'python.org',
        'javascript.info',
        'developer.mozilla.org',
        'docs.python.org'
      ],
      exclude_domains: []
    };

    const response = await axios.post<TavilySearchResponse>(TAVILY_API_URL, {
      api_key: TAVILY_API_KEY,
      ...searchRequest
    });

    if (response.data && response.data.answer) {
      return formatCodeExplanation(response.data.answer, response.data.results);
    } 
    
    // Fallback if no answer provided
    if (response.data.results && response.data.results.length > 0) {
      return formatResultsAsExplanation(code, response.data.results);
    }

    return generateFallbackExplanation(code);
    
  } catch (error) {
    console.error('Tavily API Error:', error);
    return generateFallbackExplanation(code);
  }
};

const formatCodeExplanation = (answer: string, results: any[]): string => {
  let explanation = `🤖 AI Code Analysis:\n\n${answer}`;
  
  if (results && results.length > 0) {
    explanation += `\n\n📚 Additional Resources:\n`;
    results.slice(0, 3).forEach((result, index) => {
      explanation += `${index + 1}. ${result.title}\n   ${result.url}\n\n`;
    });
  }
  
  return explanation;
};

const formatResultsAsExplanation = (code: string, results: any[]): string => {
  let explanation = `🔍 Code Analysis Results:\n\n`;
  
  // Try to identify the programming language
  const language = detectLanguage(code);
  explanation += `Language: ${language}\n\n`;
  
  // Use the first few results to build an explanation
  results.slice(0, 2).forEach((result, index) => {
    explanation += `${index + 1}. ${result.title}\n${result.content.substring(0, 200)}...\n\n`;
  });
  
  return explanation;
};

const detectLanguage = (code: string): string => {
  if (code.includes('def ') && code.includes('print(')) return 'Python';
  if (code.includes('function ') || code.includes('console.log')) return 'JavaScript';
  if (code.includes('public class ') || code.includes('System.out.println')) return 'Java';
  if (code.includes('#include') || code.includes('cout <<')) return 'C++';
  if (code.includes('fn ') && code.includes('println!')) return 'Rust';
  return 'Unknown';
};

const generateFallbackExplanation = (code: string): string => {
  const language = detectLanguage(code);
  
  // Basic static analysis for common errors
  let issues: string[] = [];
  
  if (language === 'Python') {
    if (code.includes('def ') && !code.includes('def ') && !code.includes(':')) {
      issues.push('Missing colon (:) after function definition');
    }
    if (code.match(/def\s+\w+\([^)]*\)\s*$/m)) {
      issues.push('Function definition is missing a colon (:) at the end');
    }
    if (code.includes('print ') && !code.includes('print(')) {
      issues.push('print statement should use parentheses: print() instead of print');
    }
  }
  
  if (language === 'JavaScript') {
    if (code.includes('function ') && !code.includes('{')) {
      issues.push('Function definition is missing opening brace {');
    }
    if ((code.match(/\{/g) || []).length !== (code.match(/\}/g) || []).length) {
      issues.push('Mismatched braces {} - check opening and closing braces');
    }
  }
  
  let explanation = `🔧 Static Code Analysis:\n\n`;
  explanation += `Language: ${language}\n\n`;
  
  if (issues.length > 0) {
    explanation += `❌ Issues Found:\n`;
    issues.forEach((issue, index) => {
      explanation += `${index + 1}. ${issue}\n`;
    });
    explanation += `\n`;
  } else {
    explanation += `✅ No obvious syntax errors detected.\n\n`;
  }
  
  explanation += `💡 Suggestions:\n`;
  explanation += `• Double-check syntax for ${language}\n`;
  explanation += `• Ensure proper indentation\n`;
  explanation += `• Verify all brackets/parentheses are matched\n`;
  explanation += `• Test the code in an IDE for detailed error messages\n`;
  
  return explanation;
};

// Additional utility functions for code analysis
export const analyzeCodeComplexity = (code: string): string => {
  const lines = code.split('\n').filter(line => line.trim().length > 0);
  const functions = (code.match(/def\s+\w+|function\s+\w+/g) || []).length;
  const loops = (code.match(/for\s+|while\s+/g) || []).length;
  const conditions = (code.match(/if\s+|else|elif/g) || []).length;
  
  return `📊 Code Metrics:
• Lines of code: ${lines.length}
• Functions: ${functions}
• Loops: ${loops}
• Conditions: ${conditions}
• Estimated complexity: ${functions + loops + conditions > 5 ? 'High' : functions + loops + conditions > 2 ? 'Medium' : 'Low'}`;
};

export const suggestImprovements = (code: string): string[] => {
  const suggestions: string[] = [];
  
  if (code.length < 50) {
    suggestions.push('Consider adding comments to explain the code purpose');
  }
  
  if (!code.includes('//') && !code.includes('#')) {
    suggestions.push('Add comments to improve code readability');
  }
  
  if (code.includes('TODO') || code.includes('FIXME')) {
    suggestions.push('Address TODO/FIXME comments in the code');
  }
  
  return suggestions;
};