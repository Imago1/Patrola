import * as React from 'react';
import { Image, View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../../components/customButton';
import ProfileLogo from '../../../components/profileLogo';
import NoReports from '../../../../assets/no-reports.png'
import { auth, db } from "../../../../firebaseConfig";
import { collection, getDocs, query, where } from 'firebase/firestore';
import MapView, { Marker } from 'react-native-maps';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export default function Home({ navigation }) {
    const [app, setApp] = React.useState([])
    const [name, setName] = React.useState("")
    const [profile, setProfile] = React.useState()


    React.useEffect(() => {
        (async () => {
            const user = await auth.currentUser;
            if (user) {
                const username = user.displayName
                setName(username)
                setProfile(user.photoURL)
                const q = query(collection(db, "applications"), where("userUID", "==", user?.uid));
                const querySnapshot = await getDocs(q);
                let temp = []
                querySnapshot.forEach((doc) => {
                    const data = doc.data()
                    temp.push(data)
                });
                setApp(temp)
            }
        })();

    }, [app]);





    let nameFirstLetter = name ? Array.from(name)[0] : "";
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.greetings}>Dobrodošli, {name}</Text>
                    <View>
                        {
                            profile ?
                                <TouchableOpacity onPress={() => navigation.navigate('/profile')} activeOpacity={0.7}>
                                    <Image source={{ uri: profile }} style={{ width: 45, height: 45, borderRadius: 100 }} />

                                </TouchableOpacity>
                                :
                                <ProfileLogo title={nameFirstLetter} onPress={() => navigation.navigate('/profile')} />

                        }
                    </View>
                </View>
                <ScrollView >

                    {
                        app?.length ?
                            <View>
                                <View style={styles.mapWrapper}>
                                    {/* <Image source={Map} style={styles.map} /> */}
                                    <MapView style={styles.map}
                                        region={{
                                            latitude: app[0]?.latitude ?? 43.856430,
                                            longitude: app[0]?.longitude ?? 18.413029,
                                            latitudeDelta: 0.02000,
                                            longitudeDelta: 0.02000
                                        }}
                                    >
                                        <Marker
                                            coordinate={{ latitude: app[0]?.latitude ?? 43.856430, longitude: app[0]?.longitude ?? 18.413029, }}
                                            position={"destination"}
                                        />
                                    </MapView>
                                </View>
                                <View style={styles.appContainer}>
                                    <Text style={styles.heading}>Vaše prijave</Text>
                                    <ScrollView horizontal>
                                        <View style={styles.mainCardWrapper}>
                                            {
                                                app.map((item, index) => {
                                                    return (
                                                        <TouchableOpacity style={styles.cardContainer} key={index} >

                                                            <TouchableOpacity activeOpacity={0.7} style={styles.cardMainWrap} onPress={() => navigation.navigate('/appDetails', { data: item })}>
                                                                <View style={styles.cardImageWrap}>
                                                                    <Image source={{ uri: item?.selectedImage?.image1 ? item?.selectedImage?.image1 : item?.selectedImage?.image2 ? item?.selectedImage?.image2 : item?.selectedImage?.image3 ? item?.selectedImage?.image3 : item?.selectedImage?.image4 }} style={styles.cardImage} />
                                                                </View>
                                                                <View style={styles.contentWrapper}>
                                                                    <Text style={styles.contentHead}>{item?.applicationCode}</Text>
                                                                    <Text style={styles.contentSub}>{item?.address}, {item?.city}</Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                            <View style={styles.statusWrap}>
                                                                <Text style={styles.status}>Otvoreno</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    )
                                                })
                                            }
                                        </View>
                                    </ScrollView>


                                </View>
                            </View>
                            :
                            <View style={styles.noFoundWrap}>
                                <View >
                                    <Image source={NoReports} />
                                </View>
                                <View style={styles.subHeadingWrap}>
                                    <Text style={styles.subHeading}>Trenutno nemate nijednu prijavu</Text>
                                </View>
                                <View style={styles.sublineWrap}>
                                    <Text style={styles.subline}>Molimo kreirajte novu klikom na dugme ispod</Text>
                                </View>
                            </View>
                    }

                    <View style={styles.BtnWrapper}>
                        <View style={styles.BtnMain}>
                            <CustomButton title={'Kreiraj novu prijavu'} onPress={() => navigation.navigate('/addPicture')} />
                        </View>
                    </View>

                </ScrollView>

            </View>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        height: windowHeight,
        backgroundColor: "white",
        position: 'relative',
        flex: 1
    },
    header: {
        height: 80,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    greetings: {
        fontSize: 22,
        color: 'black',
        fontWeight: '700',
        textTransform: 'capitalize'
    },
    appContainer: {
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    heading: {
        fontSize: 22,
        color: 'black',
        fontWeight: '700',

    },
    mapWrapper: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        height: 250,
    },
    map: {
        width: "100%",
        height: "100%"
    },
    mainCardWrapper: {
        flexDirection: 'row',
        // flexWrap: 'wrap',
        // justifyContent: 'space-around',
        gap: 30,
        width: '100%',
    },
    cardContainer: {
        width: 150,
    },
    cardImageWrap: {
        width: "100%",
        height: 130,
        marginTop: 10
    },
    cardMainWrap: {
        width: "100%",
    },
    cardImage: {
        width: '100%',
        height: '100%',
        borderRadius: 20
    },
    contentWrapper: {
        width: "100%",
        paddingVertical: 10
    },
    contentHead: {
        fontSize: 16,
        fontWeight: 700,
        color: 'black'
    },
    contentSub: {
        lineHeight: 18,
        color: 'gray',
        fontSize: 13,
        paddingTop: 5
    },
    BtnWrapper: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        height: 100
    },
    BtnMain: {
        width: "80%",
    },
    noFoundWrap: {
        height: 400,
        alignItems: 'center',
        justifyContent: 'center'
    },
    sublineWrap: {
        width: '65%'
    },
    subHeading: {
        fontSize: 20,
        color: "black",
        fontWeight: 600,
        textAlign: 'center'
    },
    subline: {
        textAlign: 'center',
        fontSize: 16,
        color: 'black',
        paddingTop: 5
    },
    subHeadingWrap: {
        width: '80%'
    },
    statusWrap: {
        backgroundColor: 'green',
        padding: 4,
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        position: 'absolute',
        right: 5,
        top: 15
    },
    status: {
        fontWeight: 'bold',
    }
});


