import * as React from 'react';
import { View, StyleSheet, ScrollView, Text, Image, TouchableOpacity, Platform, StatusBa, ActivityIndicator } from 'react-native';
import { Dimensions } from 'react-native';
import CustomButton from '../../../components/customButton';
import UploadCard from '../../../components/uploadCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Entypo';
import IconF from 'react-native-vector-icons/FontAwesome';
import { useToast } from "react-native-toast-notifications";
import Tooltip from 'react-native-walkthrough-tooltip';
import * as Permissions from 'expo-permissions';


const windowHeight = Dimensions.get('window').height;
export default function AddPicture({ navigation }) {
    const [toolTipVisible, setToolTipVisible] = React.useState();
    const [loading, setLoading] = React.useState(false)

    const [image, setImage] = React.useState({
        image1: null,
        image2: null,
        image3: null,
        image4: null,
    });
    const [selectedCard, setSelectedCard] = React.useState({
        imageSelected1: 0,
        imageSelected2: 0,
        imageSelected3: 0,
        imageSelected4: 0,
    });

    const toast = useToast();

    const pickImage = async (index, type) => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        let result;
        if (type === "photos") {
            const Mediapermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,

            });
        } else if (type === "camera") {
            const Mediapermission = await ImagePicker.requestCameraPermissionsAsync();
            result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,

            });
        }
        if (!result.canceled) {
            if (index === 1) {
                setImage({ ...image, image1: result.assets[0].uri });
            } else if (index === 2) {
                setImage({ ...image, image2: result.assets[0].uri });
            } else if (index === 3) {
                setImage({ ...image, image3: result.assets[0].uri });
            } else if (index === 4) {
                setImage({ ...image, image4: result.assets[0].uri });
            }
        }
    };

    const onCross = (index) => {
        if (index === 1) {
            setImage({ ...image, image1: null });
        } else if (index === 2) {
            setImage({ ...image, image2: null });
        } else if (index === 3) {
            setImage({ ...image, image3: null });
        } else if (index === 4) {
            setImage({ ...image, image4: null });
        }
    }

    const nextStep = () => {
        setLoading(true)
        if (!(image.image1 || image.image2 || image.image3 || image.image4)) {
            toast.show('Molimo vas dodajte barem jednu sliku!', {
                type: "danger",
                placement: "bottom",
                duration: 4000,
                offset: 30,
                animationType: "zoom-in",
            });
            return;
        };
        toast.show("Slike su uspješno otpremljene!", {
            type: "success",
            placement: "bottom",
            duration: 4000,
            offset: 30,
            animationType: "zoom-in",
        });

        navigation.navigate('/allowLocation', {
            selectedImage: image,
        });
        setImage({ ...image, image1: null, image2: null, image3: null, image4: null })
        setLoading(false)
    }

    const selectImageIndex = selectedCard.imageSelected1 === 1 ? 1 : selectedCard.imageSelected2 === 1 ? 2 : selectedCard.imageSelected3 === 1 ? 3 : selectedCard.imageSelected4 === 1 ? 4 : 0;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView contentContainerStyle={{ flex: 1 }}>
                <Tooltip
                    isVisible={toolTipVisible}
                    content={
                        <View style={styles.selecter}>
                            <TouchableOpacity style={styles.subWrapper} onPress={() => { pickImage(selectImageIndex, "photos"); setToolTipVisible(false) }}>
                                <Text>Photo Library</Text>
                                <IconF name="photo" size={24} color={'gray'} />
                            </TouchableOpacity>
                            <View style={styles.divider} />
                            <TouchableOpacity style={styles.subWrapper} onPress={() => { pickImage(selectImageIndex, "camera"); setToolTipVisible(false) }}>
                                <Text>Take Photo</Text>
                                <Icon name="camera" size={24} color={'gray'} />
                            </TouchableOpacity>
                        </View>
                    }
                    onClose={() => setToolTipVisible(false)}
                    useInteractionManager={true}
                // topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
                >
                </Tooltip>
                <View style={styles.container}>
                    <View style={styles.headingWrap}>
                        <Text style={styles.heading}>Dodaj slike</Text>
                    </View>
                    <View style={styles.contentWrapper}>
                        <Text style={styles.contentMain}>Dodajte što kvalitetnije slike koje opisuju situaciju i/ili komunalni problem koji prijavljujete.
                            <Text style={styles.contentSub}> Ukoliko dodate sliku nepropisno parkiranog vozila, naš sistem će automatski prepoznati tablice.</Text>
                        </Text>
                    </View>
                    <View style={styles.uploadWrapper}>
                        {image.image1 ?
                            <View style={styles.imgWrap} >
                                <Image source={{ uri: image.image1 }} style={{ width: "100%", height: "100%", borderRadius: 16 }} />
                                <TouchableOpacity activeOpacity={0.7} style={styles.crossWrap} onPress={() => onCross(1)}>
                                    <Icon name="cross" size={20} color={'gray'} />
                                </TouchableOpacity>
                            </View>
                            :
                            <UploadCard subTitle={'Kliknite da'} title={'dodate sliku'} onPress={() => { setToolTipVisible(true); setSelectedCard({ ...selectedCard, imageSelected1: 1 }) }} />
                        }
                        {image.image2 ?
                            <View style={styles.imgWrap} >
                                <Image source={{ uri: image.image2 }} style={{ width: "100%", height: "100%", borderRadius: 16 }} />
                                <TouchableOpacity activeOpacity={0.7} style={styles.crossWrap}>
                                    <Icon name="cross" size={20} color={'gray'} onPress={() => onCross(2)} />
                                </TouchableOpacity>
                            </View>
                            :
                            <UploadCard subTitle={'Kliknite da'} title={'dodate sliku'} onPress={() => { setToolTipVisible(true); setSelectedCard({ ...selectedCard, imageSelected1: 0, imageSelected2: 1 }) }} />

                        }
                        {image.image3 ?
                            <View style={styles.imgWrap} >
                                <Image source={{ uri: image.image3 }} style={{ width: "100%", height: "100%", borderRadius: 16 }} />
                                <TouchableOpacity activeOpacity={0.7} style={styles.crossWrap}>
                                    <Icon name="cross" size={20} color={'gray'} onPress={() => onCross(3)} />
                                </TouchableOpacity>
                            </View>
                            :
                            <UploadCard subTitle={'Kliknite da'} title={'dodate sliku'} onPress={() => { setToolTipVisible(true); setSelectedCard({ ...selectedCard, imageSelected1: 0, imageSelected2: 0, imageSelected3: 1 }) }} />

                        }
                        {image.image4 ?
                            <View style={styles.imgWrap} >
                                <Image source={{ uri: image.image4 }} style={{ width: "100%", height: "100%", borderRadius: 16 }} />
                                <TouchableOpacity activeOpacity={0.7} style={styles.crossWrap}>
                                    <Icon name="cross" size={20} color={'gray'} onPress={() => onCross(4)} />
                                </TouchableOpacity>
                            </View>
                            :
                            <UploadCard subTitle={'Kliknite da'} title={'dodate sliku'} onPress={() => { setToolTipVisible(true); setSelectedCard({ ...selectedCard, imageSelected1: 0, imageSelected2: 0, imageSelected3: 0, imageSelected4: 1 }) }} />

                        }
                    </View>
                    <View style={styles.BtnWrapper}>
                        <CustomButton title={loading ? <ActivityIndicator size="large" color={'white'} /> : "Nastavi dalje"} onPress={() => nextStep()} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        backgroundColor: "white",
        flex: 1,
        paddingTop: 20
    },
    headingWrap: {
        height: 50,
        justifyContent: 'center',
    },
    heading: {
        fontSize: 28,
        fontWeight: 700,
        color: 'black'
    },
    contentMain: {
        fontWeight: 700,
        color: 'black',
        lineHeight: 20
    },
    contentSub: {
        fontWeight: 400,
        color: 'black'
    },
    uploadWrapper: {
        flexDirection: 'row',
        width: '100%',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 30,
        paddingBottom: 30,
        gap: 10
    },
    BtnWrapper: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    crossWrap: {
        width: 30,
        height: 30,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E2E5E5',
        position: 'absolute',
        right: -10,
        top: -10
    },
    imgWrap: {
        width: "46%",
        height: 180,
        borderRadius: 16,
        position: 'relative'
    },
    selecter: {
        width: 200,
        height: 100,
        borderRadius: 40
    },
    divider: {
        borderBottomWidth: 1,
        borderColor: 'lightgray',
    },
    subWrapper: {
        width: '100%',
        height: '50%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
});


