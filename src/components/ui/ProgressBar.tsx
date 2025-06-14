// src/components/ui/ProgressBar.tsx
import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: number;
  showPercentage?: boolean;
  backgroundColor?: string;
  progressColor?: string;
  style?: StyleProp<ViewStyle>;
  animated?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 10,
  showPercentage = false,
  backgroundColor,
  progressColor,
  style,
  animated = true,
}) => {
  const { theme } = useTheme();
  
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  // Use provided colors or fallback to theme colors
  const bgColor = backgroundColor || theme.colors.inputBackground;
  const pgColor = progressColor || theme.colors.primary;
  
  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.background,
          {
            backgroundColor: bgColor,
            height,
            borderRadius: height / 2,
          },
        ]}
      >
        <View
          style={[
            styles.progress,
            {
              backgroundColor: pgColor,
              width: `${clampedProgress}%`,
              height,
              borderRadius: height / 2,
            },
          ]}
        />
      </View>
      
      {showPercentage && (
        <Text style={[styles.percentage, { color: theme.colors.textSecondary }]}>
          {Math.round(clampedProgress)}%
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  background: {
    flex: 1,
    overflow: 'hidden',
  },
  progress: {
    position: 'absolute',
    left: 0,
  },
  percentage: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ProgressBar;