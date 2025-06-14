// src/components/ui/EmptyState.tsx
import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import Button from './Button';
import LottieView from 'lottie-react-native';

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: React.ReactNode;
  lottieSource?: any; // Lottie animation source
  buttonText?: string;
  onButtonPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon,
  lottieSource,
  buttonText,
  onButtonPress,
  style,
}) => {
  const { theme } = useTheme();
  
  return (
    <View
      style={[
        styles.container,
        {
          padding: theme.spacing.xl,
        },
        style,
      ]}
    >
      {lottieSource && (
        <LottieView
          source={lottieSource}
          autoPlay
          loop
          style={styles.lottie}
        />
      )}
      
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      
      <Text
        style={[
          styles.title,
          {
            color: theme.colors.textPrimary,
            fontSize: theme.typography.fontSize.xl,
            marginTop: theme.spacing.lg,
          },
        ]}
      >
        {title}
      </Text>
      
      {message && (
        <Text
          style={[
            styles.message,
            {
              color: theme.colors.textSecondary,
              fontSize: theme.typography.fontSize.md,
              marginTop: theme.spacing.sm,
            },
          ]}
        >
          {message}
        </Text>
      )}
      
      {buttonText && onButtonPress && (
        <View style={styles.buttonContainer}>
          <Button
            title={buttonText}
            onPress={onButtonPress}
            style={{ marginTop: theme.spacing.lg }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  lottie: {
    width: 200,
    height: 200,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 24,
  },
});

export default EmptyState;