import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import HistoryList from './HistoryList';

const StandardCalculator = ({ onSaveHistory, history, onDeleteHistory, onDeleteAllHistory }) => {
    const [expression, setExpression] = useState('');
    const [currentNumber, setCurrentNumber] = useState('0');
    const [waitingForNext, setWaitingForNext] = useState(false);
    const [accumResult, setAccumResult] = useState(null);
    const [pendingOp, setPendingOp] = useState(null);
    const [isFinished, setIsFinished] = useState(false);

    const calc = (a, b, op) => {
        switch (op) {
            case '+': return a + b;
            case '-': return a - b;
            case '×': return a * b;
            case '÷': return b !== 0 ? a / b : NaN;
            default: return b;
        }
    };

    const fmt = (n) => {
        if (typeof n !== 'number' || isNaN(n)) return 'Error';
        return String(parseFloat(n.toPrecision(12)));
    };

    const inputDigit = (digit) => {
        const d = String(digit);
        if (isFinished) {
            setCurrentNumber(d);
            setExpression('');
            setAccumResult(null);
            setPendingOp(null);
            setWaitingForNext(false);
            setIsFinished(false);
            return;
        }
        if (waitingForNext) {
            setCurrentNumber(d);
            setWaitingForNext(false);
        } else {
            setCurrentNumber(prev => prev === '0' ? d : prev + d);
        }
    };

    const inputDot = () => {
        if (isFinished) {
            setCurrentNumber('0.');
            setExpression('');
            setAccumResult(null);
            setPendingOp(null);
            setWaitingForNext(false);
            setIsFinished(false);
            return;
        }
        if (waitingForNext) {
            setCurrentNumber('0.');
            setWaitingForNext(false);
            return;
        }
        if (!currentNumber.includes('.')) {
            setCurrentNumber(prev => prev + '.');
        }
    };

    const clearDisplay = () => {
        setExpression('');
        setCurrentNumber('0');
        setAccumResult(null);
        setPendingOp(null);
        setWaitingForNext(false);
        setIsFinished(false);
    };

    const performOperation = (nextOp) => {
        if (isFinished) {
            const v = parseFloat(currentNumber);
            setExpression(currentNumber + nextOp);
            setAccumResult(v);
            setPendingOp(nextOp);
            setWaitingForNext(true);
            setIsFinished(false);
            return;
        }
        if (waitingForNext) {
            setExpression(expression.slice(0, -1) + nextOp);
            setPendingOp(nextOp);
            return;
        }
        const v = parseFloat(currentNumber);
        if (accumResult === null) {
            setAccumResult(v);
            setExpression(currentNumber + nextOp);
        } else {
            const r = calc(accumResult, v, pendingOp);
            setAccumResult(r);
            setExpression(expression + currentNumber + nextOp);
        }
        setPendingOp(nextOp);
        setWaitingForNext(true);
    };

    const handleEquals = () => {
        if (!pendingOp || waitingForNext) return;
        const v = parseFloat(currentNumber);
        const r = calc(accumResult, v, pendingOp);
        const rStr = fmt(r);
        setExpression(expression + currentNumber + '=');
        setCurrentNumber(rStr);
        setAccumResult(r);
        setPendingOp(null);
        setIsFinished(true);
    };

    const handleBackspace = () => {
        if (isFinished || waitingForNext) return;
        if (currentNumber.length <= 1) {
            setCurrentNumber('0');
            return;
        }
        const newVal = currentNumber.slice(0, -1);
        setCurrentNumber(newVal === '-' || newVal === '.' ? '0' : newVal);
    };

    const toggleSign = () => {
        if (currentNumber !== '0') {
            setCurrentNumber(prev => prev.startsWith('-') ? prev.slice(1) : '-' + prev);
        }
    };

    const percentage = () => {
        const v = parseFloat(currentNumber) / 100;
        setCurrentNumber(fmt(v));
    };

    const liveExpr = waitingForNext ? expression : expression + currentNumber;

    const getRunningResult = () => {
        if (isFinished || accumResult === null) return '';
        if (!waitingForNext && pendingOp) {
            const v = parseFloat(currentNumber);
            if (isNaN(v)) return '';
            const r = calc(accumResult, v, pendingOp);
            return isNaN(r) ? 'Error' : fmt(r);
        }
        return fmt(accumResult);
    };

    const runningResult = getRunningResult();

    const handleUseHistoryValue = (value) => {
        const numStr = String(value);
        if (isFinished) {
            setCurrentNumber(numStr);
            setExpression('');
            setAccumResult(null);
            setPendingOp(null);
            setWaitingForNext(false);
            setIsFinished(false);
        } else if (waitingForNext) {
            setCurrentNumber(numStr);
            setWaitingForNext(false);
        } else {
            setCurrentNumber(numStr);
        }
    };

    const handleSave = () => {
        const value = parseFloat(currentNumber);
        const historyText = isFinished
            ? `${expression.slice(0, -1)} = ${currentNumber}`
            : `Val: ${value}`;
        onSaveHistory({ value, expression: historyText, timestamp: new Date() });
    };

    const exprFontSize = liveExpr.length > 20 ? 22 : liveExpr.length > 12 ? 28 : 36;

    return (
        <View>
            <View style={styles.calculatorCard}>
                <View style={styles.displayContainer}>
                    {isFinished ? (
                        <>
                            <Text style={styles.expressionText}>{expression}</Text>
                            <Text style={[styles.displayText, {
                                fontSize: currentNumber.length > 9 ? 36 : 56
                            }]}>
                                {currentNumber}
                            </Text>
                        </>
                    ) : (
                        <>
                            <Text style={[styles.liveExprText, { fontSize: exprFontSize }]}>
                                {liveExpr}
                            </Text>
                            {runningResult !== '' && (
                                <Text style={styles.runningResultText}>{runningResult}</Text>
                            )}
                        </>
                    )}
                </View>

                <View style={styles.backspaceRow}>
                    <TouchableOpacity
                        onPress={handleBackspace}
                        disabled={isFinished || waitingForNext}
                        style={styles.backspaceBtn}
                    >
                        <Text style={[styles.backspaceBtnText, (isFinished || waitingForNext) && { opacity: 0.25 }]}>
                            ⌫
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.keypad}>
                    <View style={styles.row}>
                        <Button text="AC" onPress={clearDisplay} type="secondary" />
                        <Button text="+/-" onPress={toggleSign} type="secondary" />
                        <Button text="%" onPress={percentage} type="secondary" />
                        <Button text="÷" onPress={() => performOperation('÷')} type="operator" />
                    </View>
                    <View style={styles.row}>
                        <Button text="7" onPress={() => inputDigit(7)} />
                        <Button text="8" onPress={() => inputDigit(8)} />
                        <Button text="9" onPress={() => inputDigit(9)} />
                        <Button text="×" onPress={() => performOperation('×')} type="operator" />
                    </View>
                    <View style={styles.row}>
                        <Button text="4" onPress={() => inputDigit(4)} />
                        <Button text="5" onPress={() => inputDigit(5)} />
                        <Button text="6" onPress={() => inputDigit(6)} />
                        <Button text="-" onPress={() => performOperation('-')} type="operator" />
                    </View>
                    <View style={styles.row}>
                        <Button text="1" onPress={() => inputDigit(1)} />
                        <Button text="2" onPress={() => inputDigit(2)} />
                        <Button text="3" onPress={() => inputDigit(3)} />
                        <Button text="+" onPress={() => performOperation('+')} type="operator" />
                    </View>
                    <View style={styles.row}>
                        <Button text="0" onPress={() => inputDigit(0)} style={{ flex: 2 }} />
                        <Button text="." onPress={inputDot} />
                        <Button text="=" onPress={handleEquals} type="primary" />
                    </View>
                </View>

                <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.clearBtn} onPress={clearDisplay}>
                        <Text style={styles.actionBtnText}>クリア</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                        <Text style={styles.saveBtnText}>保存する</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {history && <HistoryList history={history} type="calculator" onUseValue={handleUseHistoryValue} onDelete={onDeleteHistory} onDeleteAll={onDeleteAllHistory} />}
        </View>
    );
};

