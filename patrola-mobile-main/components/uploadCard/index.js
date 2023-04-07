import * as React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'

export default function UploadCard({ subTitle, title, onPress }) {
    return (
        <TouchableOpacity activeOpacity={0.7} style={styles.container} onPress={onPress}>
            <Icon name="upload" style={styles.uploadIcon} size={30} color='rgb(68, 75, 152)' />
            <Text style={styles.btnText}>{subTitle}</Text>
            <Text style={styles.btnText}>{title}</Text>
        </TouchableOpacity>

    );
}

const styles = StyleSheet.create({
    container: {
        height: 180,
        backgroundColor: 'lightgray',
        width: "46%",
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "white",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        cursor: 'pointer',
        marginBottom: 10
    },
    btnText: {
        fontSize: 16,
        color: 'rgb(68, 75, 152)',
    },

});


