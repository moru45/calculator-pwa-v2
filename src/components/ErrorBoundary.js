import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.log('Error caught by boundary:', error, errorInfo);
        this.setState({ error: error, errorInfo: errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>Something went wrong.</Text>
                    <ScrollView style={styles.scrollView}>
                        <Text style={styles.errorText}>
                            {this.state.error && this.state.error.toString()}
                        </Text>
                        <Text style={styles.infoText}>
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </Text>
                    </ScrollView>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#ffebee',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#d32f2f',
        marginBottom: 10,
    },
    scrollView: {
        width: '100%',
        maxHeight: 400,
    },
    errorText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
    infoText: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'monospace',
    },
});

export default ErrorBoundary;
