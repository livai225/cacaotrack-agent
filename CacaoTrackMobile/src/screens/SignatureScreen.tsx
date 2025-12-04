import React, { useRef, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Text, Card } from 'react-native-paper';
import { WebView } from 'react-native-webview';

export default function SignatureScreen({ navigation, route }: any) {
  const webViewRef = useRef<any>(null);
  const { producteurNom } = route.params || {};
  const [hasSignature, setHasSignature] = useState(false);

  const handleMessage = (event: any) => {
    const signature = event.nativeEvent.data;
    if (signature && signature.startsWith('data:image')) {
      // Retourner la signature à l'écran précédent
      navigation.navigate({
        name: route.params?.returnScreen || 'Collecte',
        params: {
          signature_producteur: signature,
          date_signature: new Date().toISOString(),
        },
        merge: true,
      });
    }
  };

  const handleClear = () => {
    webViewRef.current?.injectJavaScript('clearSignature();');
    setHasSignature(false);
  };

  const handleValidate = () => {
    webViewRef.current?.injectJavaScript('getSignature();');
  };

  const signatureHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          height: 100vh; 
          background: #fff;
        }
        canvas { 
          border: 2px dashed #8B4513; 
          border-radius: 8px;
          touch-action: none;
          width: 100%;
          height: 100%;
        }
      </style>
    </head>
    <body>
      <canvas id="signature-pad"></canvas>
      <script>
        const canvas = document.getElementById('signature-pad');
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        // Redimensionner le canvas
        function resizeCanvas() {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Configuration du dessin
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Gestion du dessin
        function startDrawing(e) {
          isDrawing = true;
          const touch = e.touches ? e.touches[0] : e;
          [lastX, lastY] = [touch.clientX, touch.clientY];
        }

        function draw(e) {
          if (!isDrawing) return;
          e.preventDefault();
          const touch = e.touches ? e.touches[0] : e;
          ctx.beginPath();
          ctx.moveTo(lastX, lastY);
          ctx.lineTo(touch.clientX, touch.clientY);
          ctx.stroke();
          [lastX, lastY] = [touch.clientX, touch.clientY];
        }

        function stopDrawing() {
          isDrawing = false;
        }

        // Events
        canvas.addEventListener('touchstart', startDrawing);
        canvas.addEventListener('touchmove', draw);
        canvas.addEventListener('touchend', stopDrawing);
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);

        // Fonctions exposées
        function clearSignature() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        function getSignature() {
          const dataURL = canvas.toDataURL('image/png');
          window.ReactNativeWebView.postMessage(dataURL);
        }
      </script>
    </body>
    </html>
  `;

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
        <WebView
          ref={webViewRef}
          source={{ html: signatureHTML }}
          onMessage={handleMessage}
          style={styles.webview}
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
          onPress={handleValidate}
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
  webview: {
    flex: 1,
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
