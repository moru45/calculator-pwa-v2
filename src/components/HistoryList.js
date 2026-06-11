import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const HistoryList = ({ history, type, onUseValue, onDelete, onDeleteAll }) => {
    if (!history || history.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>最近の計算</Text>
                <View style={[styles.card, { alignItems: 'center', padding: 20 }]}>
                    <Text style={styles.noHistory}>まだ履歴がありません</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.listHeader}>
                <Text style={styles.title}>最近の計算</Text>
                {onDeleteAll && (
                    <TouchableOpacity onPress={onDeleteAll}>
                        <Text style={styles.clearAllText}>全削除</Text>
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.list}>
                {history.map((item, index) => (
                    <View key={index} style={[styles.historyCard, onDelete && styles.historyCardDeletable]}>
                        {onDelete && (
                            <TouchableOpacity
                                style={styles.deleteBtn}
                                onPress={() => onDelete(index)}
                            >
                                <Text style={styles.deleteBtnText}>×</Text>
                            </TouchableOpacity>
                        )}
                        {type === 'unitPrice' && (
                            <View>
                                <Text style={styles.historyDetail}>
                                    {item.volume}{item.unitLabel || item.unit} {item.price.toLocaleString()}円
                                </Text>
                                <View style={styles.historyResultRow}>
                                    <Text style={styles.historyResult}>
                                        ¥{item.unitPrice.toFixed(2)}
                                    </Text>
                                    <View style={styles.unitBadge}>
                                        <Text style={styles.unitBadgeText}>/{item.unit}</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                        {type === 'discount' && (
                            <View>
                                <Text style={styles.historyDetail}>
                                    ¥{item.price.toLocaleString()} の {item.discountRate}% OFF
                                </Text>
                                <View style={styles.historyResultRow}>
                                    <Text style={styles.historyResult}>
                                        ¥{item.discountedPrice.toLocaleString()}
                                    </Text>
                                    <View style={styles.savedBadge}>
                                        <Text style={styles.savedBadgeText}>
                                            -¥{item.savedAmount.toLocaleString()}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}
                        {type === 'calculator' && (
                            <View style={styles.calcItemRow}>
                                <Text style={[styles.itemTextLarge, { flex: 1 }]} numberOfLines={2}>
                                    {item.expression}
                                </Text>
                                {onUseValue && (
                                    <TouchableOpacity
                                        style={styles.useBtn}
                                        onPress={() => onUseValue(item.value)}
                                    >
                                        <Text style={styles.useBtnText}>使う</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    },
    title: {
        fontSize: 14,
        color: '#666',
        fontWeight: 'bold',
    },
    list: {
        gap: 10,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
    },
    historyCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        marginBottom: 10,
    },
    historyCardDeletable: {
        paddingTop: 32,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        marginHorizontal: 5,
    },
    clearAllText: {
        fontSize: 13,
        color: '#e53935',
        fontWeight: 'bold',
    },
    deleteBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    deleteBtnText: {
        fontSize: 14,
        color: '#888',
        fontWeight: 'bold',
        lineHeight: 18,
    },
    historyDetail: {
        fontSize: 14,
        color: '#888',
        marginBottom: 5,
    },
    historyResultRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    historyResult: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    itemTextLarge: {
        fontSize: 18,
        color: '#333',
        fontWeight: '500',
    },
    calcItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    useBtn: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        marginLeft: 10,
    },
    useBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
    },
    savedBadge: {
        backgroundColor: '#ffebee',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    savedBadgeText: {
        color: '#e53935',
        fontWeight: 'bold',
        fontSize: 14,
    },
    unitBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    unitBadgeText: {
        color: '#4CAF50',
        fontWeight: 'bold',
        fontSize: 14,
    },
    noHistory: {
        color: '#ccc',
        fontStyle: 'italic',
    },
});

export default HistoryList;
