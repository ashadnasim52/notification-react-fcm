import React, {Component} from 'react';
import {Text, View} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {firebase} from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
export class App extends Component {
  registerAppWithFCM = async () => {
    await messaging().registerForRemoteNotifications();
    const isRegietered = await messaging().isRegisteredForRemoteNotifications;
    console.log(isRegietered);
  };
  getTokenOfUser = async () => {
    const token = await messaging().getToken();
    console.log(token);
  };

  // subscribeUser = async () => {
  //   const unsubscribe =
  // };
  requestPermission = async () => {
    const granted = messaging().requestPermission();

    if (granted) {
      console.log('User granted messaging permissions!');
    } else {
      console.log('User declined messaging permissions :(');
    }
  };

  async componentDidMount() {
    await this.registerAppWithFCM();
    this.getTokenOfUser();
    await this.requestPermission();
    const hasPermission = await messaging().hasPermission();
    console.log(hasPermission);
    const msg = await AsyncStorage.getItem('messages');
    console.log({msg});

    messaging().onMessage(async remoteMessage => {
      console.log('FCM Message Data:', remoteMessage);

      // // Update a users messages list using AsyncStorage
      const currentMessages = await AsyncStorage.getItem('messages');
      const messageArray = JSON.parse(currentMessages);
      messageArray.push(remoteMessage.data);
      await AsyncStorage.setItem('messages', JSON.stringify(messageArray));
    });
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
      await AsyncStorage.setItem('messages', JSON.stringify(remoteMessage));
    });
  }
  render() {
    return (
      <View>
        <Text> textInComponent </Text>
      </View>
    );
  }
}

export default App;
