// src/components/ui/Avatar.tsx
import React from 'react';
import { 
  View, 
  Image, 
  Text, 
  StyleSheet, 
  StyleProp, 
  ViewStyle,
  ImageStyle,
  ImageSourcePropType
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

type AvatarSize = 'small' | 'medium' | 'large' | number;

interface AvatarProps {
  source?: ImageSourcePropType;
  name?: string;
  size?: AvatarSize;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  source,
  name = '',
  size = 'medium',
  style,
  backgroundColor,
}) => {
  const { theme } = useTheme();
  
  const getSize = (): number => {
    if (typeof size === 'number') return size;
    
    switch (size) {
      case 'small':
        return 32;
      case 'medium':
        return 48;
      case 'large':
        return 64;
      default:
        return 48;
    }
  };
  
  const getFontSize = (): number => {
    const avatarSize = getSize();
    return avatarSize * 0.4;
  };
  
  const getInitials = (): string => {
    if (!name) return '';
    
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    return (
      nameParts[0].charAt(0).toUpperCase() +
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  };
  
  const avatarSize = getSize();
  const avatarStyle: StyleProp<ImageStyle> = [
    styles.avatar,
    {
      width: avatarSize,
      height: avatarSize,
      borderRadius: avatarSize / 2,
      backgroundColor: backgroundColor || theme.colors.primary,
    },
    style as StyleProp<ImageStyle>,
  ];
  
  if (source) {
    return (
      <Image
        source={source}
        style={avatarStyle}
        resizeMode="cover"
      />
    );
  }
  
  return (
    <View style={[styles.avatar, avatarStyle]}>
      <Text
        style={[
          styles.initials,
          {
            fontSize: getFontSize(),
            color: theme.colors.white,
          },
        ]}
      >
        {getInitials()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontWeight: 'bold',
  },
});

export default Avatar;