const BUTTON_HEIGHT = 50;

const Button = ({ text, onPress, type = 'number', style }) => {
    let bgStyle = styles.numberBtn;
    let textStyle = styles.numberText;

    if (type === 'operator') {
        bgStyle = styles.operatorBtn;
        textStyle = styles.operatorText;
    } else if (type === 'secondary') {
        bgStyle = styles.secondaryBtn;
        textStyle = styles.secondaryText;
    } else if (type === 'primary') {
        bgStyle = styles.primaryBtn;
        textStyle = styles.primaryText;
    }

    return (
        <TouchableOpacity style={[styles.button, bgStyle, style]} onPress={onPress}>
            <Text style={[styles.buttonText, textStyle]}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    calculatorCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 20,
    },
    displayContainer: {
        marginBottom: 20,
        alignItems: 'flex-end',
        padding: 10,
        minHeight: 120,
        justifyContent: 'flex-end',
    },
    backspaceRow: {
        alignItems: 'flex-end',
        marginBottom: 8,
    },
    backspaceBtn: {
        padding: 6,
        paddingHorizontal: 10,
    },
    backspaceBtnText: {
        fontSize: 26,
        color: '#555',
    },
    liveExprText: {
        fontWeight: '400',
        color: '#333',
        textAlign: 'right',
    },
    runningResultText: {
        fontSize: 24,
        color: '#888',
        marginTop: 6,
    },
    expressionText: {
        fontSize: 22,
        color: '#888',
        marginBottom: 4,
    },
    displayText: {
        fontWeight: 'bold',
        color: '#333',
    },
    keypad: {
        gap: 8,
    },
    row: {
        flexDirection: 'row',
        gap: 8,
    },
    button: {
        flex: 1,
        height: BUTTON_HEIGHT,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 20,
        fontWeight: '500',
    },
    numberBtn: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#f0f0f0',
        elevation: 1,
    },
    numberText: { color: '#333' },
    operatorBtn: { backgroundColor: '#4CAF50' },
    operatorText: { color: '#fff' },
    secondaryBtn: { backgroundColor: '#e6e6e6' },
    secondaryText: { color: '#333' },
    primaryBtn: { backgroundColor: '#34495e' },
    primaryText: { color: '#fff' },
    actionRow: {
        flexDirection: 'row',
        gap: 15,
        marginTop: 20,
    },
    clearBtn: {
        flex: 1,
        padding: 15,
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        alignItems: 'center',
    },
    saveBtn: {
        flex: 1,
        padding: 15,
        backgroundColor: '#4CAF50',
        borderRadius: 10,
        alignItems: 'center',
    },
    actionBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    saveBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default StandardCalculator;
