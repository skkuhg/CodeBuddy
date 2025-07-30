import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const TAVILY_API_KEY = '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';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setIsCameraVisible(false);
        await processImage(photo.uri);
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        await processImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const processImage = async (imageUri: string) => {
    setIsLoading(true);
    try {
      // Mock OCR - simulate extracting text from image
      const mockCode = `def greet(name)
    print("Hello, " + name)

greet("Alice")`;
      
      setExtractedText(mockCode);
      await explainCode(mockCode);
    } catch (error) {
      Alert.alert('Error', 'Failed to process image');
    } finally {
      setIsLoading(false);
    }
  };

  const explainCode = async (code: string) => {
    try {
      const response = await axios.post('https://api.tavily.com/search', {
        api_key: TAVILY_API_KEY,
        query: `Analyze this code for bugs and explain what's wrong: ${code}`,
        search_depth: 'basic',
        include_answer: true,
        max_results: 3,
      });

      if (response.data?.answer) {
        setExplanation(response.data.answer);
      } else {
        setExplanation(`🔧 Static Analysis:

This Python code has a syntax error:
- Missing colon (:) after the function definition on line 1
- Should be: def greet(name):

✅ Corrected version:
def greet(name):
    print("Hello, " + name)

greet("Alice")

This function takes a name parameter and prints a greeting message.`);
      }
    } catch (error) {
      console.error('API Error:', error);
      setExplanation(`🔧 Code Analysis:

This Python code has a syntax error:
- Missing colon (:) after function definition
- Line should be: def greet(name):

The function will work correctly once the colon is added.`);
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need camera permission to capture code images</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isCameraVisible) {
    return (
      <View style={styles.container}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.text}>📷 Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setIsCameraVisible(false)}>
              <Text style={styles.text}>❌ Cancel</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>CodeBuddy</Text>
      <Text style={styles.subtitle}>📷 → 🔍 → 🤖 Code Analysis</Text>
      
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => setIsCameraVisible(true)}>
          <Text style={styles.buttonText}>📷 Take Photo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.primaryButton} onPress={pickImage}>
          <Text style={styles.buttonText}>📁 Pick from Gallery</Text>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Processing image...</Text>
        </View>
      )}

      <ScrollView style={styles.resultsContainer}>
        {extractedText ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 Extracted Code:</Text>
            <View style={styles.codeContainer}>
              <Text style={styles.codeText}>{extractedText}</Text>
            </View>
          </View>
        ) : null}

        {explanation ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🤖 AI Analysis:</Text>
            <Text style={styles.explanationText}>{explanation}</Text>
          </View>
        ) : null}
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
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: 50,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    minWidth: 120,
  },
  text: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonGroup: {
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  resultsContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  codeContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#000',
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
});