import * as React from 'react';
import { Image, View, StyleSheet, ScrollView, Text, Pressable, ActivityIndicator } from 'react-native';
import { Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Limes from '../../../../assets/limes.jpeg'
import CustomButton from '../../../components/customButton';
import CustomInput from '../../../components/customInput';
import Slider from '../../../components/slider/Slider';
import { auth, db } from "../../../../firebaseConfig";
import { addDoc, collection, doc, onSnapshot, query, setDoc, updateDoc } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { async } from '@firebase/util';
import Icon from 'react-native-vector-icons/FontAwesome';

const windowHeight = Dimensions.get('window').height;
export default function AppDetails({ route, navigation }) {
    const user = auth.currentUser;
    const { data } = route.params;
    const [details, setDetails] = React.useState("");
    const [commentsData, setCommentsData] = React.useState();
    const [loading, setLoading] = React.useState(false)


    const getCurrentDate = () => {
        var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        var today = new Date();
        return today.toLocaleDateString("en-US", options)//format: d-m-y;
    }

    const selectedData = [];
    let id = 1;

    for (const [key, value] of Object.entries(data?.selectedImage)) {
        if (value) {
            selectedData.push({ id: id++, img: value })
        }
    }

    const onSave = async () => {
        setLoading(true)
        const comments = [{
            comment: details,
            date: getCurrentDate(),
            name: user?.displayName
        }]
        if (commentsData) {
            for (let data of commentsData) {
                comments.push(data)
            }
        }
        const app = doc(db, "applications", data?.appId)
        await updateDoc(app, {
            Comments: comments
        }).then(() => {
            setLoading(false)
            setDetails(null)
        }).catch((error) => {
            setLoading(false)
            console.log("error!")
        });
    }

    React.useEffect(() => {
        const q = doc(db, "applications", data?.appId)
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data = querySnapshot?.data()?.Comments
            setCommentsData(data)
        });
    }, [commentsData])


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.mapWrapper}>
                        <Slider Slides={selectedData} type={'uri'} />
                    </View>
                    <View style={styles.locationWrapper}>
                        <ScrollView >
                            <View style={styles.confirmLocationWrap}>
                                <View style={styles.subWrap}>
                                    <Text style={styles.content}>Status prijave</Text>
                                    <View style={styles.statusWrap}>
                                        <Text style={styles.status}>Otvoreno</Text>
                                    </View>
                                </View>
                                <View style={styles.divider} />
                                <View style={styles.subWrap}>
                                    <Text style={styles.content}>ID prijave</Text>
                                    <Text style={styles.content} numberOfLines={3}>{data?.appId}</Text>
                                </View>
                            </View>

                            <View style={styles.confirmLocationWrap}>
                                <View style={styles.subWrap}>
                                    <Text style={styles.content}>Grad</Text>
                                    <Text style={styles.content}>{data?.city || "-"}</Text>
                                </View>
                                <View style={styles.subWrapDivider}>
                                    <Text style={styles.content}>Datum prijave</Text>
                                    <Text style={styles.content}>{data?.appDate}</Text>
                                </View>
                                <View style={styles.subWrap}>
                                    <Text style={styles.content}>Lokacija</Text>
                                    <Text style={styles.content} numberOfLines={3}>{data?.address}</Text>
                                </View>
                                <View style={styles.subWrapDivider}>
                                    <Text style={styles.content}>Institucija</Text>
                                    <Text style={styles.content}>-</Text>
                                </View>
                                <View style={styles.subWrap}>
                                    <Text style={styles.content}>Odjel</Text>
                                    <Text style={styles.content} numberOfLines={3}>-</Text>
                                </View>
                            </View>
                            <View>
                                <Text style={styles.moreContent}>Detaljnije informacije</Text>
                                <View style={styles.moreContentWrap}>
                                    <CustomInput multiline={true} h={180}
                                        editable={false}
                                        value={data?.details}
                                    />
                                </View>
                            </View>
                            <View style={styles.commentWrapper}>
                                <Text style={styles.commentHeading}>Komentari</Text>
                                {
                                    commentsData?.map((item, index) => {
                                        return (
                                            <View style={styles.commentSubWrap} key={index}>
                                                <View>
                                                    <Image source={{ uri: selectedData[0]?.img }} style={{ width: 50, height: 50, borderRadius: 10 }} />
                                                </View>
                                                <View style={styles.commentDetailWrap}>
                                                    <View style={styles.userDetail}>
                                                        <Text style={styles.username}>{item?.name}</Text>
                                                        <Text style={styles.commentDate}>{item?.date}</Text>
                                                    </View>
                                                    <View>
                                                        <Text numberOfLines={4}>{item?.comment}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    })
                                }

                                <View style={styles.commentBox}>
                                    <View style={styles.commentField}>
                                        <CustomInput
                                            editable={true}
                                            placeholder={'Unesite poruku'}
                                            onChangeText={newText => setDetails(newText)}
                                            value={details}
                                        />
                                    </View>
                                    {
                                        loading ? <ActivityIndicator size="large" color={'black'} />
                                            :
                                            <Pressable style={styles.commentSend} onPress={onSave}>
                                                <Icon name="send" size={22} />
                                            </Pressable>
                                    }

                                </View>

                            </View>


                            <View style={styles.BtnWrapper}>
                                <CustomButton title={'Nazad'} onPress={() => navigation.navigate('/home')} />
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </ScrollView>

        </SafeAreaView >

    );
}

const styles = StyleSheet.create({
    container: {
        // height: windowHeight,
        // flex: 1,
        backgroundColor: "white",
        alignItems: 'center',
        // position: 'relative'
    },
    mapWrapper: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        maxHeight: 300,
        position: 'relative'
    },
    map: {
        width: "100%",
        height: "100%"
    },
    locationWrapper: {
        width: "100%",
        backgroundColor: 'white',
        height: windowHeight / 1.6,
        borderTopEndRadius: 20,
        borderTopStartRadius: 20,
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        // elevation: 5,
        // position: 'absolute',
        // top: 230,
        // paddingTop: 20,
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
    divider: {
        borderWidth: 0.5,
        borderColor: 'lightgray'
    },
    content: {
        color: 'black',
        fontSize: 14,
        maxWidth: 250
    },
    BtnWrapper: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20
    },
    statusWrap: {
        backgroundColor: 'green',
        padding: 4,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        // position: 'absolute',
        // right: 5,
        // top: 15
    },
    status: {
        fontWeight: 'bold',
    },
    commentWrapper: {
        marginTop: 20
    },
    commentHeading: {
        color: 'black',
        fontSize: 16,
        fontWeight: '500',
        borderBottomWidth: 1,
        borderColor: 'lightgray',
        paddingBottom: 10
    },
    commentSubWrap: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 15
    },
    commentDetailWrap: {
        justifyContent: 'space-between',
        paddingVertical: 3
    },
    userDetail: {
        flexDirection: 'row',
        gap: 4,
        alignItems: 'center'
    },
    username: {
        fontSize: 16,
        color: 'black',
        fontWeight: '500'
    },
    commentDate: {
        color: 'gray'
    },
    commentBox: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    commentField: {
        width: "85%"
    },
    commentSend: {
        backgroundColor: "rgb(255, 213, 36)",
        width: "12%",
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100
    }
});


