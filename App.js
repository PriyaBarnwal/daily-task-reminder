import React from 'react'
import 'react-native-gesture-handler';
import {Alert} from 'react-native'
import firebase from 'react-native-firebase'
import Dashboard from './src/Components/Dashboard'

export default class App extends React.Component {
  componentDidMount() {
    this.createNotificationChannel()
    
    this.checkPermission()
  }

  createNotificationChannel = () => {
    // Build a android notification channel
    const channel = new firebase.notifications.Android.Channel(
      'reminder', // channelId
      'Reminders Channel', // channel name
      firebase.notifications.Android.Importance.High, // channel importance
    ).setDescription('Used for getting reminder notification') // channel description

    firebase.notifications().android.createChannel(channel)
  }

  checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission()

    if (enabled) {
      this.notificationListener = firebase.notifications().onNotification(async notification => {
        // Display your notification
        await firebase.notifications().displayNotification(notification)
        console.log(notification)
      })
    } else {
      try {
        await firebase.messaging().requestPermission()
      } catch (error) {
        Alert.alert(
        'Notification permission denied. Please enable the Notification Permission from the settings',
        )
      }
  }}

  render() {
    return (
    <Dashboard />
  )}
}