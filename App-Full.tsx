import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

const TAVILY_API_KEY = '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';

interface OCRResult {
  text: string;
  confidence: number;
}

export default function App() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, setMediaPermission] = useState<MediaLibrary.PermissionResponse | null>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [explanation, setExplanation] = useState('');
  const [complexity, setComplexity] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  React.useEffect(() => {
    (async () => {
      const mediaStatus = await MediaLibrary.requestPermissionsAsync();
      setMediaPermission(mediaStatus);
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        setIsCameraVisible(false);
        if (photo?.uri) {
          await processImage(photo.uri);
        }
      } catch (error) {
        console.error('Camera error:', error);
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const pickImage = async () => {
    try {
      // Request permission first
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const processImage = async (imageUri: string) => {
    setIsLoading(true);
    try {
      // Extract text using mock OCR (in production, you'd use Google Vision API or similar)
      const ocrResult = await mockOCRExtraction(imageUri);
      setExtractedText(ocrResult.text);
      setConfidence(ocrResult.confidence);
      
      if (ocrResult.text.trim()) {
        await explainCode(ocrResult.text);
        const complexityAnalysis = analyzeCodeComplexity(ocrResult.text);
        setComplexity(complexityAnalysis);
      }
    } catch (error) {
      console.error('Image processing error:', error);
      Alert.alert('Error', 'Failed to process image');
    } finally {
      setIsLoading(false);
    }
  };

  const mockOCRExtraction = async (imageUri: string): Promise<OCRResult> => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demo, return the sample buggy Python code
    // In production, you would process the actual image here
    return {
      text: `def greet(name)
    print("Hello, " + name)

greet("Alice")`,
      confidence: 0.92,
    };
  };

  const explainCode = async (code: string) => {
    try {
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: TAVILY_API_KEY,
          query: `Analyze this code for bugs, syntax errors, and provide detailed explanations: ${code}`,
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
        }),
      });

      const data = await response.json();
      
      if (data?.answer) {
        setExplanation(`🤖 AI Code Analysis:\n\n${data.answer}`);
      } else {
        setExplanation(generateFallbackExplanation(code));
      }
    } catch (error) {
      console.error('Tavily API Error:', error);
      setExplanation(generateFallbackExplanation(code));
    }
  };

  const generateFallbackExplanation = (code: string): string => {
    const language = detectLanguage(code);
    
    let issues: string[] = [];
    
    if (language === 'Python') {
      if (code.match(/def\s+\w+\([^)]*\)\s*$/m)) {
        issues.push('Missing colon (:) after function definition');
      }
      if (code.includes('print ') && !code.includes('print(')) {
        issues.push('print statement should use parentheses: print() instead of print');
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
    explanation += `• Test the code in an IDE for detailed error messages`;
    
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

  const analyzeCodeComplexity = (code: string): string => {
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

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const clearResults = () => {
    setExtractedText('');
    setExplanation('');
    setComplexity('');
    setConfidence(0);
  };

  if (!cameraPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Requesting camera permissions...</Text>
      </View>
    );
  }

  if (!cameraPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🤖 CodeBuddy</Text>
        <Text style={styles.message}>We need camera permission to capture code images</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={requestCameraPermission}>
          <Text style={styles.buttonText}>📷 Grant Camera Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isCameraVisible) {
    return (
      <View style={styles.container}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.cameraControls}>
            <TouchableOpacity style={styles.cameraButton} onPress={() => setIsCameraVisible(false)}>
              <Text style={styles.cameraButtonText}>❌ Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <Text style={styles.captureButtonText}>📷</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.cameraButton} onPress={toggleCameraFacing}>
              <Text style={styles.cameraButtonText}>🔄 Flip</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <Text style={styles.title}>🤖 CodeBuddy</Text>
      <Text style={styles.subtitle}>📷 → 🔍 → 🤖 Complete Code Analysis</Text>
      
      <View style={styles.buttonGroup}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={() => setIsCameraVisible(true)}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>📷 Take Photo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={pickImage}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>📁 Pick from Gallery</Text>
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
          <Text style={styles.loadingText}>Processing image and analyzing code...</Text>
        </View>
      )}

      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        {extractedText && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              📝 Extracted Code {confidence > 0 && `(${Math.round(confidence * 100)}% confidence)`}:
            </Text>
            <View style={styles.codeContainer}>
              <Text style={styles.codeText}>{extractedText}</Text>
            </View>
          </View>
        )}

        {complexity && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 Code Metrics:</Text>
            <View style={styles.metricsContainer}>
              <Text style={styles.explanationText}>{complexity}</Text>
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
            <Text style={styles.instructionsTitle}>📋 How to use:</Text>
            <Text style={styles.instructionsText}>
              1. 📷 Take a photo of code or select from gallery
              2. 🔍 OCR extracts text from the image
              3. 🤖 Tavily AI analyzes for bugs and improvements
              4. 📊 Get detailed metrics and explanations
            </Text>
            
            <Text style={styles.instructionsTitle}>✨ Features:</Text>
            <Text style={styles.instructionsText}>
              • Real camera integration with front/back toggle
              • Photo library access for existing images
              • OCR text extraction (currently mocked)
              • AI-powered code analysis with Tavily
              • Code complexity metrics
              • Multi-language support
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
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
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
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    fontWeight: '600',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
    paddingHorizontal: 20,
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  cameraButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    minWidth: 80,
  },
  cameraButtonText: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  captureButton: {
    backgroundColor: '#007AFF',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  captureButtonText: {
    fontSize: 24,
    color: 'white',
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
    textAlign: 'center',
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
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  metricsContainer: {
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ffeaa7',
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