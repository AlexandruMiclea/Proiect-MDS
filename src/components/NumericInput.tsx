// custom component for a numeric input because react native does not have one sadly
import React, { useState } from 'react';
import { TextInput, StyleSheet, View, TouchableOpacity, Text, Keyboard } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Fontisto, MaterialIcons } from '@expo/vector-icons';

type NumericInputParams = {
    label: string;
    onChange: (value: string) => void;
}

const NumericInput = (props: NumericInputParams) => {

    // State variable
    const [value, setValue] = useState(''); 
    const [isFocus, setIsFocus] = useState(false); 

    const colorScheme = useColorScheme();
    const mainColor = Colors[colorScheme ?? 'light'].tint; 

    const inputLabel = props.label; // Store the label from props
    const propsOnChange = props.onChange; // Store the onChange function from props

    // function that on text change deletes the characters that are not numbers
    const handleTextChange = (text: string) => {
        const numericValue = text.replace(/[^0-9]/g, ''); 
        propsOnChange(numericValue); 
        setValue(numericValue); 
    };

    const handleSave = () => {
        Keyboard.dismiss(); // Dismiss the keyboard when the save button is pressed
    };

    const renderLabel = () => {
        if (value) {
          return (
            <Text style={[styles.label, isFocus && { color: mainColor }]}>
              { props.label.charAt(0).toUpperCase() + props.label.slice(1)}
            </Text>
          );
        }
        return null;
    };

    return (
        <View style={styles.container}>
            <View style={[styles.outlineContainer, isFocus && { borderColor: mainColor }]}>
                <Fontisto
                    style={styles.icon}
                    color={isFocus ? mainColor : 'black'}
                    name='euro'
                    size={14}
                />
                {renderLabel()}
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={handleTextChange}
                    keyboardType="numeric"
                    placeholder={`Enter ${inputLabel}`}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    placeholderTextColor="black"
                />
                <TouchableOpacity style={[styles.button, {backgroundColor: mainColor}]} onPress={handleSave}>
                    <MaterialIcons size={20} color="white" name="check"/>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    icon: {
        marginLeft: 12,
    },
    outlineContainer: {
        borderColor: 'gray',
        flex: 1,
        borderWidth: 1,
        flexDirection: 'row',
        borderRadius: 8,
        alignItems: 'center',
    },
    label: {
        position: 'absolute',
        left: 6,
        top: -8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
        backgroundColor: 'white',
    },
    container: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        padding: 10,
        fontSize: 16,
        height: 50,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    button: {
        marginLeft: 8,
        padding: 7,
        borderRadius: 8,
        marginRight: 6,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default NumericInput;
