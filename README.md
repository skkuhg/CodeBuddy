# 📱 CodeBuddy

> An AI-powered mobile application that extracts code from images and provides intelligent analysis using advanced OCR and AI technologies.

[![React Native](https://img.shields.io/badge/React%20Native-0.79.5-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-53.0.0-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Features

- **📸 Smart OCR**: Extract code from images using multiple OCR services
- **🤖 AI Analysis**: Intelligent code explanation and bug detection
- **⚡ Multi-API Support**: OpenAI Vision, Tavily AI, OCR.space, and Azure Vision
- **🔍 Code Detection**: Automatic programming language detection
- **📊 Complexity Analysis**: Code metrics and improvement suggestions
- **🔒 Secure**: Environment-based API key management
- **📱 Cross-Platform**: Works on iOS, Android, and Web

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- React Native development environment
- API keys for desired services (see [API Setup](#-api-setup))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/skkuhg/CodeBuddy-Mobile.git
   cd CodeBuddy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your API keys (see [API Setup](#-api-setup))

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on your device**
   - Install [Expo Go](https://expo.dev/client) on your mobile device
   - Scan the QR code displayed in terminal/browser
   - Or use `npm run ios` / `npm run android` for simulators

## 🔑 API Setup

CodeBuddy supports multiple OCR and AI services. Configure the ones you want to use:

### Required APIs

#### OpenAI API (Recommended)
- Get your API key: [OpenAI Platform](https://platform.openai.com/api-keys)
- Add to `.env`: `OPENAI_API_KEY=sk-your-key-here`
- Used for: GPT-4 Vision OCR and code analysis

#### Tavily AI (Recommended)
- Get your API key: [Tavily App](https://app.tavily.com/)
- Add to `.env`: `TAVILY_API_KEY=tvly-your-key-here`
- Used for: Code explanation and web-based analysis

### Optional APIs (Fallbacks)

#### OCR.space (Free Tier Available)
- Get your API key: [OCR.space](https://ocr.space/ocrapi)
- Add to `.env`: `OCR_SPACE_API_KEY=your-key-here`

#### Azure Computer Vision
- Get your key: [Azure Portal](https://portal.azure.com/)
- Add to `.env`: 
  ```
  AZURE_VISION_API_KEY=your-key-here
  AZURE_VISION_ENDPOINT=your-endpoint-here
  ```

#### Google Cloud Vision
- Get your key: [Google Cloud Console](https://console.cloud.google.com/)
- Add to `.env`: `GOOGLE_VISION_API_KEY=your-key-here`

## 📖 How to Use

1. **Launch the app** on your device
2. **Take a photo** or **select an image** containing code
3. **Wait for OCR processing** - the app will extract text from the image
4. **View the analysis** - get explanations, bug reports, and suggestions
5. **Review code metrics** - see complexity analysis and improvements

## 🏗️ Architecture

```
CodeBuddy/
├── services/
│   ├── tavilyService.ts      # Tavily AI integration
│   ├── realOCRService.ts     # OpenAI Vision + fallback OCRs
│   └── ocrService.ts         # Google Vision + mock OCR
├── App.tsx                   # Main application component
├── assets/                   # Images and icons
└── .env.example             # Environment variables template
```

### Service Priority
1. **OpenAI Vision API** (Primary - highest accuracy)
2. **OCR.space** (Fallback 1 - free tier available)
3. **Azure Vision** (Fallback 2 - enterprise grade)
4. **Smart Mock** (Fallback 3 - demo purposes)

## 🛠️ Development

### Available Scripts

```bash
npm start          # Start Expo development server
npm run android    # Run on Android device/emulator
npm run ios        # Run on iOS device/simulator
npm run web        # Run in web browser
```

### Project Structure

- **App Components**: Multiple app variants (Safe, Simple, Full, Modern UI)
- **Services**: Modular API integration services
- **Configuration**: Babel, TypeScript, and Expo configurations
- **Assets**: App icons and images

### Code Style

- TypeScript for type safety
- Modular service architecture
- Environment-based configuration
- Error handling and fallbacks

## 🔧 Troubleshooting

### Common Issues

**OCR Not Working**
- Verify API keys are correctly set in `.env`
- Check network connectivity
- Ensure image quality is sufficient

**App Won't Start**
- Run `npm install` to ensure dependencies are installed
- Clear Expo cache: `expo start -c`
- Check Node.js version compatibility

**API Errors**
- Verify API key format and permissions
- Check API quotas and billing
- Review service-specific documentation

### Debug Mode

Enable detailed logging by checking the console output when using the app in development mode.

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

### Development Setup
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Guidelines
- Follow TypeScript best practices
- Add proper error handling
- Update documentation for new features
- Test on multiple devices/platforms

## 🔒 Security

- Never commit API keys to the repository
- Use environment variables for all sensitive data
- Review the `.gitignore` file to ensure security
- Regularly rotate API keys

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**CodeBuddy Team**
- GitHub: [@skkuhg](https://github.com/skkuhg)

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) for GPT-4 Vision API
- [Tavily](https://tavily.com/) for AI-powered search and analysis
- [Expo](https://expo.dev/) for the development platform
- [React Native](https://reactnative.dev/) community

## 📈 Roadmap

- [ ] Add support for more programming languages
- [ ] Implement code syntax highlighting in results
- [ ] Add offline OCR capabilities
- [ ] Create web version of the app
- [ ] Add code history and favorites
- [ ] Implement user accounts and cloud sync

---

⭐ **Star this repo if you find it helpful!**

For support or questions, please [open an issue](https://github.com/skkuhg/CodeBuddy/issues).
