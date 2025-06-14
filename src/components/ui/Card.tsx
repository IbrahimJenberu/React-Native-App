// src/components/ui/Card.tsx
import React from 'react';
import { 
  View, 
  StyleSheet, 
  StyleProp, 
  ViewStyle, 
  TouchableOpacity,
  TouchableOpacityProps
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: TouchableOpacityProps['onPress'];
  elevation?: number;
  padding?: boolean;
  margin?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  elevation = 2,
  padding = true,
  margin = true,
}) => {
  const { theme } = useTheme();
  
  const cardStyle: StyleProp<ViewStyle> = [
    styles.card,
    {
      backgroundColor: theme.colors.cardBackground,
      borderColor: theme.colors.border,
      shadowOpacity: elevation * 0.1,
      shadowRadius: elevation,
      elevation: elevation,
      padding: padding ? theme.spacing.md : 0,
      margin: margin ? theme.spacing.sm : 0,
    },
    style,
  ];
  
  if (onPress) {
    return (
      <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.7}>
        {children}
      </TouchableOpacity>
    );
  }
  
  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
  },
});

export default Card;

