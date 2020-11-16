import React, {useState, useEffect} from 'react'
import {SafeAreaView, Text, FlatList, View, StyleSheet, Image, Modal} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Form from './Form'
import moment from 'moment'
import TaskItem from './TaskItem'
import Button from './Button'
import firebase from 'react-native-firebase'

const Dashboard = () => {
  const [reminders, setReminders] = useState([])
  const [modalVisible, setModalVisible] = useState(false)

  let [children,setChildren] = useState(null)

  useEffect(() => {
    retrieveData()
      .then(()=> setNotifications())
  }, [])

  const buildNotification = ({title,id}) => {
    const notification = new firebase.notifications.Notification().setNotificationId(id)
      .setTitle('Daily reminder')
      .setBody(title)
      .android.setPriority(firebase.notifications.Android.Priority.High)
      .android.setChannelId('reminder') // should be the same when creating channel for Android
      .android.setAutoCancel(true) // To remove notification when tapped on it

    return notification
  }

  const handleReminderAdded = async (title,time) => {
    let newReminder = {
      title, 
      time: moment(time), 
      id: (reminders[reminders.length-1].id+1).toString()
    }
    setReminders([...reminders, newReminder])
    setModalVisible(false)
    await AsyncStorage.setItem('reminders', JSON.stringify([...reminders, newReminder]))
    await firebase.notifications().scheduleNotification(buildNotification(newReminder), {
      fireDate: newReminder.time.valueOf(),
      exact: true
    })
  }

  const handleReminderEdited = async (title,time,id) => {
    let newReminders = reminders.map(reminder=>{
      if(id===reminder.id)
        return {
          title, 
          time: moment(time), 
          id: id
        }
      else return reminder
    })
    setReminders(newReminders)
    setModalVisible(false)
    await AsyncStorage.setItem('reminders', JSON.stringify(newReminders))
    await firebase.notifications().scheduleNotification(buildNotification({title,id}), {
      fireDate: moment(time).valueOf(),
      exact: true
    })
  }

  const onCancel=()=>{
    setModalVisible(false)
  }

  const setNotifications = async () => {
    if(reminders.length) {
      for (let reminder of reminders) {
        await firebase.notifications().scheduleNotification(buildNotification(reminder), {
          fireDate: reminder.time.valueOf(),
          exact: true
        })
      }
    }
  }

  const retrieveData = async () => {
    try {
      const reminderString = await AsyncStorage.getItem('reminders')
      const remindersVal = JSON.parse(reminderString)
      if (remindersVal !== null) {
        setReminders(remindersVal)
    }} catch (error) {
      console.log(error)
    }
  }

  const onListItemPress=(item)=> {
    setChildren(
      <Form onSubmit={handleReminderEdited} onCancel={onCancel} item={item}/>
    )
    setModalVisible(true)
  }

  const onDelete=async(item)=> {
    let newReminders = reminders.filter(reminder=> reminder.id!==item.id)
    setReminders(newReminders)
    await firebase.notifications().cancelNotification(item.id)
  }

  const onAdd=() => {
    setChildren(
      <Form onSubmit={handleReminderAdded} onCancel={onCancel}/>
    )
    setModalVisible(true)
  }

  const renderItem = ({ item }) => (
    <TaskItem title={item.title} time={item.time} onListItemPress={()=>onListItemPress(item)} onListItemTrash={()=>onDelete(item)}/>
  )

  return (
    <>
    <SafeAreaView style={styles.container}>
      <View style={styles.row}>
        <Image source={require('../goal.jpg')} style={styles.img}/>    
      </View>
        <Button onPress={onAdd} title="Set New Reminder" style={styles.btn}/>
        <FlatList data={reminders} keyExtractor={item=>item.id} renderItem={renderItem}/>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.centeredView}>
          {children}
        </View>
      </Modal>
    </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  row: {
    alignItems: "center"
  },
  img: {
    width: '100%',
    height: 200,
    marginBottom:10
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  cardTitleView: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 8,
  },
  cardTitle: {
    fontSize: 15,
    color: '#585858',
    fontWeight: '600',
  },
  titleStyle: {
    fontSize: 20,
    color: '#585858',
  }
});

export default Dashboard