import * as React from 'react';
import { Image, View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import logo from '../../../../assets/logo.png';
import tempImage from '../../../../assets/tempImage.png';
import tempImage2 from '../../../../assets/temp3.png';
import tempImage3 from '../../../../assets/success.gif';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../../components/customButton';
import Slider from '../../../components/slider/Slider';
import { auth } from '../../../../firebaseConfig';
export default function LandingPage({ navigation }) {
    const user = auth.currentUser;

    const data = [
        {
            id: 2,
            img: tempImage,
            price: 'Dodaj lokaciju',
        },
        {
            id: 1,
            img: tempImage2,
            price: 'Dodaj slike',
        },
        {
            id: 3,
            img: tempImage3,
            price: 'Potvrdi prijavu',
        },
    ];

    React.useEffect(() => {
        if (user) {
            navigation.navigate("/home");
        }
    }, [user])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView contentContainerStyle={{ flex: 1 }} >
                <View style={styles.container}>
                    <View style={styles.logoWrapper}>
                        <Image
                            style={styles.mainlogo}
                            source={logo}
                        />
                    </View>
                    <View style={styles.SliderWrap}>
                        <Slider Slides={data} />
                    </View>
                    <View style={styles.BtnWrapper}>
                        <View style={styles.BtnMain}>
                            <CustomButton title={'Kreiraj prijavu'} onPress={() => navigation.navigate('/addPicture')} />
                        </View>
                    </View>
                    <View style={styles.redirectContainer}>
                        <Text style={styles.redirectMainText}>Već ste registrovani?</Text>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('/login')} ><Text style={styles.redirectText}>Ulogujte se</Text></TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
        justifyContent: 'center'
    },
    logoWrapper: {
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    SliderWrap: {
        height: 400,
        alignItems: 'center',
        justifyContent: 'center',
        // paddingBottom: 30,
    },
    heading: {
        fontSize: 30,
        color: "black",
        fontWeight: 600,
    },
    BtnWrapper: {
        alignItems: "center",
        justifyContent: "center",
    },
    BtnMain: {
        width: "80%",
    },
    redirectContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        height: 50,
    },
    redirectText: {
        color: 'rgb(68, 75, 152)',
        paddingLeft: 5
    },
    redirectMainText: {
        color: 'gray'
    }
});


