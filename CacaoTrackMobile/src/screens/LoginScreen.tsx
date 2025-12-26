import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Text,
  Image,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { API_CONFIG } from '../config/api';
import { colors } from '../theme/colors';
import { spacing as spacingTheme, borderRadius as borderRadiusTheme, shadows } from '../theme/spacing';
import Button from '../components/Button';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    console.log('Tentative de connexion avec URL:', API_CONFIG.BASE_URL);
    if (!username || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
    } catch (error: any) {
      console.log('Login error:', error.message, error.response?.data);
      Alert.alert(
        'Erreur de connexion',
        (error.response?.data?.error || error.message || 'Identifiants incorrects') + 
        `\n\nURL: ${API_CONFIG.BASE_URL}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.gradient}>
        <View style={styles.content}>
          {/* Header avec logo */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>🌱</Text>
              </View>
              <Text style={styles.title}>CacaoTrack</Text>
              <Text style={styles.subtitle}>Agent de Terrain</Text>
            </View>
          </View>

          {/* Formulaire */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nom d'utilisateur</Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                mode="outlined"
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
                placeholder="Entrez votre nom d'utilisateur"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mot de passe</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                style={styles.input}
                secureTextEntry={!showPassword}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
                placeholder="Entrez votre mot de passe"
              />
            </View>

            <Button
              title="Se connecter"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              variant="primary"
              size="lg"
              style={styles.loginButton}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Version 1.0.0</Text>
            <Text style={styles.footerSubtext}>© 2024 CacaoTrack</Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacingTheme.lg,
    paddingVertical: spacingTheme.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacingTheme.xxl,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: borderRadiusTheme.round,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacingTheme.md,
    ...shadows.lg,
  },
  logoText: {
    fontSize: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacingTheme.xs,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: spacingTheme.xs,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: spacingTheme.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacingTheme.sm,
    marginLeft: spacingTheme.xs,
  },
  input: {
    backgroundColor: colors.surface,
    fontSize: 16,
  },
  loginButton: {
    marginTop: spacingTheme.lg,
    ...shadows.md,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacingTheme.xl,
  },
  footerText: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: spacingTheme.xs,
  },
  footerSubtext: {
    fontSize: 10,
    color: colors.textLight,
  },
});
