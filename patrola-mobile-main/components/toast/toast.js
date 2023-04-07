// Foo.jsx
import Toast from 'react-native-toast-message';

export const ToastAlert = () => {
    return Toast.show({
        type: 'success',
        text1: 'Hello',
        text2: 'This is some something 👋'
    });

}