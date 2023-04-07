import * as React from 'react';
import { Image, View, StyleSheet, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import logo from '../../../../assets/logo.png';
import { Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../../components/customButton';
import CustomInput from '../../../components/customInput';
// import CheckBox from '@react-native-community/checkbox';
import CheckBox from 'expo-checkbox';
import { createUserWithEmailAndPassword, GoogleAuthProvider, sendEmailVerification, updateProfile } from "firebase/auth";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../../firebaseConfig";
import { useFormik } from 'formik';
import { useToast } from "react-native-toast-notifications";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { async } from '@firebase/util';

const windowHeight = Dimensions.get('window').height;
export default function SignUp({ navigation }) {
    const formik = useFormik({
        initialValues: {
            user_name: "",
            email: "",
            password: "",
            allow: false
        },
    });
    const toast = useToast();
    const [loading, setLoading] = React.useState(false)

    const signUp = async (e) => {
        setLoading(true)
        if (!(formik.values.email || formik.values.password || formik.values.user_name)) {
            toast.show('Molimo popunite sva polja!', {
                type: "danger",
                placement: "bottom",
                duration: 4000,
                offset: 30,
                animationType: "zoom-in",
            });
            return;
        } else if (formik.values.password.length < 8) {
            toast.show('Lozinka je prekratka! Treba imati najmanje 8 znakova.', {
                type: "danger",
                placement: "bottom",
                duration: 4000,
                offset: 30,
                animationType: "zoom-in",
            });
            return;
        }
        createUserWithEmailAndPassword(auth, formik.values.email, formik.values.password)
            .then(async () => {
                toast.show(`Poslali smo link za verifikaciju putem e-pošte ${formik.values.email}`, {
                    type: "success",
                    placement: "bottom",
                    duration: 4000,
                    offset: 30,
                    animationType: "zoom-in",
                });
                const user = auth.currentUser;

                await setDoc(doc(db, "users", user.uid), {
                    name: formik.values.user_name,
                    email: formik.values.email,
                    allowence: formik.values.allow,
                    userUID: user.uid
                })
                    .then(async () => {
                        const getApplications = await AsyncStorage.getItem('applications');
                        const applications = JSON.parse(getApplications)
                        updateProfile(auth.currentUser, {
                            displayName: formik.values.user_name,
                        }).then(async () => {
                            sendEmailVerification(auth.currentUser)
                                .then(async (res) => {
                                    if (applications?.appId) {
                                        const app = doc(db, "applications", applications?.appId)
                                        await updateDoc(app, {
                                            userUID: user.uid,
                                        }).then(async () => {
                                            await AsyncStorage.removeItem('applications');
                                            navigation.navigate("/login");
                                            setLoading(false)
                                            // Profile updated!
                                            // ...
                                        }).catch((error) => {
                                            setLoading(false)
                                            // An error occurred
                                            // ...
                                        });
                                    } else {
                                        setLoading(false)
                                        navigation.navigate("/login");
                                    }
                                });
                        }).catch((error) => {
                            setLoading(false)
                        });
                    })
                    .catch((error) => {
                        setLoading(false)
                    });

                formik.setFieldValue('email', null)
                formik.setFieldValue('password', null)
                formik.setFieldValue('user_name', null)

            }).catch((error) => {
                var errorMessage = error.message;
                if (errorMessage === "Firebase: Error (auth/email-already-in-use).") {
                    toast.show("Email Address is already in use!", {
                        type: "danger",
                        placement: "bottom",
                        duration: 4000,
                        offset: 30,
                        animationType: "zoom-in",
                    });
                }
            });
        e.preventDefault();
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView >
                <View style={styles.container}>
                    <View style={styles.logoWrapper}>
                        <Image
                            style={styles.mainlogo}
                            source={logo}
                        />
                    </View>
                    <View style={styles.SliderWrap}>
                        <Text style={styles.heading}>Kreiraj novi nalog</Text>
                    </View>
                    <View style={styles.authWrap}>
                        <View style={styles.fieldWrap}>
                            <Text style={styles.fieldTitle}>Korisničko ime</Text>
                            <CustomInput h={60} placeholder={'Unesite vaše korisničko ime'}
                                id="user_name"
                                onChangeText={formik.handleChange('user_name')}
                                value={formik.values.user_name}
                                onBlur={formik.handleBlur}
                            />
                        </View>
                        <View style={styles.fieldWrap}>
                            <Text style={styles.fieldTitle}>Email</Text>
                            <CustomInput h={60} placeholder={'Unesite vašu email adresu'}
                                id="email"
                                onChangeText={formik.handleChange('email')}
                                value={formik.values.email}
                                onBlur={formik.handleBlur}
                            />
                        </View>
                        <View style={styles.fieldWrap}>
                            <View style={styles.passwordFieldWrap}>
                                <Text style={styles.fieldTitle}>Šifra</Text>
                                <Text style={styles.fieldTitleWarn}>min 8 karaktera</Text>
                            </View>
                            <CustomInput h={60} placeholder={'Unesite vašu šifru'}
                                id="password"
                                onChangeText={formik.handleChange('password')}
                                value={formik.values.password}
                                onBlur={formik.handleBlur}
                                secureTextEntry={true}
                            />
                        </View>
                    </View>
                    <View style={styles.contentWrapMain}>
                        <View style={styles.checkboxWrap}>
                            <CheckBox
                                style={styles.checkbox}
                                value={formik.values.allow}
                                onValueChange={() => { formik.setFieldValue('allow', !formik.values.allow) }}
                            />
                        </View>
                        <View style={styles.contentWrap}>
                            <Text style={styles.contentMain}>Prihvatam </Text>
                            <Text style={styles.contentSub}>Uslove korištenja </Text>
                            <Text style={styles.contentMain}>i </Text>
                            <Text style={styles.contentSub}>Politiku</Text>
                            <Text style={styles.contentSub}> privatnosti</Text>
                        </View>

                    </View>

                    <View style={styles.BtnWrapper}>
                        <View style={styles.BtnMain}>
                            <CustomButton title={loading ? <ActivityIndicator size="large" color={'white'} /> : "Kreiraj nalog"} onPress={signUp} />
                        </View>
                    </View>
                    {/* <View style={styles.dividerWrap}>
                        <View style={styles.dividerBorder1} />
                        <Text style={styles.divider}>Ili</Text>
                        <View style={styles.dividerBorder2} />
                    </View>
                    <View style={styles.BtnWrapper}>
                        <View style={styles.BtnMain}>
                            <CustomButton title={'Make with google'} icon={'google'} bgColor={"white"} color={'black'} />
                        </View>
                    </View> */}
                    <View style={styles.redirectContainer}>
                        <Text style={styles.redirectMainText}>Već imate korisnički nalog?</Text>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('/login')}><Text style={styles.redirectText}>Uloguj se</Text></TouchableOpacity>
                    </View>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('landing')}>
                        <Text style={styles.punchLine}>Kreirajte prijavu kao gost!</Text>
                    </TouchableOpacity>
                    <View style={styles.privacyWrap}>
                        <Text style={styles.privacy}>
                        Patrola nikada ne šalje vaše korisničke podatke prilikom kreiranja anonimne prijave. Poštujemo vašu sigurnost i anonimnost.                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        height: windowHeight,
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
        paddingLeft: 10,
        paddingBottom: 10,
        flexWrap: 'wrap'
    },
    dividerWrap: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4
    },
    dividerBorder1: {
        width: '40%',
        height: 1,
        borderWidth: 0.5,
        borderStyle: 'dotted',
        borderColor: 'lightgray',
    },
    dividerBorder2: {
        width: '40%',
        height: 1,
        borderWidth: 0.5,
        borderStyle: 'dotted',
        borderColor: 'lightgray',
    },
    divider: {
        color: 'lightgray',
        textAlign: 'center'
    },
    punchLine: {
        textAlign: 'center',
        color: 'black',
        fontSize: 15
    },
    checkboxWrap: {
        marginBottom: 10,
    },
    fieldWrap: {
        height: 100,
        justifyContent: 'center'
    },
    contentWrapMain: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20
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
    fieldTitleWarn: {
        color: 'gray',
        fontSize: 14
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
    },
    privacyWrap: {
        paddingHorizontal: 25,
        height: 50
    },
    privacy: {
        textAlign: 'center',
        color: 'gray'
    }
});


