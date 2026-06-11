import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { UNITS } from '../constants/units';

const UnitSelector = ({ currentUnit, onSelectUnit }) => {
    return (
        <View style={styles.container}>
            {UNITS.map((unit) => (
                <TouchableOpacity
                    key={unit.id}
                    style={[
                        styles.button,
                        currentUnit === unit.id && styles.activeButton
                    ]}
                    onPress={() => onSelectUnit(unit.id)}
                >
                    <Text style={[
                        styles.text,
                        currentUnit === unit.id && styles.activeText
                    ]}>
                        {unit.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    button: {
        width: '32%',
        paddingVertical: 12,
        marginBottom: 10,
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        alignItems: 'center',
    },
    activeButton: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    text: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600',
    },
    activeText: {
        color: '#fff',
    },
});

export default UnitSelector;
