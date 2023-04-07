import * as React from 'react';
import { Image, View, StyleSheet, ScrollView, Text, ActivityIndicator } from 'react-native';
import { Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Map from '../../../../assets/map.png'
import Pin from '../../../../assets/pin.png'
import CustomButton from '../../../components/customButton';
import * as Location from 'expo-location';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
const windowHeight = Dimensions.get('window').height;
export default function AllowLocation({ route, navigation }) {
    const [location, setLocation] = React.useState(null);
    const [errorMsg, setErrorMsg] = React.useState(null);
    const [loading, setLoading] = React.useState(false)

    const { selectedImage } = route.params;
    const onAllowLocation = async () => {
        setLoading(true)
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        navigation.navigate('/confirmLocation', {
            selectedImage: selectedImage,
            location: {
                latitude: location?.coords?.latitude,
                longitude: location?.coords?.longitude
            }
        });
        setLoading(false)
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView contentContainerStyle={{ flex: 1 }}>
                <View style={styles.container}>
                    <View style={styles.mapWrapper}>
                        {/* <Image source={Map} style={styles.map} /> */}
                        <MapView style={styles.map}
                            region={{
                                latitude: location?.coords?.latitude ?? 43.856430,
                                longitude: location?.coords?.longitude ?? 18.413029,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}
                            provider={PROVIDER_GOOGLE}
                        />
                    </View>
                    <View style={styles.locationWrapper}>
                        <View>
                            <Image source={Pin} />
                        </View>
                        <Text style={styles.heading}>Dozvoli lokacijske usluge</Text>
                        <Text style={styles.subline}>Patrola treba vašu dozvolu kako bi automatski pronašli lokaciju prijave</Text>
                        <View style={styles.BtnWrapper}>
                            <CustomButton title={loading ? <ActivityIndicator size="large" color={'white'} /> : "Dozvoli"} onPress={onAllowLocation} />
                        </View>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        alignItems: 'center',
        position: 'relative'
    },
    mapWrapper: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        height: 400,
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
        top: 380,
        alignItems: 'center',
        paddingTop: 20
    },
    heading: {
        fontSize: 22,
        fontWeight: 700,
        color: 'black',
        paddingVertical: 10
    },
    subline: {
        color: 'black',
        textAlign: 'center',
        paddingHorizontal: 10
    },
    BtnWrapper: {
        width: "90%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20
    },
});


