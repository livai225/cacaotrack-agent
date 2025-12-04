import React, { useRef } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Text, Card } from 'react-native-paper';
import SignatureCanvas from 'react-native-signature-canvas';

export default function SignatureScreen({ navigation, route }: any) {
  const signatureRef = useRef<any>(null);
  const { producteurNom } = route.params || {};

  const handleOK = (signature: string) => {
    // Retourner la signature à l'écran précédent
    navigation.navigate({
      name: route.params?.returnScreen || 'Collecte',
      params: {
        signature_producteur: signature,
        date_signature: new Date().toISOString(),
      },
      merge: true,
    });
  };

  const handleClear = () => {
    signatureRef.current?.clearSignature();
  };

  const handleEmpty = () => {
    Alert.alert('Signature vide', 'Veuillez signer avant de valider');
  };

  return (
    <View style={styles.container}>
      {/* Instructions */}
      <Card style={styles.instructionsCard}>
        <Card.Content>
          <Text style={styles.title}>
            Signature du Producteur
          </Text>
          {producteurNom && (
            <Text style={styles.producteur}>
              {producteurNom}
            </Text>
          )}
          <Text style={styles.instructions}>
            Demandez au producteur de signer avec son doigt sur l'écran ci-dessous
          </Text>
        </Card.Content>
      </Card>

      {/* Zone de signature */}
      <View style={styles.signatureContainer}>
        <SignatureCanvas
          ref={signatureRef}
          onOK={handleOK}
          onEmpty={handleEmpty}
          descriptionText=""
          clearText="Effacer"
          confirmText="Valider"
          webStyle={`
            .m-signature-pad {
              box-shadow: none;
              border: 2px dashed #8B4513;
              border-radius: 8px;
            }
            .m-signature-pad--body {
              border: none;
            }
            .m-signature-pad--footer {
              display: none;
            }
          `}
        />
      </View>

      {/* Boutons */}
      <View style={styles.controls}>
        <Button
          mode="outlined"
          icon="eraser"
          onPress={handleClear}
          style={styles.button}
          textColor="#F44336"
        >
          Effacer
        </Button>

        <Button
          mode="contained"
          icon="check"
          onPress={() => signatureRef.current?.readSignature()}
          style={styles.button}
          buttonColor="#8B4513"
        >
          Valider la Signature
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  instructionsCard: {
    margin: 16,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 8,
  },
  producteur: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  instructions: {
    fontSize: 14,
    color: '#666',
  },
  signatureContainer: {
    flex: 1,
    margin: 16,
    backgroundColor: '#FFF',
    borderRadius: 8,
    elevation: 2,
  },
  controls: {
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  button: {
    marginTop: 8,
  },
});
