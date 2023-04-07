import * as React from 'react';
import { Image, View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import tempImage from '../../../../assets/success.gif';
import { Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../../components/customButton';
import { auth } from '../../../../firebaseConfig';
const windowHeight = Dimensions.get('window').height;
export default function ApplicationSuccess({ route, navigation }) {
    const { applicationCode } = route.params;
    const user = auth.currentUser;

    const onNextStep = () => {
        if (user) {
            navigation.navigate('/home')
        } else {
            navigation.navigate('/signUp')
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView contentContainerStyle={{ flex: 1 }}>
                <View style={styles.container}>
                    <View style={styles.headWrapper}>
                        <Text style={styles.heading}>Čestitamo!</Text>
                    </View>
                    <View style={styles.SliderWrap}>
                        <Image
                            style={styles.tempImage}
                            source={tempImage}
                        />
                    </View>
                    <View style={styles.sublineWrap}>
                        <Text style={styles.subline}>Uspješno ste napravili novu prijavu</Text>
                    </View>
                    <View style={styles.subHeadingWrap}>
                        <Text style={styles.subHeading}>Šifra prijave</Text>
                        <Text style={styles.subHeading}>{applicationCode}</Text>
                    </View>
                    <View style={styles.listAppWrap}>
                        <Text style={styles.listApp}>Želite da pratite ishod prijave i vidite listu vaših prijava?</Text>
                    </View>
                    <View style={styles.BtnWrapper}>
                        <CustomButton title={user ? 'Nastavi' : 'Kreiraj profil'} onPress={() => onNextStep()} />
                    </View>
                    {
                        !user &&
                        <View style={styles.redirectContainer}>
                            <Text style={styles.redirectMainText}>Već ste registrovani?</Text>
                            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('/login')} ><Text style={styles.redirectText}>Ulogujte se</Text></TouchableOpacity>
                        </View>
                    }

                </View>
            </ScrollView>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
        alignItems: 'center',
    },
    headWrapper: {
        height: 80,
        justifyContent: 'center',
        marginBottom: 10
    },
    SliderWrap: {
        height: 200,
        alignItems: 'center',
    },
    tempImage: {
        height: "100%",
        width: 220
    },
    sublineWrap: {
        width: '70%'
    },
    heading: {
        fontSize: 30,
        color: "black",
        fontWeight: 600,
        marginTop: 20
    },
    BtnWrapper: {
        width: "80%",
    },
    subHeadingWrap: {
        alignItems: 'center'
    },
    listAppWrap: {
        width: '55%',
        paddingVertical: 20
    },
    listApp: {
        fontSize: 15,
        color: 'black',
        textAlign: 'center',
        lineHeight: 20
    },
    subHeading: {
        fontSize: 26,
        color: "black",
        fontWeight: 600,
    },
    subline: {
        textAlign: 'center',
        fontSize: 18,
        color: 'black',
        paddingVertical: 20
    },
    redirectContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        height: 50
    },
    redirectText: {
        color: 'rgb(68, 75, 152)',
        paddingLeft: 5
    },
    redirectMainText: {
        color: 'gray'
    }
});


