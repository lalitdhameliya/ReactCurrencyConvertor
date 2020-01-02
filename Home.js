import React, { Component } from 'react';
import { StyleSheet, View, Picker, Text } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { TextInput } from 'react-native-gesture-handler';
// import API from './api'
import axios from 'axios';

export async function getCurrentRateForBase(baseCurrency) {
    console.log('============BASE CURRENCY=============\n' + baseCurrency);
    try {
        const response = await axios.get('https://api.exchangeratesapi.io/latest?base=' + baseCurrency);
        console.log('============ API==========\n' + JSON.stringify(response.data.rates));
        return response.data.rates;
    }
    catch (error) {
        console.error(error);
    }
}

function formateToRate(toAmount, toCurrency) {
    if (toAmount == '' || toAmount == null) {
        toAmount = 0
    }

    return toAmount.toFixed(2) + ' ' + toCurrency;
}

export default class App extends Component {
    state = {
        fromCurrency: 'USD',
        toCurrency: 'INR',
        currencyList: [],
        fromAmount: 0,
        toAmount: 0,
        toCurrencyAmount: 0,
        baseCurrencyRates: []
    }

    componentDidMount() {
        getCurrentRateForBase('USD').then(response => {
            this.setState({
                baseCurrencyRates: response
            });
        });

        axios.get(`https://api.exchangeratesapi.io/latest`)
            .then(res => {
                var currencySymbol = [];
                Object.keys(res.data.rates).forEach(function (key) {
                    var value = res.data[key];
                    currencySymbol.push(key);
                });
                this.setState({ currencyList: currencySymbol });
            })
    }

    render() {
        let currenciesItem = this.state.currencyList.map(item => {
            return <Picker.Item key={item} value={item} label={item} />
        });

        return (
            <View style={styles.container}>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                    <Text style={styles.textTitle}>Currency Converter</Text>
                    <Icon
                        style={{ alignSelf: 'flex-end', flex: 1 }}
                        name="settings-outline"
                        color="#727F8B"
                        size={28}
                    />
                </View>
                <View style={{flex:1,flexDirection:'column',alignSelf:'center',justifyContent:'center'}}>
                    <View style={styles.conversionViewContainer}>
                        <Text style={{ fontSize: 16, color: '#727F8B' }}>Select your currency type</Text>
                        
                        <Picker
                            style={{
                                marginTop: 16,
                                height: 50,
                                width: '100%',
                                backgroundColor: '#F1F6FB'
                            }}
                            selectedValue={this.state.fromCurrency}
                            onValueChange={(itemValue, itemIndex) => {
                                console.log('=========FROM CURRENCY========== ' + itemValue);
                                getCurrentRateForBase(itemValue).then((resRates) => {
                                    this.setState({
                                        fromCurrency: itemValue,
                                        baseCurrencyRates: resRates
                                    });
                                });
                            }
                            }>

                            {currenciesItem}

                        </Picker>
                        <Text style={{ marginTop: 16, fontSize: 16, color: '#727F8B' }}>Enter your currency</Text>
                        <View style={{ flexDirection: 'row', marginTop: 16 }}>
                            <Text style={{ marginStart: 16, marginEnd: 16, fontSize: 30, color: '#727F8B' }}>$ - </Text>
                            <TextInput style={{ backgroundColor: '#F1F6FB', fontSize:20,width: '78%' }}
                            keyboardType='decimal-pad'
                                onChangeText={(text) => this.setState({ fromAmount:text })}
                            />
                        </View>

                        <Text style={{ marginTop: 16, fontSize: 16, color: '#727F8B' }}>Select converted currency type</Text>
                        <Picker
                            style={{
                                marginTop: 16,
                                height: 50,
                                width: '100%',
                                backgroundColor: '#F1F6FB'
                            }}
                            selectedValue={this.state.toCurrency}
                            onValueChange={(itemValue, itemIndex) => {
                                this.setState({
                                    toCurrency: itemValue,
                                })
                            }
                            }>
                            {currenciesItem}
                        </Picker>
                        <Text style={{ marginTop: 16, fontSize: 16, color: '#727F8B' }}>Enter your currency</Text>
                        <View style={{ flexDirection: 'row', marginTop: 16 }}>
                            <Text style={{ marginStart: 16, marginEnd: 16, fontSize: 30, color: '#727F8B' }}>$ - </Text>
                            <Text style={{
                                backgroundColor: '#F1F6FB',
                                width: '78%',
                                padding: 10,
                                textAlignVertical: 'center',
                                fontSize: 24,
                                fontWeight: 'bold'
                            }} >
                                {(this.state.fromAmount * this.state.baseCurrencyRates[this.state.toCurrency]).toFixed(2)}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.textConvertRate}>
                        <Text style={{ color: 'white', fontSize:16,textAlignVertical: 'center' }}>
                            1 {this.state.fromCurrency}
                        </Text>
                        <Icon
                            style={{ marginStart: 10 }}
                            name="arrow-right"
                            color="white"
                            size={20} />
                        <Text style={{ color: 'white', fontSize:16, textAlignVertical: 'center', marginStart: 10 }}>
                            {formateToRate(
                                this.state.baseCurrencyRates[this.state.toCurrency],
                                this.state.toCurrency
                            )}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        padding: 24,
        backgroundColor: '#F0F1F3'
    },
    conversionViewContainer: {
        backgroundColor: 'white',
        padding: 20,
        elevation: 1,
        marginTop: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#fff'
    },
    textTitle: {
        flex: 12,
        textAlign: 'center',
        fontSize: 24,
        color: '#727F8B',
        alignSelf: 'center'
    },
    button: {
        marginTop: 24,
        marginBottom: 16,
        marginStart: 24,
        marginEnd: 24,
        flex: 1,
        width: '100%',
        height: 50,
        padding: 10,
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#00D4AF',
        alignItems: 'center'
    },
    textConvertRate: {
        backgroundColor: '#00D4AF',
        marginTop: -30,
        paddingTop: 36,
        flexDirection: 'row',
        paddingStart: 16,
        paddingEnd: 16,
        paddingBottom: 8,
        color: 'white',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#00D4AF'
    }
})