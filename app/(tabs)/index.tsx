import { useState, useEffect, useRef } from 'react';
import { Button } from 'react-native';
import * as Notifications from 'expo-notifications';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Image } from 'react-native';
import { StyleSheet } from 'react-native';

import {registerForPushNotificationsAsync } from '../(utils)/registerForPushNotificationsAsync';
import { sendPushNotification } from '../(utils)/sendPushNotification';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ''))
      .catch((error: any) => setExpoPushToken(`${error}`));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <ParallaxScrollView
    headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
    headerImage={
      <Image
        source={require('@/assets/images/BEC-background.jpg')}
        style={styles.logo}
      />
    }>
    <ThemedView 
    // style={styles.titleContainer}
    >
      <ThemedText type="title">Welcome to our demo!</ThemedText>
    </ThemedView>
    <ThemedView 
    // style={styles.stepContainer}
    >
      <ThemedText type="subtitle">Step 1: Try it</ThemedText>
      <ThemedText>Your Expo push token: {expoPushToken}</ThemedText>
    </ThemedView>
    <Button onPress={() => sendPushNotification(expoPushToken)}
      title="Schedule notification"
      color="white"
      accessibilityLabel="Learn more about this purple button"
    />
  </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  logo:{
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
  container: {
    marginTop: 50,
  },
  bigBlue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
  },
  red: {
    color: 'red',
  },
});