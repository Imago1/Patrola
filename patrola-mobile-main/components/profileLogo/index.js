import * as React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign'

export default function ProfileLogo({ title, onPress, h = 45, w = 45, bgColor = 'rgb(68, 75, 152)', color = "white", fz = 22 }) {
    return (
        <TouchableOpacity style={[{ backgroundColor: bgColor, height: h, width: w }, styles.container]} activeOpacity={0.7} onPress={onPress}>
            <Text style={[{ color: color, fontSize: fz }, styles.btnText]}>{title}</Text>
        </TouchableOpacity>

    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        cursor: 'pointer',
        flexDirection: 'row',
        gap: 5
    },
    btnText: {
        fontWeight: 700,
        textTransform: 'uppercase'
    }

});


