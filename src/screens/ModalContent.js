import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';

export default function ModalContent(props) {

	function sortDates(obj){
	    obj = Object.entries(obj);
	    for(var i = 0; i < obj.length; i++){
	        var day = obj[i][0];
	        day = day.split('-');
	        day = (day[2], day[1], day[0]);
	        obj[i][0] = day;
	//         obj[i][0] = new Date(day);
	    }
	    var sortedDates = obj.sort((a, b) => new Date(b[0][2], b[0][1] - 1, b[0][0]) - new Date(a[0][2], a[0][1] - 1, a[0][0]));
	    // var sortedDates = obj;
	    var finalList = [];
	    for(var i = 0; i < sortedDates.length; i++){
	        sortedDates[i][0] = new Date(sortedDates[i][0]).toDateString();
	//         sortedDates[i] = {name: sortDates[i]};
	        console.log(sortedDates[i]);
	        finalList.push({name: sortedDates[i]});
	    }
	    return finalList;
	}

	return (
		<View>
	      <Text>Attendance in detail coming soon...</Text>
	      {/* <Text>{new Date(2020, 1, 3).toDateString()}</Text>
	      	<ScrollView>
		      <FlatList
		        // horizontal
		        data = {sortDates(props.dayAtt)}
		        renderItem = {({item}) => {return (
		          <View style = {{alignItems: 'center'}}>
		            <Text> {item.name[0]} </Text>
		            <Text>{item.name[1]} </Text>
		          </View>
		        )}}
		      />
		  </ScrollView> */}
	    </View>
	);
}