import React from 'react';
import { SafeAreaView, StyleSheet, TextInput } from 'react-native';

const CustomInput = ({ br = 15, editable = true, placeholder, multiline = false, h = 50, type, onBlur, value, onChangeText, id, secureTextEntry = false }) => {
    return (
        <SafeAreaView>
            <TextInput
                style={[{ height: h, borderRadius: br }, styles.input]}
                placeholder={placeholder}
                multiline={multiline}
                placeholderTextColor={'black'}
                onChangeText={onChangeText}
                value={value}
                onBlur={onBlur}
                secureTextEntry={secureTextEntry}
                id={id}
                editable={editable}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    input: {
        // margin: 12,
        borderWidth: 1,
        padding: 10,
        backgroundColor: "#f5f5f5",
        borderWidth: 0,
        color: "black"
    },
});

export default CustomInput;