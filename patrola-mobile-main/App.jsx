import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LandingPage from './src/pages/Onboarding/landing';
import AddPicture from './src/pages/Onboarding/addPicture';
import AllowLocation from './src/pages/Onboarding/allowLocation';
import ConfirmLocation from './src/pages/Onboarding/confirmLoginLocation';
import ConfirmApplication from './src/pages/Onboarding/confirmApplication';
import ApplicationSuccess from './src/pages/Onboarding/applicationSuccess';
import SignUp from './src/pages/Authentication/SignUp';
import Login from './src/pages/Authentication/login';
import Home from './src/pages/Dashboard/home';
import Profile from './src/pages/Dashboard/Profile';
import { ToastProvider } from 'react-native-toast-notifications'
import { LogBox } from 'react-native';
import ForgotPassword from './src/pages/Authentication/forgetPassword';
import AppDetails from './src/pages/Dashboard/appDetails';
import 'expo-dev-client';
const Stack = createStackNavigator();

export default function App() {
  LogBox.ignoreAllLogs();
  return (
    <ToastProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="landing" component={LandingPage} />
          <Stack.Screen name="/addPicture" component={AddPicture} />
          <Stack.Screen name="/allowLocation" component={AllowLocation} />
          <Stack.Screen name="/confirmLocation" component={ConfirmLocation} />
          <Stack.Screen name="/confirmApplicatuin" component={ConfirmApplication} />
          <Stack.Screen name="/applicationSuccess" component={ApplicationSuccess} />
          <Stack.Screen name="/login" component={Login} />
          <Stack.Screen name="/signUp" component={SignUp} />
          <Stack.Screen name="/forgotPassword" component={ForgotPassword} />
          <Stack.Screen name="/home" component={Home} />
          <Stack.Screen name="/appDetails" component={AppDetails} />
          <Stack.Screen name="/profile" component={Profile}
            options={{
              headerShown: true,
              title: 'Moj Profil',
              headerTitleAlign: 'center',
              headerBackTitle: false,
              headerBackTitleVisible: false
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ToastProvider>
  );
}

