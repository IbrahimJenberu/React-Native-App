// src/screens/profile/EditProfileScreen.tsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { EditProfileScreenProps } from '../../navigation/types';
import { updateUser } from '../../store/slices/authSlice';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ name: '', email: '' });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', email: '' };

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (validateForm()) {
      try {
        setIsLoading(true);
        
        const updatedUser = {
          ...user,
          name,
          email,
        };
        
        // Update AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Update Redux state
        dispatch(updateUser({ name, email }));
        
        Alert.alert('Success', 'Profile updated successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } catch (error) {
        console.error('Update profile error:', error);
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.avatarCard}>
          <View style={styles.avatarContainer}>
            <Avatar name={name} size="large" />
          </View>
        </Card>

        <Card style={styles.formCard}>
          <Input
            label="Full Name"
            value={name}
            onChangeText={setName}
            error={errors.name}
            placeholder="Enter your full name"
          />
          
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </Card>

        <Button
          title="Save Changes"
          onPress={handleSave}
          loading={isLoading}
          fullWidth
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  avatarCard: {
    marginBottom: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    padding: 20,
  },
  formCard: {
    marginBottom: 24,
  },
});

export default EditProfileScreen;

