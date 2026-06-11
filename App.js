import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import CalculatorScreen from './src/screens/CalculatorScreen';
import ErrorBoundary from './src/components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <CalculatorScreen />
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
