import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const InputGroup = ({ label, value, onChangeText, placeholder, keyboardType = 'numeric' }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    keyboardType={keyboardType}
                    placeholderTextColor="#999"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        borderWidth: 2,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        padding: 12,
        fontSize: 18,
        color: '#333',
    },
});

export default InputGroup;
