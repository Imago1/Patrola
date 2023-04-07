import * as React from 'react';
import { Image, View, StyleSheet, ScrollView, Text, ActivityIndicator } from 'react-native';
import { Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Map from '../../../../assets/map.png'
import CustomButton from '../../../components/customButton';
import CustomInput from '../../../components/customInput';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';

const windowHeight = Dimensions.get('window').height;
export default function ConfirmLocation({ route, navigation }) {
    const { selectedImage, location } = route.params;
    const [updateLocation, setUpdateLocation] = React.useState({
        latitude: 43.856430,
        longitude: 18.413029,
    });
    const [address, setAddress] = React.useState();
    const [city, setCity] = React.useState("");
    const [loading, setLoading] = React.useState(false)


    React.useEffect(() => {
        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + updateLocation?.latitude + ',' + updateLocation?.longitude + '&key=' + "AIzaSyATkWxEYxIBMON7Hu4o6yC6Zygy09j2-cc")
            .then((response) => response.json())
            .then((responseJson) => {
                const res = responseJson?.results.find(data => {
                    return data?.types.includes("street_address")
                });
                const tempAddress = res ? res : responseJson?.results[0]
                setAddress(tempAddress?.formatted_address)
            })
        getCity();


    }, [updateLocation])

    const getCity = async () => {
        let regionName = await Location.reverseGeocodeAsync({
            latitude: updateLocation?.latitude,
            longitude: updateLocation?.longitude,
        });
        const ct = regionName[0]?.city
        setCity(ct)
    }

    const onNextStep = () => {
        setLoading(true)
        navigation.navigate('/confirmApplicatuin', {
            selectedImage: selectedImage,
            address: address,
            city: city,
            latitude: updateLocation?.latitude,
            longitude: updateLocation?.longitude,
        });
        setLoading(false)
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView keyboardShouldPersistTaps={'handled'}>
                <View style={styles.container}>
                    <View style={styles.mapWrapper}>
                        <MapView style={styles.map}
                            region={{
                                latitude: updateLocation?.latitude,
                                longitude: updateLocation?.longitude,
                                latitudeDelta: 0.02000,
                                longitudeDelta: 0.02000
                            }}
                            provider={PROVIDER_GOOGLE}
                        >
                            <Marker draggable
                                coordinate={{ latitude: updateLocation?.latitude, longitude: updateLocation?.longitude }}
                                onDragEnd={(e) => setUpdateLocation({ ...updateLocation, latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude })}
                                position={"destination"}
                            />
                        </MapView>
                    </View>
                    <View style={styles.locationWrapper}>
                        <Text style={styles.heading}>Potvrdi lokaciju prijave</Text>
                        <View>
                            <ScrollView keyboardShouldPersistTaps={'handled'}>
                                <GooglePlacesAutocomplete
                                    fetchDetails={true}
                                    placeholder={'Search Address'}
                                    onPress={(data, details = null) => {
                                        const coords = details.geometry.location
                                        setUpdateLocation({ ...updateLocation, latitude: coords.lat, longitude: coords.lng })
                                    }}
                                    query={{
                                        key: "AIzaSyATkWxEYxIBMON7Hu4o6yC6Zygy09j2-cc",
                                        language: 'en',
                                        components: 'country:ba',
                                    }}


                                    textInputProps={{
                                        value: address,
                                        onChangeText: (text) => { setAddress(text) }
                                    }}
                                    styles={{
                                        textInputContainer: {
                                            borderWidth: 1,
                                            padding: 10,
                                            backgroundColor: "#f5f5f5",
                                            borderWidth: 0,
                                            borderRadius: 15,
                                            color: "black"
                                        },
                                        textInput: {
                                            // height: 38,
                                            color: '#5d5d5d',
                                            backgroundColor: '#f5f5f5',
                                            fontSize: 16,
                                        },
                                    }}
                                />
                            </ScrollView>
                        </View>
                        <Text style={styles.subline}>Ukoliko lokacija nije ispravna, odaberite novu pomjeranjem oznake ili unošenjem adrese</Text>
                        <View style={styles.BtnWrapper}>
                            <CustomButton title={loading ? <ActivityIndicator size="large" color={'white'} /> : "Potvrdi prijavu"} onPress={() => onNextStep()} />
                        </View>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView >

    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        alignItems: 'center',
        position: 'relative',
        height: windowHeight
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
        paddingTop: 20,
        paddingHorizontal: 20
    },
    heading: {
        fontSize: 22,
        fontWeight: 700,
        color: 'black',
        paddingVertical: 10
    },
    subline: {
        color: 'black',
        paddingVertical: 10
    },
    BtnWrapper: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20
    },
});


