
import React, { useState, useEffect, useRef, useCallback } from 'react';

function STT() {
  // --- State Variables ---
  const [isRecording, setIsRecording] = useState(false);
  const [voiceOutputText, setVoiceOutputText] = useState('Click the microphone to start speaking...');
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [aiVoiceResponseAreaVisible, setAiVoiceResponseAreaVisible] = useState(false);
  const [aiVoiceTextOutput, setAiVoiceTextOutput] = useState('');
  const [speakAiVoiceBtnDisabled, setSpeakAiVoiceBtnDisabled] = useState(true);
  const [stopAiVoiceBtnDisabled, setStopAiVoiceBtnDisabled] = useState(true);
  const [deleteVoiceResponseBtnDisabled, setDeleteVoiceResponseBtnDisabled] = useState(true);

  const [grammarInputText, setGrammarInputText] = useState('');
  const [grammarOutputText, setGrammarOutputText] = useState('');
  const [grammarLoading, setGrammarLoading] = useState(false);
  const [speakGrammarBtnDisabled, setSpeakGrammarBtnDisabled] = useState(true);
  const [stopGrammarBtnDisabled, setStopGrammarBtnDisabled] = useState(true);
  const [deleteGrammarBtnDisabled, setDeleteGrammarBtnDisabled] = useState(true);

  const [uploadedImageSrc, setUploadedImageSrc] = useState('');
  const [uploadedImageVisible, setUploadedImageVisible] = useState(false);
  const [base64ImageData, setBase64ImageData] = useState('');
  const [imageQuestionText, setImageQuestionText] = useState('');
  const [imageAnswerText, setImageAnswerText] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [speakImageBtnDisabled, setSpeakImageBtnDisabled] = useState(true);
  const [stopImageBtnDisabled, setStopImageBtnDisabled] = useState(true);
  const [deleteImageBtnDisabled, setDeleteImageBtnDisabled] = useState(true);

  const [chatHistory, setChatHistory] = useState([
    { role: "model", parts: [{ text: "Hello! How can I help you with your language learning today?" }] }
  ]);
  const [chatInputText, setChatInputText] = useState('');
  const [sendChatBtnDisabled, setSendChatBtnDisabled] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const [theme, setTheme] = useState('dark'); // 'dark' or 'light'

  // --- Refs ---
  const grammarInputRef = useRef(null);
  const imageUploadRef = useRef(null);
  const imageQuestionRef = useRef(null);
  const chatInputRef = useRef(null);
  const chatDisplayRef = useRef(null); // Ref for chat scroll
  const inputLanguageSelectRef = useRef(null);


  // --- Selectors ---
  const voiceResponseLanguageSelectRef = useRef(null);
  const aiRoleSelectRef = useRef(null);

  // --- Speech Recognition Instance ---
  const recognitionRef = useRef(null);

  // --- Utility Functions ---

  // Text-to-Speech (TTS) Utility Function
  const speakText = useCallback((text, speakButtonSetter, stopButtonSetter, lang = 'en-US') => {
    // Corrected the condition to check for 'speechSynthesis' in window
    if (!('speechSynthesis' in window)) {
      console.warn('Text-to-Speech not supported in this browser.');
      return;
    }

    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => voice.lang === lang && (voice.name.includes('Google') || voice.default));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    } else {
      console.warn(`No preferred voice found for language: ${lang}. Using default.`);
    }

    utterance.onstart = () => {
      speakButtonSetter(true); // Disable speak button
      stopButtonSetter(false); // Enable stop button
    };
    utterance.onend = () => {
      speakButtonSetter(false); // Enable speak button
      stopButtonSetter(true); // Disable stop button
    };
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      speakButtonSetter(false); // Enable speak button
      stopButtonSetter(true); // Disable stop button
    };

    speechSynthesis.speak(utterance);
  }, []); // No dependencies as it uses fixed window objects

  // Stop Speaking Utility Function
  const stopSpeaking = useCallback((speakButtonSetter, stopButtonSetter) => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    speakButtonSetter(false); // Enable speak button
    stopButtonSetter(true); // Disable stop button
  }, []);

  // --- Handlers for Features ---

  // Voice Recognition
  const handleMicButtonClick = useCallback(() => {
    if (!recognitionRef.current) {
      console.error('Speech Recognition not initialized.');
      return;
    }

    if (!isRecording) {
      recognitionRef.current.start();
    } else {
      recognitionRef.current.stop();
    }
  }, [isRecording]);

  // Grammar Correction
  const handleAnalyzeGrammar = useCallback(async () => {
    const text = grammarInputText.trim();
    if (!text) {
      setGrammarOutputText('Please enter some text to analyze.');
      setSpeakGrammarBtnDisabled(true);
      setStopGrammarBtnDisabled(true);
      setDeleteGrammarBtnDisabled(true);
      return;
    }

    setGrammarOutputText('');
    setGrammarLoading(true);
    setSpeakGrammarBtnDisabled(true);
    setStopGrammarBtnDisabled(true);
    setDeleteGrammarBtnDisabled(true);
    speechSynthesis.cancel();

    try {
      const prompt = `As an expert English grammar and language tutor, please analyze the following sentence for any grammatical errors, spelling mistakes, and provide a clear explanation of the tenses used. If there are errors, suggest corrections. If the sentence is grammatically correct, state that and explain its tense.

      Sentence: "${text}"

      Format your response clearly, first stating corrections (if any), then explaining the tense(s) in simple terms.`;

      const currentChatHistory = [{ role: "user", parts: [{ text: prompt }] }];
      const payload = { contents: currentChatHistory };
      const apiKey = "AIzaSyD_S8DL9nWtmpUx9XWa_CM_4YBaD2XlAWE"; 
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
        const aiText = result.candidates[0].content.parts[0].text;
        setGrammarOutputText(aiText.replace(/\n/g, '<br>'));
        setSpeakGrammarBtnDisabled(false);
        setDeleteGrammarBtnDisabled(false);
      } else {
        setGrammarOutputText('Failed to get a response from AI. Please try again.');
        console.error('Unexpected AI response structure:', result);
        setSpeakGrammarBtnDisabled(true);
        setDeleteGrammarBtnDisabled(true);
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setGrammarOutputText('An error occurred while analyzing. Please try again later.');
      setSpeakGrammarBtnDisabled(true);
      setDeleteGrammarBtnDisabled(true);
    } finally {
      setGrammarLoading(false);
    }
  }, [grammarInputText]);

  // Image Understanding
  const handleImageUploadChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImageSrc(e.target.result);
        setUploadedImageVisible(true);
        setBase64ImageData(e.target.result.split(',')[1]);
        setImageAnswerText('');
        setSpeakImageBtnDisabled(true);
        setStopImageBtnDisabled(true);
        setDeleteImageBtnDisabled(true);
      };
      reader.readAsDataURL(file);
    } else {
      setUploadedImageSrc('');
      setUploadedImageVisible(false);
      setBase64ImageData('');
      setImageAnswerText('');
      setSpeakImageBtnDisabled(true);
      setStopImageBtnDisabled(true);
      setDeleteImageBtnDisabled(true);
    }
  }, []);

  const handleAskImageQuestion = useCallback(async () => {
    const question = imageQuestionText.trim();
    if (!base64ImageData) {
      setImageAnswerText('Please upload an image first.');
      setSpeakImageBtnDisabled(true);
      setStopImageBtnDisabled(true);
      setDeleteImageBtnDisabled(true);
      return;
    }
    if (!question) {
      setImageAnswerText('Please ask a question about the image.');
      setSpeakImageBtnDisabled(true);
      setStopImageBtnDisabled(true);
      setDeleteImageBtnDisabled(true);
      return;
    }

    setImageAnswerText('');
    setImageLoading(true);
    setSpeakImageBtnDisabled(true);
    setStopImageBtnDisabled(true);
    setDeleteImageBtnDisabled(true);
    speechSynthesis.cancel();

    try {
      const currentChatHistory = [{
        role: "user",
        parts: [
          { text: question },
          {
            inlineData: {
              mimeType: uploadedImageSrc.split(';')[0].split(':')[1],
              data: base64ImageData
            }
          }
        ]
      }];

      const payload = { contents: currentChatHistory };
      const apiKey = "AIzaSyD_S8DL9nWtmpUx9XWa_CM_4YBaD2XlAWE"; 
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
        const aiText = result.candidates[0].content.parts[0].text;
        setImageAnswerText(aiText.replace(/\n/g, '<br>'));
        setSpeakImageBtnDisabled(false);
        setDeleteImageBtnDisabled(false);
      } else {
        setImageAnswerText('Failed to get a response from AI. Please try again.');
        console.error('Unexpected AI response structure:', result);
        setSpeakImageBtnDisabled(true);
        setDeleteImageBtnDisabled(true);
      }
    } catch (error) {
      console.error('Error calling Gemini API for image understanding:', error);
      setImageAnswerText('An error occurred while processing the image. Please try again later.');
      setSpeakImageBtnDisabled(true);
      setDeleteImageBtnDisabled(true);
    } finally {
      setImageLoading(false);
    }
  }, [base64ImageData, imageQuestionText, uploadedImageSrc]);

  // Conversational Chat
