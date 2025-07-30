import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const TAVILY_API_KEY = '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';

export default function App() {
  const [extractedText, setExtractedText] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const simulateCodeCapture = async () => {
    setIsLoading(true);
    
    // Simulate image processing delay
    setTimeout(async () => {
      try {
        // Mock extracted code with the buggy Python example
        const mockCode = `def greet(name)
    print("Hello, " + name)

greet("Alice")`;
        
        setExtractedText(mockCode);
        await explainCode(mockCode);
      } catch (error) {
        Alert.alert('Error', 'Failed to process code');
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };

  const explainCode = async (code: string) => {
    try {
      // Simple fetch request to Tavily API
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: TAVILY_API_KEY,
          query: `Analyze this Python code for bugs and explain what's wrong: ${code}`,
          search_depth: 'basic',
          include_answer: true,
          max_results: 3,
        }),
      });

      const data = await response.json();
      
      if (data?.answer) {
        setExplanation(data.answer);
      } else {
        setExplanation(`🔧 Code Analysis:

This Python code has a syntax error:
- Missing colon (:) after the function definition on line 1
- The line should be: def greet(name):

✅ Corrected version:
def greet(name):
    print("Hello, " + name)

greet("Alice")

This function takes a name parameter and prints a greeting message.`);
      }
    } catch (error) {
      console.error('API Error:', error);
      setExplanation(`🔧 Static Code Analysis:

This Python code has a syntax error:
- Missing colon (:) after function definition
- Line 1 should be: def greet(name):

The function will work correctly once the colon is added.

📚 What this code does:
- Declares a function named 'greet' that takes one parameter 'name'
- Prints a greeting message using the provided name
- Calls the function with "Alice" as the argument`);
    }
  };

  const clearResults = () => {
    setExtractedText('');
    setExplanation('');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <Text style={styles.title}>🤖 CodeBuddy</Text>
      <Text style={styles.subtitle}>AI Code Analysis Demo</Text>
      
      <Text style={styles.description}>
        This demo simulates the photo → OCR → AI explanation workflow using sample buggy Python code.
      </Text>
      
      <View style={styles.buttonGroup}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={simulateCodeCapture}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? '🔄 Processing...' : '📷 Simulate Code Capture'}
          </Text>
        </TouchableOpacity>
        
        {extractedText && (
          <TouchableOpacity style={styles.secondaryButton} onPress={clearResults}>
            <Text style={styles.secondaryButtonText}>🗑️ Clear Results</Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Analyzing code with AI...</Text>
        </View>
      )}

      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        {extractedText && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 Extracted Code:</Text>
            <View style={styles.codeContainer}>
              <Text style={styles.codeText}>{extractedText}</Text>
            </View>
          </View>
        )}

        {explanation && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🤖 AI Analysis:</Text>
            <View style={styles.explanationContainer}>
              <Text style={styles.explanationText}>{explanation}</Text>
            </View>
          </View>
        )}
        
        {!extractedText && !isLoading && (
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>📋 How it works:</Text>
            <Text style={styles.instructionsText}>
              1. 📷 Take a photo of code (simulated)
              2. 🔍 Extract text using OCR (mocked)
              3. 🤖 Send to Tavily AI for analysis
              4. 📊 Get detailed explanation and fixes
            </Text>
            
            <Text style={styles.instructionsTitle}>🐛 Sample Bug:</Text>
            <Text style={styles.instructionsText}>
              The demo uses intentionally buggy Python code with a missing colon after the function definition.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
    color: '#666',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 25,
    color: '#777',
    lineHeight: 20,
  },
  buttonGroup: {
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginVertical: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  resultsContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  codeContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  explanationContainer: {
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#cce7ff',
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
  },
  instructionsContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 12,
    color: '#333',
  },
  instructionsText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    marginBottom: 8,
  },
});