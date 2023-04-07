import {
    Image,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Animated,
    Easing,
} from 'react-native';
import React from 'react';

const { width, height } = Dimensions.get('screen');

const SlideItem = ({ item, type }) => {
    const translateYImage = new Animated.Value(40);

    Animated.timing(translateYImage, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.bounce,
    }).start();

    return (
        <View style={styles.container}>
            {
                type === "uri" ?
                    <Animated.Image
                        source={{ uri: item.img }}
                        resizeMode="contain"
                        style={[
                            styles.image,
                            {
                                transform: [
                                    {
                                        translateY: translateYImage,
                                    },
                                ],
                            },
                        ]}
                    />
                    :
                    <Animated.Image
                        source={item.img}
                        resizeMode="contain"
                        style={[
                            styles.image,
                            {
                                transform: [
                                    {
                                        translateY: translateYImage,
                                    },
                                ],
                            },
                        ]}
                    />
            }


            <View style={styles.content}>
                <Text style={styles.price}>{item.price}</Text>
            </View>
        </View>
    );
};

export default SlideItem;

const styles = StyleSheet.create({
    container: {
        width,
        height,
        alignItems: 'center',
    },
    image: {
        flex: 0.3,
        width: '100%',
    },
    content: {
        flex: 0.4,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    description: {
        fontSize: 18,
        marginVertical: 12,
        color: '#333',
    },
    price: {
        fontSize: 32,
        fontWeight: 'bold',
    },
});