import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TabSelector = ({ activeTab, onSwitchTab }) => {
    const tabs = [
        { id: 'unitPrice', label: '単価計算' },
        { id: 'discount', label: '割引計算' },
        { id: 'calculator', label: '電卓' },
    ];

    return (
        <View style={styles.container}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab.id}
                    style={[
                        styles.tab,
                        activeTab === tab.id && styles.activeTab
                    ]}
                    onPress={() => onSwitchTab(tab.id)}
                >
                    <Text style={[
                        styles.text,
                        activeTab === tab.id && styles.activeText
                    ]}>{tab.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
        width: '100%',
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    activeText: {
        color: '#4CAF50',
    },
});

export default TabSelector;