const addChatMessage = useCallback(async (text, sender) => {
  if (sender === 'ai') {
    let animatedText = '';
    
    // Add the AI message with placeholder once, and update during animation
    setChatHistory(prev => {
      const updated = [...prev, { role: 'model', parts: [{ text: '' }] }];
      return updated;
    });

    for (let i = 0; i <= text.length; i++) {
      const currentText = text.slice(0, i);

      setChatHistory(prev => {
        const updated = [...prev];
        // Only update the last message
        updated[updated.length-1] = {
          role: 'model',
          parts: [{ text: currentText }]
        }; 
        return updated;
      });

      await new Promise(resolve => setTimeout(resolve, 20));
      if (chatDisplayRef.current) {
        chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
      }
    }
  } else {
    // User message: append once
    setChatHistory(prev => [...prev, { role: 'user', parts: [{ text }] }]);
    if (chatDisplayRef.current) {
      chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
    }
  }
}, []);


  const initializeChat = useCallback(() => {
    setChatHistory([{ role: "model", parts: [{ text: "Hello! How can I help you with your language learning today?" }] }]);
    // No need to call addChatMessage here, as chatHistory state update will re-render
  }, []);

  const handleSendChat = useCallback(async () => {
    const userMessage = chatInputText.trim();
    if (!userMessage) return;

    addChatMessage(userMessage, 'user');
    setChatInputText('');
    setSendChatBtnDisabled(true);
    setChatLoading(true);

    const currentChatHistory = [...chatHistory, { role: "user", parts: [{ text: userMessage }] }];

    try {
      const payload = { contents: currentChatHistory };
      const apiKey = "AIzaSyD_S8DL9nWtmpUx9XWa_CM_4YBaD2XlAWE";  
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
        const aiText = result.candidates[0].content.parts[0].text;
        await addChatMessage(aiText, 'ai');
        // setChatHistory(prev => [...prev, { role: "model", parts: [{ text: aiText }] }]);
      } else {
        addChatMessage('AI failed to respond. Please try again.', 'ai');
        console.error('Unexpected AI chat response structure:', result);
      }
    } catch (error) {
      console.error('Error calling Gemini API for chat:', error);
      addChatMessage('An error occurred during chat. Please try again later.', 'ai');
    } finally {
      setSendChatBtnDisabled(false);
      setChatLoading(false);
      chatInputRef.current?.focus();
    }
  }, [chatInputText, chatHistory, addChatMessage]);

  // --- Delete Response Handlers ---
  const handleDeleteVoiceResponse = useCallback(() => {
    setVoiceOutputText('Click the microphone to start speaking...');
    setAiVoiceTextOutput('');
    setAiVoiceResponseAreaVisible(false);
    setSpeakAiVoiceBtnDisabled(true);
    setStopAiVoiceBtnDisabled(true);
    setDeleteVoiceResponseBtnDisabled(true);
    speechSynthesis.cancel();
  }, []);

  const handleDeleteGrammarResponse = useCallback(() => {
    setGrammarOutputText('');
    setSpeakGrammarBtnDisabled(true);
    setStopGrammarBtnDisabled(true);
    setDeleteGrammarBtnDisabled(true);
    speechSynthesis.cancel();
  }, []);

  const handleDeleteImageResponse = useCallback(() => {
    setImageAnswerText('');
    setUploadedImageSrc('');
    setUploadedImageVisible(false);
    if (imageUploadRef.current) imageUploadRef.current.value = '';
    setBase64ImageData('');
    setImageQuestionText('');
    setSpeakImageBtnDisabled(true);
    setStopImageBtnDisabled(true);
    setDeleteImageBtnDisabled(true);
    speechSynthesis.cancel();
  }, []);

  const handleClearChat = useCallback(() => {
    initializeChat();
  }, [initializeChat]);

  // --- Theme Toggle ---
  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  }, []);

  // --- Effects ---

  // Speech Recognition setup
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      const inputLang = inputLanguageSelectRef.current?.value || 'en-US';
recognition.lang = inputLang;

      recognitionRef.current = recognition;

      recognition.onstart = () => {
        setIsRecording(true);
        setVoiceOutputText('Listening... Speak now.');
        setVoiceLoading(true);
        setAiVoiceResponseAreaVisible(false);
        setAiVoiceTextOutput('');
        setSpeakAiVoiceBtnDisabled(true);
        setStopAiVoiceBtnDisabled(true);
        setDeleteVoiceResponseBtnDisabled(true);
        speechSynthesis.cancel();
      };

      recognition.onresult = async (event) => {
       const transcript = event.results[0][0].transcript;
setVoiceOutputText(`You said: "${transcript}"`);
setVoiceLoading(true);
setAiVoiceResponseAreaVisible(true);
setAiVoiceTextOutput('AI is thinking...');

const selectedLang = voiceResponseLanguageSelectRef.current?.value || 'en-US';
const inputLang = inputLanguageSelectRef.current?.value || 'en-US';
const selectedRole = aiRoleSelectRef.current?.value || 'friendly language learning companion';
const languageNameMap = {
  'en-US': 'English',
  'hi-IN': 'Hindi',
  'es-ES': 'Spanish',
  'fr-FR': 'French',
  'de-DE': 'German',
  'ja-JP': 'Japanese',
  'zh-CN': 'Mandarin Chinese',
  'mr-MR': 'Marathi',
};

        try {
        const userLangName = languageNameMap[inputLang] || 'English';
const targetLangName = languageNameMap[selectedLang] || 'English';

const prompt = `
You are acting as a ${selectedRole}.
The user's native language is ${userLangName}. They're learning ${targetLangName}.
They said: "${transcript}"

Please:
1. Translate or interpret their input if needed.
2. Respond in ${targetLangName}, correcting mistakes if necessary.
3. Encourage continued learning with a simple, friendly response in ${targetLangName}.
`;

          const currentChatHistory = [{ role: "user", parts: [{ text: prompt }] }];
          const payload = { contents: currentChatHistory };
          const apiKey = "AIzaSyD_S8DL9nWtmpUx9XWa_CM_4YBaD2XlAWE"; // Canvas will automatically provide the API key
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          const result = await response.json();

          if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const aiText = result.candidates[0].content.parts[0].text;
            setAiVoiceTextOutput(aiText.replace(/\n/g, '<br>'));
            speakText(aiText, setSpeakAiVoiceBtnDisabled, setStopAiVoiceBtnDisabled, selectedLang);
            setDeleteVoiceResponseBtnDisabled(false);
          } else {
            setAiVoiceTextOutput('AI failed to generate a voice response.');
            console.error('Unexpected AI response structure:', result);
          }
        } catch (error) {
          console.error('Error calling Gemini API for voice response:', error);
          setAiVoiceTextOutput('An error occurred while getting AI voice response.');
        } finally {
          setVoiceLoading(false);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setVoiceOutputText(`Error: ${event.error}. Try again.`);
        setVoiceLoading(false);
        setAiVoiceResponseAreaVisible(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
        // Keep loading if AI is still thinking
        if (voiceOutputText === 'Listening... Speak now.') {
          setVoiceOutputText('No speech detected. Click the microphone to try again.');
        }
      };

      return () => {
        recognition.stop();
      };
    } else {
      setVoiceOutputText('Speech Recognition not supported in this browser.');
      // No need to disable micButton as it's not a state variable
    }
  }, [speakText, voiceOutputText]); // Removed voiceOutputText from dependency array, as it's updated inside the effect.

  // Initialize chat on component mount
  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  // Theme persistence
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme('dark'); // Default to dark mode
    }
  }, []);

  useEffect(() => {
    document.body.classList.toggle('light-mode', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Scroll Animation and Parallax Effect
  useEffect(() => {
    const animatedElements = document.querySelectorAll('.scroll-animate');
    const backgroundImages = document.querySelectorAll('.section-background-image');

    const checkVisibility = () => {
      animatedElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100 && rect.bottom > 0) {
          element.classList.add('visible');
        }
      });

      backgroundImages.forEach(img => {
        const speed = 0.05;
        const yPos = window.scrollY * speed;
        img.style.transform = `translate(-50%, calc(-50% - ${yPos}px))`;
      });
    };

    // Add scroll-animate class to relevant sections for fade-in/slide-up effect
    document.querySelectorAll('.why-choose-section, .feature-section, .how-it-works-section').forEach(section => {
      section.classList.add('scroll-animate');
    });

    checkVisibility(); // Initial check on load

    window.addEventListener('scroll', checkVisibility);
    window.addEventListener('resize', checkVisibility);

    return () => {
      window.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
    };
  }, []);
 

  return (
    <div className="app-container">
      <style>{`
        /* CSS Variables for theming */
        :root {
            --bg-color: #000000;
            --text-color: #E0E0E0;
            --header-nav-color: #9ca3af;
            --header-nav-hover-color: #FFFFFF;
            --card-bg: rgba(26, 18, 38, 0.4);
            --card-border: rgba(255, 255, 255, 0.1);
            --input-bg: rgba(255, 255, 255, 0.05);
            --input-border: rgba(255, 255, 255, 0.1);
            --input-placeholder-color: #9ca3af;
            --ai-chat-bg: #374151;
            --user-chat-bg: #4f46e5;
        }

        /* Light Mode Variables */
        body.light-mode {
            --bg-color: #F3F4F6; /* Light gray */
            --text-color: #1F2937; /* Darker text */
            --header-nav-color: #4B5563;
            --header-nav-hover-color: #1F2937;
            --card-bg: rgba(255, 255, 255, 0.8);
            --card-border: rgba(0, 0, 0, 0.1);
            --input-bg: rgba(255, 255, 255, 0.9);
            --input-border: rgba(0, 0, 0, 0.15);
            --input-placeholder-color: #6B7280;
            --ai-chat-bg: #E5E7EB;
            --user-chat-bg: #6366F1; /* Indigo-500 */
        }

        /* Base styles */
        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            overflow-x: hidden; /* Prevents horizontal scroll from glow effects */
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            box-sizing: border-box;
            transition: background-color 0.5s ease, color 0.5s ease;
        }

        /* Main container */
        .main-container {
            max-width: 56rem; /* max-w-4xl */
            margin-left: auto; /* mx-auto */
            margin-right: auto; /* mx-auto */
            padding-left: 1rem; /* px-4 */
            padding-right: 1rem; /* px-4 */
            padding-top: 2rem; /* py-8 */
            padding-bottom: 2rem; /* py-8 */
            position: relative; /* relative */
            min-height: 100vh;
            overflow: hidden; /* overflow-hidden */
        }

        /* Responsive padding for main container */
        @media (min-width: 640px) { /* sm breakpoint */
            .main-container {
                padding-left: 1.5rem; /* sm:px-6 */
                padding-right: 1.5rem; /* sm:px-6 */
            }
        }
        @media (min-width: 1024px) { /* lg breakpoint */
            .main-container {
                padding-left: 2rem; /* lg:px-8 */
                padding-right: 2rem; /* lg:px-8 */
            }
        }

        /* Header styles */
        .header {
            display: flex; /* flex */
            justify-content: space-between; /* justify-between */
            align-items: center; /* items-center */
            margin-bottom: 3rem; /* mb-12 */
        }
        .header-logo {
            font-size: 1.5rem; /* text-2xl */
            font-weight: 700; /* font-bold */
            letter-spacing: 0.05em; /* tracking-wider */
        }
        .header-logo .ai-text {
            color: var(--text-color); /* text-white */
        }
        .header-logo .leaning-tool-text {
            color: #a78bfa; /* text-purple-400 */
        }
        .header-nav {
            display: none; /* hidden */
            gap: 2rem; /* space-x-8 */
            font-size: 0.875rem; /* text-sm */
            font-weight: 500; /* font-medium */
            color: var(--header-nav-color); /* text-gray-400 */
        }
        .header-nav a {
            transition: color 0.3s ease; /* transition-colors */
        }
        .header-nav a:hover {
            color: var(--header-nav-hover-color); /* hover:text-white */
        }
        @media (min-width: 768px) { /* md breakpoint */
            .header-nav {
                display: flex; /* md:flex */
            }
        }

        /* Mode Toggle Button */
        .mode-toggle-button {
            background: none;
            border: 1px solid var(--header-nav-color);
            color: var(--header-nav-color);
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-size: 0.875rem;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        .mode-toggle-button:hover {
            background-color: var(--header-nav-color);
            color: var(--bg-color);
        }
        body.light-mode .mode-toggle-button {
            border-color: var(--text-color);
            color: var(--text-color);
        }
        body.light-mode .mode-toggle-button:hover {
            background-color: var(--text-color);
            color: var(--bg-color);
        }


        /* Hero Section */
        .hero-section {
            text-align: center; /* text-center */
            margin-top: 6rem; /* my-24 */
            margin-bottom: 6rem; /* my-24 */
            position: relative; /* relative */
        }
        .hero-title {
            font-size: 3rem; /* text-5xl */
            font-weight: 800; /* font-extrabold */
            letter-spacing: -0.05em; /* tracking-tight */
            margin-bottom: 2rem; /* mb-8 */
            line-height: 1.25; /* leading-tight */
            background-image: linear-gradient(to right, #e5e7eb, #9ca3af); /* bg-gradient-to-r from-gray-200 to-gray-400 */
            -webkit-background-clip: text; /* bg-clip-text */
            background-clip: text; /* bg-clip-text */
            color: transparent; /* text-transparent */
        }

        /* Language and Role Selectors */
        .select-wrapper {
            margin-bottom: 1rem; /* mb-4 */
            max-width: 12rem; /* max-w-xs */
            margin-left: auto; /* mx-auto */
            margin-right: auto; /* mx-auto */
            color: var(--text-color); /* text-black */
        }
        .select-label {
            display: block; /* block */
            color: var(--text-color); /* text-gray-300 */
            font-size: 0.875rem; /* text-sm */
            font-weight: 700; /* font-bold */
            margin-bottom: 0.5rem; /* mb-2 */
        }

        /* Mic Button Container */
        .mic-button-container {
            display: flex; /* flex */
            justify-content: center; /* justify-center */
            align-items: center; /* items-center */
            margin-top: 4rem; /* my-16 */
            margin-bottom: 4rem; /* my-16 */
        }

        /* Voice Output Text */
        .voice-output-text {
            font-size: 1.125rem; /* text-lg */
            color: var(--text-color); /* text-gray-300 */
            margin-top: 1rem; /* mt-4 */
            min-height: 30px; /* min-h-[30px] */
        }

        /* Why Choose Section */
        .why-choose-section {
            margin-top: 6rem; /* my-24 */
            margin-bottom: 6rem; /* my-24 */
            position: relative; /* relative */
            overflow: hidden; /* overflow-hidden */
            border-radius: 1rem; /* rounded-2xl */
        }
        .why-choose-title {
            font-size: 2.25rem; /* text-4xl */
            font-weight: 700; /* font-bold */
            text-align: center; /* text-center */
            margin-bottom: 3rem; /* mb-12 */
        }
        .why-choose-grid {
            display: grid; /* grid */
            grid-template-columns: 1fr; /* grid-cols-1 */
            gap: 1.5rem; /* gap-6 */
        }
        @media (min-width: 768px) { /* md breakpoint */
            .why-choose-grid {
                grid-template-columns: 1fr 1fr; /* md:grid-cols-2 */
            }
        }

        /* Tense Guide / Image Understanding / Conversational Chat Sections */
        .feature-section {
            margin-top: 6rem; /* my-24 */
            margin-bottom: 6rem; /* my-24 */
            position: relative; /* relative */
            overflow: hidden; /* overflow-hidden */
            border-radius: 1rem; /* rounded-2xl */
        }
        .feature-title {
            font-size: 2.25rem; /* text-4xl */
            font-weight: 700; /* font-bold */
            text-align: center; /* text-center */
            margin-bottom: 3rem; /* mb-12 */
        }
        .feature-content-wrapper {
            display: flex; /* flex */
            flex-direction: column; /* flex-col */
            gap: 1.5rem; /* space-y-6 */
            max-width: 42rem; /* max-w-2xl */
            margin-left: auto; /* mx-auto */
            margin-right: auto; /* mx-auto */
        }

        /* How it Works Section */
        .how-it-works-section {
            margin-top: 6rem; /* my-24 */
            margin-bottom: 6rem; /* my-24 */
        }
        .how-it-works-title {
            font-size: 2.25rem; /* text-4xl */
            font-weight: 700; /* font-bold */
            text-align: center; /* text-center */
            margin-bottom: 3rem; /* mb-12 */
        }
        .how-it-works-video-wrapper {
            position: relative; /* relative */
            border-radius: 1rem; /* rounded-2xl */
            overflow: hidden; /* overflow-hidden */
            padding: 0.5rem; /* p-2 */
        }
        .how-it-works-video-overlay {
            position: absolute; /* absolute */
            inset: 0; /* inset-0 */
            display: flex; /* flex */
            align-items: center; /* items-center */
            justify-content: center; /* justify-center */
            background-color: rgba(0, 0, 0, 0.3); /* bg-black bg-opacity-30 */
        }
        .play-button {
            width: 5rem; /* w-20 */
            height: 5rem; /* h-20 */
            border-radius: 9999px; /* rounded-full */
            display: flex; /* flex */
            align-items: center; /* items-center */
            justify-content: center; /* justify-center */
            background-color: rgba(255, 255, 255, 0.2); /* bg-white bg-opacity-20 */
            backdrop-filter: blur(4px); /* backdrop-blur-sm */
            border: 1px solid rgba(255, 255, 255, 0.2); /* border border-white/20 */
            transition: background-color 0.3s ease; /* transition-all */
            cursor: pointer;
        }
        .play-button:hover {
            background-color: rgba(255, 255, 255, 0.3); /* hover:bg-opacity-30 */
        }
        .play-button svg {
            height: 2.5rem; /* h-10 */
            width: 2.5rem; /* w-10 */
            color: #FFFFFF; /* text-white */
            margin-left: 0.25rem; /* ml-1 */
        }

        /* Footer */
        .footer {
            text-align: center; /* text-center */
            color: var(--header-nav-color); /* text-gray-500 */
            font-size: 0.875rem; /* text-sm */
            margin-top: 6rem; /* mt-24 */
            padding-bottom: 2rem; /* pb-8 */
        }

        /* Custom styles for advanced effects (retained from original) */
        .glass-card {
            background: var(--card-bg); /* Semi-transparent purple-ish background */
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid var(--card-border);
            border-radius: 1rem;
            padding: 1.5rem; /* p-6 */
            transition: background-color 0.5s ease, border-color 0.5s ease;
        }
        .glass-card.feature-item {
            display: flex; /* flex */
            justify-content: space-between; /* justify-between */
            align-items: center; /* items-center */
        }
        .glass-card.feature-item h3 {
            font-size: 1.25rem; /* text-xl */
            font-weight: 600; /* font-semibold */
        }

        .mic-button {
            position: relative;
            z-index: 10;
            background: linear-gradient(145deg, #a955f7, #7a3bda);
            box-shadow: 0 0 15px #a955f7, 0 0 30px #a955f7, inset 0 0 5px rgba(255,255,255,0.5);
            width: 6rem; /* w-24 */
            height: 6rem; /* h-24 */
            border-radius: 9999px; /* rounded-full */
            display: flex; /* flex */
            align-items: center; /* items-center */
            justify-content: center; /* justify-center */
            cursor: pointer;
        }
        .mic-button svg {
            height: 2.5rem; /* h-10 */
            width: 2.5rem; /* w-10 */
            color: #FFFFFF; /* text-white */
        }

        .aurora-glow {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            border-radius: 50%;
            z-index: 1;
            pointer-events: none; /* Make it non-interactive */
        }

        .aurora-glow-1 {
            top: -100px;
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, rgba(196, 99, 243, 0.3) 0%, rgba(196, 99, 243, 0) 60%);
            filter: blur(50px);
        }

        .aurora-glow-2 {
            top: -80px;
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, rgba(220, 50, 150, 0.2) 0%, rgba(220, 50, 150, 0) 70%);
            filter: blur(30px);
        }

        /* Animation for the microphone pulse */
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
                box-shadow: 0 0 15px #a955f7, 0 0 30px #a955f7;
            }
            50% {
                transform: scale(1.05);
                box-shadow: 0 0 25px #c88cff, 0 0 50px #c88cff;
            }
        }

        .mic-pulse {
            animation: pulse 2.5s infinite ease-in-out;
        }

        .feature-icon {
            background-color: #a955f7;
            box-shadow: 0 0 8px #a955f7;
            width: 1rem; /* w-4 */
            height: 1rem; /* h-4 */
            border-radius: 9999px; /* rounded-full */
        }
        .feature-icon.small {
            width: 0.75rem; /* w-3 */
            height: 0.75rem; /* h-3 */
        }

        .ai-response-area {
            min-height: 100px;
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 0.75rem;
            padding: 1rem;
            text-align: left;
            overflow-y: auto;
            max-height: 300px;
            transition: background-color 0.5s ease, border-color 0.5s ease;
        }
        .ai-response-area p.placeholder {
            color: var(--input-placeholder-color); /* text-gray-400 */
        }
        .ai-response-area p.content {
            color: var(--text-color); /* text-white */
            margin-top: 0.5rem; /* mt-2 */
        }

        .input-field {
            width: 100%;
            padding: 0.75rem; /* p-3 */
            border-radius: 0.75rem; /* rounded-xl */
            background-color: var(--input-bg);
            border: 1px solid var(--input-border);
            color: var(--text-color);
            font-size: 1rem; /* text-base */
            box-sizing: border-box;
            resize: vertical;
            transition: background-color 0.5s ease, border-color 0.5s ease, color 0.5s ease;
        }
        .input-field::placeholder {
            color: var(--input-placeholder-color); /* gray-400 */
        }

        .loading-spinner {
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid #a955f7;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            animation: spin 1s linear infinite;
            display: inline-block;
            vertical-align: middle;
            margin-left: 0.5rem;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .image-preview {
            max-width: 100%;
            max-height: 250px;
            object-fit: contain;
            border-radius: 0.75rem;
            margin-top: 1rem;
            border: 1px solid var(--card-border);
        }

        .action-buttons-group {
            display: flex; /* flex */
            justify-content: flex-start; /* justify-start */
            margin-top: 1rem; /* mt-4 */
        }
        .action-button {
            background-color: #6d28d9; /* violet-700 */
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            cursor: pointer;
            transition: background-color 0.3s ease, opacity 0.3s ease;
            margin-right: 0.5rem; /* Space between buttons */
            border: none; /* Remove default button border */
        }
        .action-button:hover {
            background-color: #5b21b6; /* violet-800 */
        }
        .stop-button {
            background-color: #dc2626; /* red-600 */
        }
        .stop-button:hover {
            background-color: #b91c1c; /* red-700 */
        }
        .delete-button {
            background-color: #f59e0b; /* amber-500 */
        }
        .delete-button:hover {
            background-color: #d97706; /* amber-600 */
        }
        .action-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        /* Chat specific styles */
        .chat-container {
            display: flex;
            flex-direction: column;
            gap: 0.75rem; /* gap-3 */
            padding: 1rem; /* p-4 */
            border-radius: 1rem; /* rounded-xl */
            background: var(--card-bg);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid var(--card-border);
            min-height: 300px;
            max-height: 500px;
            overflow-y: auto;
            transition: background-color 0.5s ease, border-color 0.5s ease;
        }
        .chat-message {
            padding: 0.75rem 1rem; /* py-3 px-4 */
            border-radius: 0.75rem; /* rounded-xl */
            max-width: 80%;
            word-wrap: break-word;
        }
        .chat-message.user {
            background-color: var(--user-chat-bg); /* indigo-600 */
            align-self: flex-end; /* align-self-end */
            margin-left: auto; /* ml-auto */
        }
        .chat-message.ai {
            background-color: var(--ai-chat-bg); /* gray-700 */
            align-self: flex-start; /* align-self-start */
            margin-right: auto; /* mr-auto */
        }
        .chat-input-area {
            display: flex; /* flex */
            gap: 0.5rem; /* gap-2 */
            margin-top: 1rem; /* mt-4 */
        }
        .chat-input-area .input-field {
            flex-grow: 1; /* flex-grow */
            margin-top: 0; /* Override default margin */
        }
        .chat-send-button {
            padding: 0.75rem 1.25rem; /* py-3 px-5 */
            border-radius: 0.75rem; /* rounded-xl */
            background-color: #4f46e5; /* indigo-600 */
            color: white; /* text-white */
            font-weight: 600; /* font-semibold */
            cursor: pointer;
            transition: background-color 0.3s ease;
            border: none; /* Remove default button border */
        }
        .chat-send-button:hover {
            background-color: #4338ca; /* indigo-700 */
        }
        .chat-send-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .clear-chat-button {
            background-color: #f59e0b; /* amber-500 */
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            cursor: pointer;
            transition: background-color 0.3s ease;
            margin-bottom: 1rem; /* mb-4 */
            border: none; /* Remove default button border */
        }
        .clear-chat-button:hover {
            background-color: #d97706; /* amber-600 */
        }

        /* Background image for sections */
        .section-background-image {
            position: absolute; /* absolute */
            top: 50%; /* top-1/2 */
            left: 50%; /* left-1/2 */
            transform: translate(-50%, -50%); /* -translate-x-1/2 -translate-y-1/2 */
            width: 100%; /* w-full */
            max-width: none; /* max-w-none */
            height: auto; /* h-auto */
            opacity: 0.2; /* opacity-20 or opacity-25 */
            filter: blur(48px); /* blur-3xl */
            pointer-events: none; /* pointer-events-none */
            z-index: 1; /* z-10 */
            transition: transform 0.1s linear; /* Smooth movement for parallax */
        }
        .section-content-wrapper {
            position: relative; /* relative */
            z-index: 2; /* z-10 */
            padding: 1rem; /* p-4 */
        }

        /* New styles for scroll animation */
        .scroll-animate {
            opacity: 0;
            transform: translateY(20px); /* Start slightly below */
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }

        .scroll-animate.visible {
            opacity: 1;
            transform: translateY(0);
        }
            
      `}</style>

      <div className="main-container">
        {/* Header */}
        <header className="header">
          <div className="header-logo">
            <span className="ai-text">AI</span><span className="leaning-tool-text">Learning Tool</span>
          </div>
          <nav className="header-nav">
            {/* <a href="#">Features</a>
            <a href="#">About</a>
            <a href="#">Contact</a> */}
            <button id="modeToggleButton" className="mode-toggle-button" onClick={toggleTheme}>
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </nav>
        </header>

        {/* Hero Section (Voice Recognition) */}
        <section className="hero-section">
          {/* Background Glows */}
          <div className="aurora-glow aurora-glow-1"></div>
          <div className="aurora-glow aurora-glow-2"></div>

          <h1 className="hero-title">
            Speak and Learn <br /> Effortlessly
          </h1>
        <div className="select-wrapper">
  <label htmlFor="inputLanguage" className="select-label">Your Speaking Language:</label>
  <select id="inputLanguage" className="input-field" ref={inputLanguageSelectRef}>
    <option style={{ color: "#000000" }} value="en-US">English (US)</option>
    <option style={{ color: "#000000" }} value="hi-IN">Hindi (India)</option>
    <option style={{ color: "#000000" }} value="es-ES">Spanish (Spain)</option>
    <option style={{ color: "#000000" }} value="fr-FR">French (France)</option>
    <option style={{ color: "#000000" }} value="de-DE">German (Germany)</option>
    <option style={{ color: "#000000" }} value="ja-JP">Japanese (Japan)</option>
    <option style={{ color: "#000000" }} value="zh-CN">Mandarin (China)</option>
    <option style={{ color: "#000000" }} value="mr-MR">Marathi (India)</option>
  </select>
</div>
          {/* Language Selection for Voice Response */}
          <div className="select-wrapper">
            <label htmlFor="voiceResponseLanguage" className="select-label">AI Voice Language:</label>
            <select id="voiceResponseLanguage" className="input-field" ref={voiceResponseLanguageSelectRef}>
              <option style={{color:"#000000"}} value="en-US">English (US)</option>
              <option style={{color:"#000000"}} value="es-ES">Spanish (Spain)</option>
              <option style={{color:"#000000"}} value="fr-FR">French (France)</option>
              <option style={{color:"#000000"}} value="de-DE">German (Germany)</option>
              <option style={{color:"#000000"}} value="ja-JP">Japanese (Japan)</option>
              <option style={{color:"#000000"}} value="zh-CN">Mandarin (China)</option>
              <option style={{color:"#000000"}} value="hi-IN">Hindi (India)</option>
              <option style={{color:"#000000"}} value="mr-MR">Marathi (India)</option>
            </select>
          </div>

          {/* Role Selection for Voice Response */}
          <div className="select-wrapper" style={{ marginBottom: '2rem' }}>
            <label htmlFor="aiRole" className="select-label">AI Role:</label>
            <select id="aiRole" className="input-field" ref={aiRoleSelectRef}>
              <option value="friendly language learning companion">Friendly Language Companion</option>
              <option value="strict grammar teacher">Strict Grammar Teacher</option>
              <option value="casual conversation partner">Casual Conversation Partner</option>
              <option value="travel guide for a new city">Travel Guide</option>
              <option value="job interviewer">Job Interviewer</option>
            </select>
          </div>

          <div className="mic-button-container">
            <button id="micButton" className={`mic-button ${isRecording ? 'mic-pulse' : ''}`} onClick={handleMicButtonClick}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm5 10.5a.5.5 0 01.5.5v.5a.5.5 0 01-1 0v-.5a.5.5 0 01.5-.5zM10 18a.5.5 0 00.5-.5v-1.586l1.293 1.293a.5.5 0 00.707-.707L10.707 15H9.293l-1.793 1.793a.5.5 0 00.707.707L9.5 16.914V17.5a.5.5 0 00.5.5z" clipRule="evenodd" />
                <path d="M5 8a5 5 0 004 4.9V15a1 1 0 102 0v-2.1A5 5 0 005 8zm-2 0a7 7 0 1114 0v1a1 1 0 11-2 0V8a5 5 0 00-5-5 5 5 0 00-5 5v1a1 1 0 11-2 0V8z" />
              </svg>
            </button>
          </div>
          <p id="voiceOutput" className="voice-output-text">{voiceOutputText}</p>
          {voiceLoading && <div id="voiceLoading" className="loading-spinner" style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }}></div>}
          <div id="aiVoiceResponseArea" className={`ai-response-area ${aiVoiceResponseAreaVisible ? '' : 'hidden'}`} style={{ marginTop: '1rem', padding: '1rem' }}>
            <p className="placeholder">AI's Voice Response:</p>
            <p id="aiVoiceTextOutput" className="content" dangerouslySetInnerHTML={{ __html: aiVoiceTextOutput }}></p>
            <div className="action-buttons-group">
              <button id="speakAiVoiceBtn" className="action-button" disabled={speakAiVoiceBtnDisabled} onClick={() => speakText(aiVoiceTextOutput, setSpeakAiVoiceBtnDisabled, setStopAiVoiceBtnDisabled, voiceResponseLanguageSelectRef.current?.value)}>Speak Response</button>
              <button id="stopAiVoiceBtn" className="action-button stop-button" disabled={stopAiVoiceBtnDisabled} onClick={() => stopSpeaking(setSpeakAiVoiceBtnDisabled, setStopAiVoiceBtnDisabled)}>Stop Speaking</button>
              <button id="deleteVoiceResponseBtn" className="action-button delete-button" disabled={deleteVoiceResponseBtnDisabled} onClick={handleDeleteVoiceResponse}>Delete Response</button>
            </div>
          </div>
        </section>

        {/* Why Choose Syncra? Section */}
        <section className="why-choose-section scroll-animate">
          {/* Background Image */}
          <img src="https://placehold.co/1200x800/6e44ff/000000.png?text=+" className="section-background-image" style={{ opacity: 0.2 }} alt="Abstract purple background wave" />

          <div className="section-content-wrapper">
            <h2 className="why-choose-title">Why choose AILeaning Tool?</h2>
            <div className="why-choose-grid">
              <div className="glass-card feature-item">
                <h3 className="text-xl font-semibold">Voice Interaction</h3>
                <div className="feature-icon"></div>
              </div>
              <div className="glass-card feature-item">
                <h3 className="text-xl font-semibold">Grammar & Tense Guide</h3>
                <div className="feature-icon"></div>
              </div>
              <div className="glass-card feature-item">
                <h3 className="text-xl font-semibold">Image Understanding</h3>
                <div className="feature-icon"></div>
              </div>
              <div className="glass-card feature-item">
                <h3 className="text-xl font-semibold">Personalized Learning</h3>
                <div className="feature-icon"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Tense Guide & Grammar Correction Section */}
        <section className="feature-section scroll-animate">
          {/* Background Image */}
          <img src="https://placehold.co/1200x800/a955f7/1a1226.png?text=+" className="section-background-image" style={{ opacity: 0.25 }} alt="Abstract purple and black background wave" />

          <div className="section-content-wrapper">
            <h2 className="feature-title">Tense Guide & Grammar Correction</h2>
            <div className="feature-content-wrapper">
              <textarea
                id="grammarInput"
                className="input-field"
                rows="4"
                placeholder="Type your sentence here for grammar correction or tense explanation..."
                value={grammarInputText}
                onChange={(e) => setGrammarInputText(e.target.value)}
                ref={grammarInputRef}
              ></textarea>
              <button id="analyzeGrammarBtn" className="mic-button" style={{ width: '100%', height: 'auto', padding: '0.75rem 1.5rem', borderRadius: '0.75rem' }} onClick={handleAnalyzeGrammar}>
                Analyze Text
                {grammarLoading && <span id="grammarLoading" className="loading-spinner"></span>}
              </button>
              <div className="ai-response-area glass-card" style={{ marginTop: '1rem', padding: '1rem' }}>
                <p className="placeholder">AI Response will appear here:</p>
                <p id="grammarOutput" className="content" dangerouslySetInnerHTML={{ __html: grammarOutputText }}></p>
                <div className="action-buttons-group">
                  <button id="speakGrammarBtn" className="action-button" disabled={speakGrammarBtnDisabled} onClick={() => speakText(grammarOutputText, setSpeakGrammarBtnDisabled, setStopGrammarBtnDisabled, voiceResponseLanguageSelectRef.current?.value)}>Speak Response</button>
                  <button id="stopGrammarBtn" className="action-button stop-button" disabled={stopGrammarBtnDisabled} onClick={() => stopSpeaking(setSpeakGrammarBtnDisabled, setStopGrammarBtnDisabled)}>Stop Speaking</button>
                  <button id="deleteGrammarBtn" className="action-button delete-button" disabled={deleteGrammarBtnDisabled} onClick={handleDeleteGrammarResponse}>Delete Response</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Image Understanding and Answering Section */}
        <section className="feature-section scroll-animate">
          {/* Background Image */}
          <img src="https://placehold.co/1200x800/6e44ff/000000.png?text=+" className="section-background-image" style={{ opacity: 0.2 }} alt="Abstract purple background wave" />

          <div className="section-content-wrapper">
            <h2 className="feature-title">Image Understanding & Answering</h2>
            <div className="feature-content-wrapper">
              <label htmlFor="imageUpload" className="select-label" style={{ textAlign: 'left' }}>Upload an Image:</label>
              <label htmlFor="imageclick" className="select-label" style={{ textAlign: 'left' }}>Click to Upload:</label>
              <input type="file" id="imageUpload" className="input-field" accept="image/*" style={{ cursor: 'pointer' }} onChange={handleImageUploadChange} ref={imageUploadRef} />
              {uploadedImageVisible && <img id="uploadedImage" className="image-preview" src={uploadedImageSrc} alt="Uploaded Image Preview" style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} />}

              <textarea
                id="imageQuestion"
                className="input-field"
                rows="3"
                placeholder="Ask a question about the image... (e.g., 'What is in this picture?', 'Describe the scene.')"
                style={{ marginTop: '1rem' }}
                value={imageQuestionText}
                onChange={(e) => setImageQuestionText(e.target.value)}
                ref={imageQuestionRef}
              ></textarea>
              <button id="askImageQuestionBtn" className="mic-button" style={{ width: '100%', height: 'auto', padding: '0.75rem 1.5rem', borderRadius: '0.75rem' }} onClick={handleAskImageQuestion}>
                Ask AI about Image
                {imageLoading && <span id="imageLoading" className="loading-spinner"></span>}
              </button>
              <div className="ai-response-area glass-card" style={{ marginTop: '1rem', padding: '1rem' }}>
                <p className="placeholder">AI's Answer will appear here:</p>
                <p id="imageAnswer" className="content" dangerouslySetInnerHTML={{ __html: imageAnswerText }}></p>
                <div className="action-buttons-group">
                  <button id="speakImageBtn" className="action-button" disabled={speakImageBtnDisabled} onClick={() => speakText(imageAnswerText, setSpeakImageBtnDisabled, setStopImageBtnDisabled, voiceResponseLanguageSelectRef.current?.value)}>Speak Response</button>
                  <button id="stopImageBtn" className="action-button stop-button" disabled={stopImageBtnDisabled} onClick={() => stopSpeaking(setSpeakImageBtnDisabled, setStopImageBtnDisabled)}>Stop Speaking</button>
                  <button id="deleteImageBtn" className="action-button delete-button" disabled={deleteImageBtnDisabled} onClick={handleDeleteImageResponse}>Delete Response</button>
                </div>
              </div>
            </div>
           
          </div>
          
        </section>

        {/* Conversational Chat Section */}
        <section className="feature-section scroll-animate">
          {/* Background Image */}
          <img src="https://placehold.co/1200x800/a955f7/1a1226.png?text=+" className="section-background-image" style={{ opacity: 0.25 }} alt="Abstract purple and black background wave" />

          <div className="section-content-wrapper">
            <h2 className="feature-title">Conversational Chat</h2>
            <div className="feature-content-wrapper">
              <button id="clearChatBtn" className="clear-chat-button" onClick={handleClearChat}>Clear Chat</button>
              <div id="chatDisplay" className="chat-container" ref={chatDisplayRef}>
                {/* Chat messages will be appended here */}
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`chat-message ${msg.role === 'user' ? 'user' : 'ai'}`}>
                    {msg.parts[0].text}
                  </div>
                ))}
              </div>
              <div className="chat-input-area">
                <input
                  type="text"
                  id="chatInput"
                  className="input-field"
                  placeholder="Type your message here..."
                  value={chatInputText}
                  onChange={(e) => setChatInputText(e.target.value)}
                  onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendChat(); } }}
                  disabled={sendChatBtnDisabled}
                  ref={chatInputRef}
                />
                <button id="sendChatBtn" className="chat-send-button" onClick={handleSendChat} disabled={sendChatBtnDisabled}>Send</button>
              </div>
              {chatLoading && <div id="chatLoading" className="loading-spinner" style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }}></div>}
            </div>
          </div>
        </section>

        {/* How AILeaning Tool Works Section (Adjusted)
        <section className="how-it-works-section scroll-animate">
          <h2 className="how-it-works-title">How AILearning Tool works</h2>
          <div className="how-it-works-video-wrapper glass-card">
            <img src="https://placehold.co/800x450/1a1226/e0e0e0?text=AI+Interaction+Demo"
              alt="A person interacting with an AI language tool"
              style={{ width: '100%', height: 'auto', borderRadius: '0.5rem' }}
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x450/1a1226/e0e0e0?text=Image+Not+Found'; }}
            />
            <div className="how-it-works-video-overlay">
              <button className="play-button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </section> */}

        {/* Footer */}
        <footer className="footer">
          <p>&copy; 2025 AILearning Tool. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default STT;

