import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import CalculatorScreen from './src/screens/CalculatorScreen';
import ErrorBoundary from './src/components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <View style={styles.appWrapper}>
          <CalculatorScreen />
        </View>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6b66c0', // 3枚目の画像（ばーじょんわん）の背景色に近い色
    alignItems: 'center',
  },
  appWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  }
});
