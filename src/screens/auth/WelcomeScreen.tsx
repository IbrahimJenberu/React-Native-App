// src/screens/auth/WelcomeScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import Button from '../../components/ui/Button';
import { WelcomeScreenProps } from '../../navigation/types';
import { motivationalQuotes } from '../../mocks/quotesData';

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [quote, setQuote] = useState(motivationalQuotes[0]);
  
  useEffect(() => {
    // Get random quote on mount
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setQuote(motivationalQuotes[randomIndex]);
  }, []);
  
  const handleLogin = () => {
    navigation.navigate('Login');
  };
  
  const handleRegister = () => {
    navigation.navigate('Register');
  };

  // Fallback background color if image fails to load
  const backgroundStyle = {
    backgroundColor: theme.colors.primary,
  };
  
  return (
    <View style={[styles.background, backgroundStyle]}>
      <StatusBar translucent backgroundColor="transparent" />
      <SafeAreaView style={styles.container}>
        <View style={styles.overlay}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>TopScorer</Text>
          </View>
          
          <View style={styles.quoteContainer}>
            <Text style={styles.quoteText}>"{quote.text}"</Text>
            <Text style={styles.quoteAuthor}>— {quote.author}</Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <Button
              title="Sign In"
              variant="primary"
              size="large"
              fullWidth
              onPress={handleLogin}
              style={styles.button}
            />
            <Button
              title="Create Account"
              variant="outline"
              size="large"
              fullWidth
              onPress={handleRegister}
              style={styles.button}
              textStyle={{ color: theme.colors.white }}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  quoteContainer: {
    alignItems: 'center',
    padding: 20,
  },
  quoteText: {
    fontSize: 20,
    fontWeight: '500',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  quoteAuthor: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  buttonContainer: {
    marginBottom: 40,
  },
  button: {
    marginBottom: 16,
    borderColor: 'white',
  },
});

export default WelcomeScreen;