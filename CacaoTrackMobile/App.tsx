import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import { SyncProvider } from './src/contexts/SyncContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AuthProvider>
          <SyncProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </SyncProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
