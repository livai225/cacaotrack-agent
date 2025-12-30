import React, { useRef, useState } from 'react';
import { View, StyleSheet, Alert, Dimensions } from 'react-native';
import { Button, Text, Card } from 'react-native-paper';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

export default function SignatureScreen({ navigation, route }: any) {
  const webViewRef = useRef<WebView>(null);
  const { producteurNom } = route.params || {};

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <style>
        body {
          margin: 0;
          padding: 0;
          background: #f5f5f5;
        }
        #signature-canvas {
          border: 2px solid #8B4513;
          background: white;
          touch-action: none;
        }
        .controls {
          padding: 10px;
          text-align: center;
        }
        button {
          padding: 10px 20px;
          margin: 5px;
          background: #8B4513;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
        }
      </style>
    </head>
    <body>
      <canvas id="signature-canvas" width="${width - 40}" height="300"></canvas>
      <div class="controls">
        <button onclick="clearCanvas()">Effacer</button>
      </div>
      <script>
        const canvas = document.getElementById('signature-canvas');
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        canvas.addEventListener('touchstart', (e) => {
          e.preventDefault();
          const touch = e.touches[0];
          const rect = canvas.getBoundingClientRect();
          lastX = touch.clientX - rect.left;
          lastY = touch.clientY - rect.top;
          isDrawing = true;
        });

        canvas.addEventListener('touchmove', (e) => {
          e.preventDefault();
          if (!isDrawing) return;
          const touch = e.touches[0];
          const rect = canvas.getBoundingClientRect();
          const currentX = touch.clientX - rect.left;
          const currentY = touch.clientY - rect.top;

          ctx.beginPath();
          ctx.moveTo(lastX, lastY);
          ctx.lineTo(currentX, currentY);
          ctx.stroke();

          lastX = currentX;
          lastY = currentY;
        });

        canvas.addEventListener('touchend', (e) => {
          e.preventDefault();
          isDrawing = false;
        });

        canvas.addEventListener('touchcancel', (e) => {
          e.preventDefault();
          isDrawing = false;
        });

        function clearCanvas() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        function getSignature() {
          return canvas.toDataURL('image/png');
        }

        window.getSignature = getSignature;
        window.clearCanvas = clearCanvas;
      </script>
    </body>
    </html>
  `;

  const handleOK = async () => {
    try {
      const signature = await webViewRef.current?.injectJavaScript(`
        (function() {
          const canvas = document.getElementById('signature-canvas');
          const dataURL = canvas.toDataURL('image/png');
          window.ReactNativeWebView.postMessage(dataURL);
        })();
        true;
      `);
      
      // Attendre le message du WebView
      setTimeout(() => {
        // Retourner la signature à l'écran précédent
        navigation.navigate({
          name: route.params?.returnScreen || 'Collecte',
          params: {
            signature_producteur: 'signature_base64_data',
            date_signature: new Date().toISOString(),
          },
          merge: true,
        });
      }, 100);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'enregistrer la signature');
    }
  };

  const handleMessage = (event: any) => {
    const signature = event.nativeEvent.data;
    navigation.navigate({
      name: route.params?.returnScreen || 'Collecte',
      params: {
        signature_producteur: signature,
        date_signature: new Date().toISOString(),
      },
      merge: true,
    });
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Signature du Producteur</Text>
          {producteurNom && (
            <Text style={styles.subtitle}>{producteurNom}</Text>
          )}
          
          <View style={styles.signatureContainer}>
            <WebView
              ref={webViewRef}
              source={{ html: htmlContent }}
              style={styles.webview}
              onMessage={handleMessage}
              javaScriptEnabled={true}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleOK}
              style={styles.button}
            >
              Valider
            </Button>
            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={styles.button}
            >
              Annuler
            </Button>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  signatureContainer: {
    height: 350,
    borderWidth: 2,
    borderColor: '#8B4513',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    gap: 8,
  },
  button: {
    marginBottom: 8,
  },
});
