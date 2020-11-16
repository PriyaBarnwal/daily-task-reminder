import React from 'react'
import {TouchableOpacity, Text, StyleSheet} from 'react-native'

const Button = ({title, onPress}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'teal',
    padding: 10,
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 5,
    borderRadius: 10
  },
  text: {
    color: 'white',
    fontSize: 18
  }
})
export default Button