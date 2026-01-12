import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { TextInput, Button, Title, Text, HelperText } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    Keyboard.dismiss();
    setError('');

    if (!username || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
    } catch (err: any) {
      const errorMessage = err?.message || 'Une erreur est survenue.';
      setError(errorMessage);
      console.error('Détails erreur login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            {/* Vous pouvez décommenter et utiliser une image de logo si vous en avez une */}
            {/* <Image source={require('../assets/logo.png')} style={styles.logo} /> */}
            <Title style={styles.title}>fiedifoue moh</Title>
          </View>

          <View style={styles.form}>
            <TextInput
              label="Nom d'utilisateur"
              value={username}
              onChangeText={setUsername}
              mode="outlined"
              style={styles.input}
              autoCapitalize="none"
              left={<TextInput.Icon icon="account" />}
              error={!!error}
            />

            <TextInput
              label="Mot de passe"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry={!isPasswordVisible}
              style={styles.input}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon 
                  icon={isPasswordVisible ? 'eye-off' : 'eye'}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)} 
                />
              }
              error={!!error}
            />

            <HelperText type="error" visible={!!error} style={styles.errorText}>
              {error}
            </HelperText>

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              contentStyle={styles.buttonContent}
              buttonColor="#8B4513"
            >
              Se connecter
            </Button>
          </View>

          <Text style={styles.footer}>Version 1.0.0</Text>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-condensed',
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginTop: 4,
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    fontSize: 14,
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
    elevation: 2,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    textAlign: 'center',
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignSelf: 'center',
    color: '#A0A0A0',
  },
});
