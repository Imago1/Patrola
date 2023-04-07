import * as React from 'react';
import { Image, View, StyleSheet, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import logo from '../../../../assets/logo.png';
import { Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../../components/customButton';
import CustomInput from '../../../components/customInput';
import { GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db, googleSignin } from "../../../../firebaseConfig";
import { useFormik } from 'formik';
import { useToast } from "react-native-toast-notifications";
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from "expo-web-browser"
import * as AuthSession from 'expo-auth-session';
import { async } from '@firebase/util';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';

const windowHeight = Dimensions.get('window').height;
WebBrowser.maybeCompleteAuthSession();

export default function Login({ navigation }) {
    const redirect = AuthSession.makeRedirectUri({ path: 'sign-in' })
    const [token, setToken] = React.useState("");
    const [loading, setLoading] = React.useState(false)
    const [googleLoading, setGoogleLoading] = React.useState(false)
    const toast = useToast();
    const user = auth.currentUser

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: '794480700240-7fuhvb9csvpg0e7l6r5sghf422o6222p.apps.googleusercontent.com',
        iosClientId: '794480700240-f4vi72cemepc12kk5kjp3a94bnm9niev.apps.googleusercontent.com',
        expoClientId: '794480700240-ecin0et72dl33ni50bp82ool4s1mp5rc.apps.googleusercontent.com',
        redirectUri: redirect,

    });

    React.useEffect(() => {
        if (response?.type === "success") {
            setGoogleLoading(true)
            setToken(response.authentication.accessToken);
            const { idToken, accessToken } = response.authentication;
            const credential = GoogleAuthProvider.credential(
                idToken,
                accessToken
            );
            signInWithCredential(auth, credential)
                .then(async () => {
                    const user = auth.currentUser
                    const q = query(collection(db, "users"), where("email", "==", user?.email));
                    const querySnapshot = await getDocs(q); 1
                    let data = null
                    querySnapshot.forEach(async (doc) => {
                        data = doc.data()
                    });
                    if (data) {
                        navigation.navigate("/home");
                    } else {
                        await setDoc(doc(db, "users", user.uid), {
                            name: user.displayName,
                            email: user.email,
                            allowence: false,
                            userUID: user.uid,
                            photoURL: user?.photoURL,
                        })
                            .then(async () => {
                                toast.show('You have successfully login!', {
                                    type: "success",
                                    placement: "bottom",
                                    duration: 4000,
                                    offset: 30,
                                    animationType: "zoom-in",
                                });
                                navigation.navigate("/home");
                                setGoogleLoading(false)

                            })
                            .catch((error) => {
                                console.log("e", error)
                                setGoogleLoading(false)
                            });
                    }
                }).catch((e) => setGoogleLoading(false))
        }
        setGoogleLoading(false)

    }, [response, token]);


    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
    });
    const logIn = () => {
        setLoading(true)
        if (!(formik.values.email || formik.values.password)) {
            toast.show('Please enter email and password!', {
                type: "danger",
                placement: "bottom",
                duration: 4000,
                offset: 30,
                animationType: "zoom-in",
            });
            return;
        }
        signInWithEmailAndPassword(auth, formik.values.email, formik.values.password)
            .then((userCredential) => {
                const user = auth.currentUser
                if (user.emailVerified) {
                    // email is verified.
                    toast.show('You have successfully login!', {
                        type: "success",
                        placement: "bottom",
                        duration: 4000,
                        offset: 30,
                        animationType: "zoom-in",
                    });
                    navigation.navigate("/home");
                    setLoading(false)
                    formik.setFieldValue('email', null)
                    formik.setFieldValue('password', null)
                } else {
                    setLoading(false)
                    toast.show('Please verify your email address!', {
                        type: "danger",
                        placement: "bottom",
                        duration: 4000,
                        offset: 30,
                        animationType: "zoom-in",
                    });
                }
            })
            .catch((error) => {
                setLoading(false)
                toast.show('Invalid email and password!', {
                    type: "danger",
                    placement: "bottom",
                    duration: 4000,
                    offset: 30,
                    animationType: "zoom-in",
                });
            });

    }

    React.useEffect(() => {
        if (user) {
            if (user.emailVerified) {
                navigation.navigate("/home");
            }
        }
    }, [user])
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
                        <Text style={styles.heading}>Log In</Text>
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
                        <View style={styles.fieldWrap}>
                            <View style={styles.passwordFieldWrap}>
                                <Text style={styles.fieldTitle}>Šifra</Text>
                                <TouchableOpacity onPress={() => navigation.navigate("/forgotPassword")}>
                                    <Text style={styles.fieldTitleWarn}>Zaboravljena šifra?</Text>
                                </TouchableOpacity>
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
                    <View style={styles.BtnWrapper}>
                        <View style={styles.BtnMain}>
                            <CustomButton title={loading ? <ActivityIndicator size="large" color={'white'} /> : "Uloguj se"} onPress={logIn} />
                        </View>
                    </View>
                    <View style={styles.dividerWrap}>
                        <View style={styles.dividerBorder1} />
                        <Text style={styles.divider}>Ili</Text>
                        <View style={styles.dividerBorder2} />
                    </View>
                    <View style={styles.BtnWrapper}>
                        <View style={styles.BtnMain}>
                            <CustomButton title={googleLoading ? <ActivityIndicator size="large" color={'black'} /> : "Nastavi sa Google-om"} icon={'google'} bgColor={"white"} color={'black'} onPress={() => {
                                promptAsync();
                            }}
                            />
                        </View>
                    </View>
                    <View style={styles.redirectContainer}>
                        <Text style={styles.redirectMainText}>Nemate nalog jos uvijek?</Text>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('/signUp')}  ><Text style={styles.redirectText} >Kreiraj ovdje</Text></TouchableOpacity>
                    </View>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('landing')}>
                        <Text style={styles.punchLine}>Kreirajte prijavu kao gost!</Text>
                    </TouchableOpacity>
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
        paddingVertical: 20
    },
    privacy: {
        textAlign: 'center',
        color: 'gray'
    }
});


