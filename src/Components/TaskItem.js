import React from 'react'
import {Text, StyleSheet, View} from 'react-native'
import moment from 'moment'
import { RectButton } from 'react-native-gesture-handler'
import SwipeableRow from './SwipeableRow'

const TaskItem =({title, time, onListItemPress, onListItemTrash}) => {
  return (
    <View style={{margin: 10}}>
    <SwipeableRow onListItemTrash={onListItemTrash} >
      <RectButton onPress={onListItemPress} style={styles.item}>
        <Text>{title}</Text>
        <Text>{moment(time).format('LT')}</Text>
      </RectButton>
    </SwipeableRow>
    </View>
  )
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 70,
    backgroundColor: 'aliceblue',
    borderRadius: 10,
    padding: 15
  }
})

export default TaskItem