import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepNames: string[];
}

export default function StepIndicator({ currentStep, totalSteps, stepNames }: StepIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View style={styles.container}>
      {/* Barre de progression */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
      </View>

      {/* Indicateurs d'étapes */}
      <View style={styles.stepsContainer}>
        {stepNames.map((name, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isPending = stepNumber > currentStep;

          return (
            <View key={index} style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  isActive && styles.stepCircleActive,
                  isCompleted && styles.stepCircleCompleted,
                  isPending && styles.stepCirclePending,
                ]}
              >
                {isCompleted ? (
                  <Icon name="check" size={16} color="#fff" />
                ) : (
                  <Text style={[styles.stepNumber, isActive && styles.stepNumberActive]}>
                    {stepNumber}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.stepName,
                  isActive && styles.stepNameActive,
                  isPending && styles.stepNamePending,
                ]}
                numberOfLines={1}
              >
                {name}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Texte étape actuelle */}
      <View style={styles.currentStepContainer}>
        <Text style={styles.currentStepText}>
          Étape {currentStep} sur {totalSteps}
        </Text>
        <Text style={styles.currentStepName}>{stepNames[currentStep - 1]}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF6B35',
    borderRadius: 2,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepCircleActive: {
    backgroundColor: '#FF6B35',
  },
  stepCircleCompleted: {
    backgroundColor: '#4CAF50',
  },
  stepCirclePending: {
    backgroundColor: '#E0E0E0',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#999',
  },
  stepNumberActive: {
    color: '#fff',
  },
  stepName: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
  },
  stepNameActive: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  stepNamePending: {
    color: '#999',
  },
  currentStepContainer: {
    alignItems: 'center',
  },
  currentStepText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  currentStepName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});

