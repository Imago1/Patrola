import * as React from 'react';
import { Image, View, StyleSheet, ScrollView, Text, ActivityIndicator } from 'react-native';
import { Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Limes from '../../../../assets/limes.jpeg'
import CustomButton from '../../../components/customButton';
import CustomInput from '../../../components/customInput';
import Slider from '../../../components/slider/Slider';
import { auth, db } from "../../../../firebaseConfig";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { async } from '@firebase/util';

const windowHeight = Dimensions.get('window').height;
export default function ConfirmApplication({ route, navigation }) {
    const user = auth.currentUser;
    const { selectedImage, address, city, latitude, longitude } = route.params;
    const [loading, setLoading] = React.useState(false)
    const [details, setDetails] = React.useState('');
    const getCurrentDate = () => {
        var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        var today = new Date();
        return today.toLocaleDateString("en-US", options)//format: d-m-y;
    }
    const data = [];
    let id = 1;

    for (const [key, value] of Object.entries(selectedImage)) {
        if (value) {
            data.push({ id: id++, img: value })
        }
    }

    const confirmApp = async () => {
        setLoading(true)
        // 
        let newAppRef = doc(collection(db, "applications"));
        let applicationData = {
            address: address,
            city: city,
            selectedImage: selectedImage,
            details: details,
            appId: newAppRef?.id
        }
        const tempCode = newAppRef?.id.slice(-6);

        await setDoc(newAppRef, {
            address: address,
            city: city,
            selectedImage: selectedImage,
            details: details,
            userUID: user ? user.uid : null,
            applicationCode: `PRI-${tempCode}`,
            latitude: latitude,
            longitude: longitude,
            appId: newAppRef?.id,
            appDate: getCurrentDate()
        })
            .then(async (res) => {
                let applicationCode = `PRI-${tempCode}`
                await AsyncStorage.setItem('applications', JSON.stringify(applicationData))
                    .then(() => {
                        setLoading(false)
                        navigation.navigate('/applicationSuccess', {
                            applicationCode: applicationCode,
                        });
                    }).catch((e) => console.log(e))
            })
            .catch((error) => {
                console.log("Error writing document: ", error.message);
                setLoading(false)
            });
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.mapWrapper}>
                        <Slider Slides={data} type={'uri'} />
                    </View>
                    <View style={styles.locationWrapper}>
                        <View style={styles.confirmLocationWrap}>
                            <View style={styles.subWrap}>
                                <Text style={styles.content}>Grad</Text>
                                <Text style={styles.content}>{city ? city : "-"}</Text>
                            </View>
                            <View style={styles.subWrapDivider}>
                                <Text style={styles.content}>Datum prijave</Text>
                                <Text style={styles.content}>{getCurrentDate()}</Text>
                            </View>
                            <View style={styles.subWrap}>
                                <Text style={styles.content}>Lokacija</Text>
                                <Text style={styles.content} numberOfLines={3}>{address}</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={styles.moreContent}>Detaljnije informacije</Text>
                            <View style={styles.moreContentWrap}>
                                <CustomInput multiline={true} h={180}
                                    onChangeText={newText => setDetails(newText)}
                                    value={details}
                                />
                            </View>
                        </View>
                        <View style={styles.BtnWrapper}>
                            <CustomButton title={loading ? <ActivityIndicator size="large" color={'white'} /> : "Potvrdi prijavu"} onPress={() => confirmApp()} />
                        </View>
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
        alignItems: 'center',
        position: 'relative'
    },
    mapWrapper: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        height: 300,
    },
    map: {
        width: "100%",
        height: "100%"
    },
    locationWrapper: {
        width: "95%",
        backgroundColor: 'white',
        minHeight: windowHeight,
        borderTopEndRadius: 20,
        borderTopStartRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        position: 'absolute',
        top: 230,
        paddingTop: 20,
        paddingHorizontal: 20
    },
    idWrapper: {
        height: 58,
        backgroundColor: 'rgb(68, 75, 152)',
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
        cursor: 'pointer'
    },
    id: {
        color: 'white',
        fontSize: 30,
        fontWeight: '700'
    },
    confirmLocationWrap: {
        backgroundColor: "#f5f5f5",
        padding: 10,
        marginVertical: 20,
        borderRadius: 15
    },
    moreContentWrap: {
        marginTop: 10
    },
    moreContent: {
        fontSize: 16,
        color: 'gray'
    },
    subWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 60,
        alignItems: 'center',
        gap: 10

    },
    subWrapDivider: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 50,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        alignItems: 'center',
        borderColor: 'lightgray'
    },
    content: {
        color: 'black',
        fontSize: 15,
        maxWidth: 250
    },
    BtnWrapper: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20
    },
});


