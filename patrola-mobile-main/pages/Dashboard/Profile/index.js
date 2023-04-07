import * as React from 'react';
import { Image, View, StyleSheet, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import logo from '../../../../assets/logo.png';
import tempImage from '../../../../assets/tempImage.png';
import { Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../../components/customButton';
import CustomInput from '../../../components/customInput';
import CheckBox from '@react-native-community/checkbox';
import ProfileLogo from '../../../components/profileLogo';
import { signOut, updatePassword, updateProfile } from 'firebase/auth';
import { auth, db } from "../../../../firebaseConfig";
import { useFormik } from 'formik';
import * as ImagePicker from 'expo-image-picker';
import { doc, updateDoc } from 'firebase/firestore';

const windowHeight = Dimensions.get('window').height;
export default function Profile({ navigation }) {
    const [image, setImage] = React.useState(null);
    const [loading, setLoading] = React.useState(false)

    const formik = useFormik({
        initialValues: {
            user_name: "",
            email: "",
            password: "",
        },
    });

    const logOut = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            navigation.navigate('/login')
        }).catch((error) => {
            // An error happened.
        });
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        const Mediapermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    React.useEffect(() => {
        const user = auth.currentUser
        formik.setFieldValue("user_name", user.displayName)
        formik.setFieldValue("email", user.email)
        if (user.photoURL) {
            setImage(user.photoURL)
        }
    }, [])

    let nameFirstLetter = formik.values.user_name ? Array.from(formik.values.user_name)[0] : "";

    const onSave = async () => {
        setLoading(true)
        const user = auth.currentUser
        const app = doc(db, "users", user?.uid)
        await updateDoc(app, {
            name: formik.values.user_name,
            profile: image
        }).then(async () => {
            updateProfile(auth.currentUser, {
                photoURL: image,
                displayName: formik.values.user_name,
            }).then(() => {
                const newPassword = formik.values.password;
                updatePassword(user, newPassword).then(() => {
                    setLoading(false)
                    navigation.navigate("/home");
                }).catch((error) => {
                    console.log("error!", error)
                    setLoading(false)
                });
            }).catch((error) => {
                setLoading(false)
            });
        }).catch((error) => {
            setLoading(false)
            console.log("error!")
        });
    }
    return (
        <ScrollView >
            <View style={styles.container}>
                <View style={styles.logoWrapper}>
                    {image ?
                        <Image source={{ uri: image }} style={{ width: 80, height: 80, borderRadius: 100 }} />
                        :
                        <ProfileLogo fz={36} title={nameFirstLetter} h={80} w={80} onPress={() => navigation.navigate('/profile')} />
                    }
                </View>
                <View style={styles.changeWrapMain} activeOpacity={0.7}>
                    <TouchableOpacity style={styles.changeWrap} onPress={pickImage}>
                        <Text style={styles.change}>Promijeni</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.authWrap}>
                    <View style={styles.fieldWrap}>
                        <Text style={styles.fieldTitle} />
                        <CustomInput h={60} placeholder={'CLIENT INFORMATION'} editable={false} br={0} />
                    </View>
                    <View style={styles.fieldWrap}>
                        <Text style={styles.fieldTitle}>Username</Text>
                        <CustomInput h={60}
                            id="user_name"
                            onChangeText={formik.handleChange('user_name')}
                            value={formik.values.user_name}
                            onBlur={formik.handleBlur}
                        />
                    </View>
                    <View style={styles.fieldWrap}>
                        <Text style={styles.fieldTitle}>Email</Text>
                        <CustomInput h={60} editable={false}
                            id="email"
                            onChangeText={formik.handleChange('email')}
                            value={formik.values.email}
                            onBlur={formik.handleBlur}
                        />
                    </View>
                    <View style={styles.fieldWrap}>
                        <View style={styles.passwordFieldWrap}>
                            <Text style={styles.fieldTitle}>Nova šifra</Text>
                        </View>
                        <CustomInput h={60} placeholder={'Unesite vašu šifru'} editable={true}
                            id="password"
                            onChangeText={formik.handleChange('password')}
                            value={formik.values.password}
                            onBlur={formik.handleBlur}
                            secureTextEntry={true}
                        />
                    </View>
                </View>
                {/* <View style={styles.BtnWrapperMain}>
                    <View style={styles.BtnWrapper}>
                        <View style={styles.BtnMain}>
                            <CustomButton title={'Ostavi dojam'} bgColor={"rgb(255, 213, 36)"} color={'rgb(68, 75, 152)'} />
                        </View>
                    </View>
                </View> */}
                <View style={styles.BtnWrapper}>
                    <View style={styles.BtnMain}>
                        <CustomButton title={loading ? <ActivityIndicator size="large" color={'white'} /> : "Sačuvaj"} onPress={() => onSave()} />
                    </View>
                </View>
                <View style={styles.dividerWrap}>
                    <View style={styles.dividerBorder1} />
                    <Text style={styles.divider}>Ili</Text>
                    <View style={styles.dividerBorder2} />
                </View>
                <View style={styles.redirectContainer}>
                    <TouchableOpacity activeOpacity={0.7} onPress={logOut}  ><Text style={styles.redirectMainText} >Izloguj se</Text></TouchableOpacity>
                </View>
            </View>
        </ScrollView>

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
        marginTop: 10
    },
    BtnMain: {
        width: "90%",
    },
    redirectContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    BtnWrapperMain: {
        marginVertical: 20
    },
    redirectMainText: {
        color: 'gray',
        fontSize: 16,
        fontWeight: 600
    },
    changeWrap: {
        height: 40,
        width: 140,
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
        backgroundColor: 'rgb(231, 231, 255)'
    },
    changeWrapMain: {
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center'
    },
    change: {
        fontSize: 18,
        fontWeight: 800,
        color: 'rgb(107, 78, 255)'
    }
});


