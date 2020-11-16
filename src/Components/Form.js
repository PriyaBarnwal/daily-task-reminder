import React, {useState} from 'react'
import {TextInput, View, Text, TouchableOpacity, StyleSheet} from 'react-native'
import DateTimePicker from 'react-native-modal-datetime-picker'
import moment from 'moment'
import Button from './Button'

const Form =(props) => {
  let [title, setTitle] = useState(props.item && props.item.title || ''),
    [error, setErrors] = useState({
      title: '',
      time: ''
    }),
    [time, setTime] = useState(props.item && moment(props.item.time) || moment(new Date().getTime())),
    [showTimer, setShowTimer] = useState(false)

  let onSubmit =() => {
    if(title!='' && !error.title.length && !error.time.length)
      props.onSubmit(title, time, props.item && props.item.id)
  }

  let onBlur=()=> {
    if(!title.length)
      setErrors({...error, title: `Task name can't be empty`})
    else
      setErrors({...error, title: ''})
  }

  const hideDateTimePicker = () => {
    setShowTimer(false)
  }

  const handleDatePicked = async time => {
    setTime(moment(time))
    hideDateTimePicker()
  }

  return (
    <View style={styles.modalView}>
      <Text style={styles.label}>Task Name</Text>
      <TextInput style={styles.input} placeholder="task name" value={title} onChangeText={setTitle} onBlur={onBlur}/>
      {error.title.length>0 && <Text style={styles.error}>{error.title}</Text>}
      <Text style={styles.label}>Time</Text>
      <TouchableOpacity  style={styles.input} onPress={()=>setShowTimer(true)}>
        <Text>{time.format('LT')}</Text>
      </TouchableOpacity>
      {error.time.length>0 && <Text style={styles.error}>{error.time}</Text>}
      <DateTimePicker isVisible={showTimer} onConfirm={handleDatePicked} onCancel={hideDateTimePicker} mode="time" date={new Date()} is24Hour={false} titleIOS="Select a reminder time" minimumDate={new Date()}/>
      <View style={styles.buttonView}>
        <Button title="Confirm" onPress={onSubmit}/>
        <Button title="Cancel" onPress={props.onCancel}/>
      </View>
    </View>
  )
}

let styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5
  },
  label: {
    fontWeight: "bold",
    marginTop: 20
  },
  input: {
    width: 200,
    borderColor: 'grey',
    borderWidth: 1,
    padding: 10,
  },
  error: {
    color: 'red',
    fontSize: 12
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10
  }
})

export default Form