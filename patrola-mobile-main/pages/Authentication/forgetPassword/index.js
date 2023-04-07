import * as React from 'react';
import { Image, View, StyleSheet, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import logo from '../../../../assets/logo.png';
import tempImage from '../../../../assets/tempImage.png';
import { Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../../components/customButton';
import CustomInput from '../../../components/customInput';
import CheckBox from '@react-native-community/checkbox';
import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../../firebaseConfig";
import { useFormik } from 'formik';
import { ToastAlert } from '../../../components/toast/toast';
import { useToast } from "react-native-toast-notifications";

const windowHeight = Dimensions.get('window').height;


export default function ForgotPassword({ navigation }) {
    const formik = useFormik({
        initialValues: {
            email: "",
        },
    });
    const toast = useToast();
    const [loading, setLoading] = React.useState(false)



    const reset = () => {
        setLoading(true)
        sendPasswordResetEmail(auth, formik.values.email)
            .then(() => {
                toast.show("Password reset email sent!", {
                    type: "success",
                    placement: "bottom",
                    duration: 4000,
                    offset: 30,
                    animationType: "zoom-in",
                });
                navigation.navigate("/login");
                setLoading(false)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
                toast.show(errorMessage, {
                    type: "danger",
                    placement: "bottom",
                    duration: 4000,
                    offset: 30,
                    animationType: "zoom-in",
                });
                setLoading(false)
            });

    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.logoWrapper}>
                        <Image
                            style={styles.mainlogo}
                            source={logo}
                        />
                    </View>
                    <View style={styles.SliderWrap}>
                        <Text style={styles.heading}>Zaboravljena šifra?</Text>
                    </View>
                    <View style={styles.authWrap}>

                        <View style={styles.fieldWrap}>
                            <Text style={styles.fieldTitle}>Email</Text>
                            <CustomInput h={60} placeholder={'Unesite vašu email adresu'}
                                id="email"
                                onChangeText={formik.handleChange('email')}
                                value={formik.values.email}
                                onBlur={formik.handleBlur}
                            />
                        </View>
                    </View>
                    <View style={styles.BtnWrapper}>
                        <View style={styles.BtnMain}>
                            <CustomButton title={loading ? <ActivityIndicator size="large" color={'white'} /> : "Resetuj sifru"} onPress={reset} />
                        </View>
                    </View>
                    <View style={styles.privacyWrap}>
                        <Text style={styles.privacy}>
                        Nastavljajući, slažete se i prihvaćate naše Uslove korištenja i Politiku privatnosti. Patrola nikada ne šalje vaše korisničke podatke prilikom kreiranja anonimne prijave. Poštujemo vašu sigurnost i anonimnost.                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        height: windowHeight,
        flex: 1,
        backgroundColor: "white",
    },
    logoWrapper: {
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainlogo: {
        height: "40%",
        width: 150
    },
    SliderWrap: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentWrap: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingBottom: 10
    },
    checkboxWrap: {
        marginBottom: 10,
        paddingLeft: 10
    },
    fieldWrap: {
        height: 100,
        justifyContent: 'center'
    },
    contentWrapMain: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    fieldTitle: {
        color: 'black',
        fontSize: 16,
        paddingBottom: 5
    },
    passwordFieldWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    heading: {
        fontSize: 30,
        color: "black",
        fontWeight: 600,
    },
    authWrap: {
        paddingHorizontal: 20,
        paddingVertical: 20
    },
    contentMain: {
        color: 'gray'
    },
    contentSub: {
        color: 'rgb(68, 75, 152)'
    },
    BtnWrapper: {
        alignItems: "center",
        justifyContent: "center",
    },
    BtnMain: {
        width: "90%",
    },

    privacyWrap: {
        paddingHorizontal: 25,
        paddingVertical: 20
    },
    privacy: {
        textAlign: 'center',
        color: 'gray'
    }
});


