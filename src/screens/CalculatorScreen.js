import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

import InputGroup from '../components/InputGroup';
import UnitSelector from '../components/UnitSelector';
import HistoryList from '../components/HistoryList';
import TabSelector from '../components/TabSelector';
import StandardCalculator from '../components/StandardCalculator';
import { calculateUnitPrice, calculateDiscountPrice, getVolumeUnitText } from '../utils/calculations';

export default function CalculatorScreen() {
    const [activeTab, setActiveTab] = useState('unitPrice');

    // Unit Price State
    const [price, setPrice] = useState('');
    const [volume, setVolume] = useState('');
    const [currentUnit, setCurrentUnit] = useState('100g');
    const [unitPriceResult, setUnitPriceResult] = useState(null);
    const [unitPriceHistory, setUnitPriceHistory] = useState([]);

    // Discount State
    const [discountPrice, setDiscountPrice] = useState('');
    const [discountRate, setDiscountRate] = useState('');
    const [discountResult, setDiscountResult] = useState(null);
    const [discountHistory, setDiscountHistory] = useState([]);

    // Calculator State
    const [calculatorHistory, setCalculatorHistory] = useState([]);

    // Unit Price Calculation Actions
    const handleCalculateUnitPrice = () => {
        const p = parseFloat(price);
        const v = parseFloat(volume);

        if (!p || !v || p <= 0 || v <= 0) {
            setUnitPriceResult(null);
            return;
        }

        const result = calculateUnitPrice(p, v, currentUnit);
        setUnitPriceResult(result);
    };

    const handleConfirmUnitPrice = () => {
        const p = parseFloat(price);
        const v = parseFloat(volume);

        if (!p || !v || p <= 0 || v <= 0) {
            Alert.alert('エラー', '価格と容量を正しく入力してください');
            return;
        }

        const result = calculateUnitPrice(p, v, currentUnit);

        // Add to history
        const unitLabel = getVolumeUnitText(currentUnit);
        const newItem = {
            price: p,
            volume: v,
            unit: currentUnit, // e.g. '100g'
            unitLabel: unitLabel, // e.g. 'g'
            unitPrice: result,
            timestamp: new Date()
        };

        setUnitPriceHistory(prev => [newItem, ...prev].slice(0, 5));
        setUnitPriceResult(result);
        Alert.alert('完了', '履歴に追加しました');
    };

    const handleClearUnitPrice = () => {
        setPrice('');
        setVolume('');
        setUnitPriceResult(null);
    };

    // Discount Calculation Actions
    const handleCalculateDiscount = () => {
        const p = parseFloat(discountPrice);
        const r = parseFloat(discountRate);

        // Check if price or rate is invalid
        // Empty string check is important for discountRate to avoid NaN loop if controlled input
        if (!p || p <= 0 || isNaN(r) || r < 0 || r > 100 || discountRate === '') {
            setDiscountResult(null);
            return;
        }

        const result = calculateDiscountPrice(p, r);
        setDiscountResult(result);
    };

    const handleConfirmDiscount = () => {
        const p = parseFloat(discountPrice);
        const r = parseFloat(discountRate);

        if (!p || p <= 0) {
            Alert.alert('エラー', '価格を入力してください');
            return;
        }
        if (isNaN(r) || r < 0 || r > 100 || discountRate === '') {
            Alert.alert('エラー', '割引率は0〜100の間で入力してください');
            return;
        }

        const result = calculateDiscountPrice(p, r);

        const newItem = {
            price: p,
            discountRate: r,
            discountedPrice: result,
            savedAmount: p - result,
            timestamp: new Date()
        };

        setDiscountHistory(prev => [newItem, ...prev].slice(0, 5));
        setDiscountResult(result);
        Alert.alert('完了', '履歴に追加しました');
    };

    const handleClearDiscount = () => {
        setDiscountPrice('');
        setDiscountRate('');
        setDiscountResult(null);
    };

    // Helper for Discount Presets
    const DISCOUNT_PRESETS = ['10', '20', '30', '50', '70'];
    const handlePresetDiscount = (rate) => {
        setDiscountRate(rate);
    };

    // Delete handlers
    const handleDeleteUnitPrice = (index) => {
        setUnitPriceHistory(prev => prev.filter((_, i) => i !== index));
    };
    const handleDeleteAllUnitPrice = () => setUnitPriceHistory([]);

    const handleDeleteDiscount = (index) => {
        setDiscountHistory(prev => prev.filter((_, i) => i !== index));
    };
    const handleDeleteAllDiscount = () => setDiscountHistory([]);

    const handleDeleteCalculator = (index) => {
        setCalculatorHistory(prev => prev.filter((_, i) => i !== index));
    };
    const handleDeleteAllCalculator = () => setCalculatorHistory([]);

    // Calculator Actions
    const handleSaveCalculatorHistory = (data) => {
        const newItem = {
            value: data.value,
            expression: data.expression,
            timestamp: data.timestamp
        };
        setCalculatorHistory(prev => [newItem, ...prev].slice(0, 5));
        Alert.alert('完了', '履歴に追加しました');
    };

    // Auto-calculate on input change
    React.useEffect(() => {
        handleCalculateUnitPrice();
    }, [price, volume, currentUnit]);

    React.useEffect(() => {
        handleCalculateDiscount();
    }, [discountPrice, discountRate]);


    return (
        <LinearGradient
            colors={['#4CAF50', '#2E7D32']}
            style={styles.gradient}
        >
            <SafeAreaView style={styles.safeArea}>
                <StatusBar style="light" />
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>計算アプリ</Text>
                        <Text style={styles.headerSubtitle}>単価計算と割引計算ができます</Text>
                        <TabSelector activeTab={activeTab} onSwitchTab={setActiveTab} />
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {activeTab === 'unitPrice' && (
                            <View>
                                {/* Unit Price UI */}
                                <View style={styles.card}>
                                    <InputGroup label="価格（円）" value={price} onChangeText={setPrice} placeholder="例: 298" />
                                    <InputGroup label="容量" value={volume} onChangeText={setVolume} placeholder="例: 500" />
                                    <UnitSelector currentUnit={currentUnit} onSelectUnit={setCurrentUnit} />
                                    <View style={styles.resultSection}>
                                        <Text style={styles.resultLabel}>単価</Text>
                                        <Text style={styles.resultValue}>{unitPriceResult !== null ? `¥${unitPriceResult.toFixed(2)}` : '-'}</Text>
                                        <Text style={styles.resultUnit}>{currentUnit}あたり</Text>
                                    </View>
                                    <View style={styles.buttonGroup}>
                                        <TouchableOpacity style={[styles.actionBtn, styles.clearBtn]} onPress={handleClearUnitPrice}><Text style={[styles.btnText, { color: '#555' }]}>クリア</Text></TouchableOpacity>
                                        <TouchableOpacity style={[styles.actionBtn, styles.confirmBtn]} onPress={handleConfirmUnitPrice}><Text style={styles.btnText}>保存する</Text></TouchableOpacity>
                                    </View>
                                </View>
                                <HistoryList history={unitPriceHistory} type="unitPrice" onDelete={handleDeleteUnitPrice} onDeleteAll={handleDeleteAllUnitPrice} />
                            </View>
                        )}

                        {activeTab === 'discount' && (
                            <View>
                                {/* Discount UI (Redesigned) */}
                                {/* Price Input Card */}
                                <View style={styles.card}>
                                    <Text style={styles.inputLabel}>元の価格</Text>
                                    <View style={styles.priceInputContainer}>
                                        <Text style={styles.yenMark}>¥</Text>
                                        <TextInput
                                            style={styles.largeInput}
                                            value={discountPrice}
                                            onChangeText={setDiscountPrice}
                                            placeholder="2980"
                                            placeholderTextColor="#ddd"
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </View>

                                {/* Discount Rate Card */}
                                <View style={[styles.card, { marginTop: 15 }]}>
                                    <Text style={styles.inputLabel}>割引率</Text>
                                    <View style={styles.presetContainer}>
                                        {DISCOUNT_PRESETS.map((preset) => (
                                            <TouchableOpacity
                                                key={preset}
                                                style={[
                                                    styles.presetBtn,
                                                    discountRate === preset && styles.presetBtnActive
                                                ]}
                                                onPress={() => handlePresetDiscount(preset)}
                                            >
                                                <Text style={[
                                                    styles.presetText,
                                                    discountRate === preset && styles.presetTextActive
                                                ]}>{preset}%</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    <View style={styles.customInputRow}>
                                        <Text style={styles.customInputLabel}>任意入力:</Text>
                                        <TextInput
                                            style={styles.customInput}
                                            value={discountRate}
                                            onChangeText={setDiscountRate}
                                            placeholder="20"
                                            keyboardType="numeric"
                                            maxLength={3}
                                        />
                                        <Text style={styles.customInputSuffix}>% OFF</Text>
                                    </View>
                                </View>

                                {/* Result Card */}
                                <View style={[styles.card, styles.resultCard, { marginTop: 15 }]}>
                                    <Text style={styles.resultLabel}>計算結果</Text>
                                    <Text style={styles.resultValueLarge}>
                                        {discountResult !== null ? `¥${discountResult.toLocaleString()}` : '-'}
                                    </Text>
                                    <Text style={styles.resultUnit}>割引後の価格</Text>
                                    {discountResult !== null && discountPrice && discountRate !== '' && (
                                        <View style={styles.savedAmountContainer}>
                                            <Text style={styles.savedAmountText}>
                                                -¥{(parseFloat(discountPrice) - discountResult).toLocaleString()}
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                {/* Action Buttons */}
                                <View style={[styles.buttonGroup, { marginTop: 15 }]}>
                                    <TouchableOpacity
                                        style={[styles.actionBtn, styles.clearBtn]}
                                        onPress={handleClearDiscount}
                                    >
                                        <Text style={[styles.btnText, { color: '#555' }]}>クリア</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.actionBtn, styles.confirmBtn]}
                                        onPress={handleConfirmDiscount}
                                    >
                                        <Text style={styles.btnText}>保存する</Text>
                                    </TouchableOpacity>
                                </View>

                                <HistoryList history={discountHistory} type="discount" onDelete={handleDeleteDiscount} onDeleteAll={handleDeleteAllDiscount} />
                            </View>
                        )}

                        {activeTab === 'calculator' && (
                            <StandardCalculator
                                onSaveHistory={handleSaveCalculatorHistory}
                                history={calculatorHistory}
                                onDeleteHistory={handleDeleteCalculator}
                                onDeleteAllHistory={handleDeleteAllCalculator}
                            />
                        )}
                        <View style={{ height: 40 }} />
                    </ScrollView>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 20,
    },
    content: {
        flex: 1,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    resultCard: {
        backgroundColor: '#f8f9fa',
        alignItems: 'center',
        padding: 30,
    },
    resultSection: {
        backgroundColor: '#f8f9fa',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    resultLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    resultValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 5,
    },
    resultValueLarge: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 5,
    },
    resultUnit: {
        fontSize: 14,
        color: '#888',
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: 15,
    },
    actionBtn: {
        flex: 1,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    confirmBtn: {
        backgroundColor: '#4CAF50',
    },
    clearBtn: {
        backgroundColor: '#e0e0e0', // Lighter grey for proper contrast
    },
    btnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },

    // New Styles for Discount UI
    inputLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
        marginBottom: 10,
    },
    priceInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    yenMark: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 10,
    },
    largeInput: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    presetContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 15,
    },
    presetBtn: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        minWidth: 50,
        alignItems: 'center',
    },
    presetBtnActive: {
        backgroundColor: '#4CAF50',
    },
    presetText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
    },
    presetTextActive: {
        color: '#fff',
    },
    customInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 10,
    },
    customInputLabel: {
        fontSize: 14,
        color: '#666',
        marginRight: 10,
    },
    customInput: {
        backgroundColor: '#fff',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: 60,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        borderWidth: 1,
        borderColor: '#eee',
    },
    customInputSuffix: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 10,
    },
    savedAmountContainer: {
        marginTop: 10,
        backgroundColor: '#ffebee',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    savedAmountText: {
        color: '#e53935',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
