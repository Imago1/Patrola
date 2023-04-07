import * as React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign'

export default function CustomButton({ title, onPress, bgColor = 'rgb(68, 75, 152)', color = "white", icon }) {
    return (
        <TouchableOpacity style={[{ backgroundColor: bgColor }, styles.container]} activeOpacity={0.7} onPress={onPress}>
            {icon &&
                <Icon name={icon} style={styles.uploadIcon} size={30} color='blue' />
            }
            <Text style={[{ color: color }, styles.btnText]}>{title} </Text>
        </TouchableOpacity>

    );
}

const styles = StyleSheet.create({
    container: {
        height: 58,
        width: "100%",
        borderRadius: 16,
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
        fontSize: 16,
    }

});


