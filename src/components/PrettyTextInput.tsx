import React, { useState } from 'react';
import { TextInput, StyleSheet, View, TouchableOpacity, Text, Keyboard } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

type NumericInputParams = {
    label: string;
    onChange: (value: string) => void;
    icon: string;
    secure: boolean;
}

const PrettyTextInput = (props: NumericInputParams) => {

    // State variables
    const [value, setValue] = useState(''); 
    const [isFocus, setIsFocus] = useState(false); 

    const colorScheme = useColorScheme();
    const mainColor = Colors[colorScheme ?? 'light'].tint; 

    const inputLabel = props.label; // Store the label from props
    const propsOnChange = props.onChange; // Store the onChange function from props
    const iconName = props.icon;
    const isPassword = props.secure;

    const handleTextChange = (text: string) => {
        propsOnChange(text); 
        setValue(text); 
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
                <FontAwesome
                    style={styles.icon}
                    color={isFocus ? mainColor : 'black'}
                    name={iconName}
                    size={14}
                />
                {renderLabel()}
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={handleTextChange}
                    placeholder={`Enter ${inputLabel}`}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    placeholderTextColor="black"
                    secureTextEntry={isPassword}
                />
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

export default PrettyTextInput;
