import React, {Component} from 'react';
import {Text, View, ToastAndroid} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {firebase} from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import PushNotification from 'react-native-push-notification';
export class App extends Component {
  registerAppWithFCM = async () => {
    await messaging().registerForRemoteNotifications();
    const isRegietered = await messaging().isRegisteredForRemoteNotifications;
    console.log(isRegietered);
  };
  getTokenOfUser = async () => {
    const token = await messaging().getToken();
    console.log(token);
    return token;
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
    const token = await this.registerAppWithFCM();
    this.getTokenOfUser();
    await this.requestPermission();
    const hasPermission = await messaging().hasPermission();
    console.log(hasPermission);
    const msg = await AsyncStorage.getItem('messages');
    console.log({msg});

    messaging().onMessage(remoteMessage => {
      console.log('FCM Message Data:', remoteMessage);

      // // Update a users messages list using AsyncStorage
      // const currentMessages = await AsyncStorage.getItem('messages');
      // const messageArray = JSON.parse(currentMessages);
      // messageArray.push(remoteMessage.data);
      // await AsyncStorage.setItem('messages', JSON.stringify(messageArray));
    });

    messaging().setBackgroundMessageHandler(remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
      // await AsyncStorage.setItem('messages', JSON.stringify(remoteMessage));
    });

    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function(token) {
        console.log('TOKEN:', token);
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
        console.log('NOTIFICATION:', notification);
        alert(notification.notification.body);

        // process the notification

        // // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
        // notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
      senderID: '355313692037',

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      requestPermissions: true,
    });

    PushNotification.localNotification({
      /* Android Only Properties */
      id: '0', // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
      ticker: 'My Notification Ticker', // (optional)
      autoCancel: true, // (optional) default: true
      largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
      smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher"
      bigText: 'My big text that will be shown when notification is expanded', // (optional) default: "message" prop
      subText: 'This is a subText', // (optional) default: none
      color: 'red', // (optional) default: system default
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      tag: 'some_tag', // (optional) add tag to message
      group: 'group', // (optional) add group to message
      ongoing: false, // (optional) set whether this is an "ongoing" notification
      priority: 'high', // (optional) set notification priority, default: high
      visibility: 'private', // (optional) set notification visibility, default: private
      importance: 'high', // (optional) set notification importance, default: high
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
