import React from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { useState, useEffect, useLayoutEffect } from 'react';
import Firebase from 'firebase';
import { AsyncStorage } from 'react-native';


export default function HomeScreen(props){

	const [user, setUser] = useState(global.user);

	async function getData() {
		try {
		  const value = await AsyncStorage.getItem('SRNToken')
		  if(value !== null) {
			  await setUser(value);
			  await onRefresh();
		  }
		} catch(e) {
			console.log(e);
		}
	}

	useLayoutEffect(() => {
		// getData();
		onRefresh();
		// await onRefresh();
	  }, []);
	
	useEffect(() => {
		updateDatabase();
	}, []);





	const firebaseConfig = {
		apiKey: "<API-key-goes-here>",
		authDomain: "<firebase-configuration-goes-here>",
		databaseURL: "<firebase-configuration-goes-here>",
		projectId: "<firebase-configuration-goes-here>",
		storageBucket: "<firebase-configuration-goes-here>",
		messagingSenderId: "<firebase-configuration-goes-here>",
		appId: "<firebase-configuration-goes-here>",
		measurementId: "<firebase-configuration-goes-here>"
	  };

	// const app = Firebase.initializeApp(firebaseConfig);
	  if (!Firebase.apps.length) {
	   Firebase.initializeApp(firebaseConfig);
	}

	const [refreshing, setRefreshing] = React.useState(false);
	const [database, setDatabase] = useState({});

	function updateDatabase(){
	    Firebase.database()
	    .ref('/users/' + user)
	    .on('value', snapshot => {
	      var db = snapshot.val();
	      // console.log('User data: ', db);
	      setDatabase(db);
	    });
	      // console.log(database);
	  }

	function wait(timeout) {
		return new Promise(resolve => {
	  		setTimeout(resolve, timeout);
		});
	}

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		updateDatabase();
		wait(100).then(() => setRefreshing(false));
	}, [refreshing]);




	const [cardsState, setCardsState] = useState({
          activeIndex:0,
          carouselItems: [
          {
              title:"Item 1",
              text: "Text 1",
          },
          {
              title:"Item 2",
              text: "Text 2",
          },
          {
              title:"Item 3",
              text: "Text 3",
          },
          {
              title:"Item 4",
              text: "Text 4",
          },
          {
              title:"Item 5",
              text: "Text 5",
          },
        ]
      });

	function renderCard({item,index}){
        return (
          <View style={{
              backgroundColor:'white',
              borderRadius: 15,
              height: 300,
              padding: 50,
              marginLeft: 25,
              marginRight: 25,
              borderWidth: 4,
			  borderColor: '#0142f0',
			  alignItems: 'center',
			//   width: '85%',
          }}>
            <Text style = {{fontSize: 25, textAlign: 'center', width: 200, paddingBottom: 20}}>{item.title}</Text>
            <Text style = {{width: 150, textAlign: 'center', fontSize: 15}} >{item.text}</Text>
          </View>

        );
    }



	var listAttendance = [];
	var attendance = Object.values(database.attendance);
	for(var i = 0; i < attendance.length; i++){
		var listItem = [];
		var day = Object.values(attendance[i]).join("")
		var subject = Object.keys(database.attendance)[i];
		var attPerc = (((day.match(/1/g) || []).length)/day.length) * 100;
		listAttendance.push(attPerc);
	}
	// console.log(Math.min(...listAttendance));



	var listAttClasses = [];
	for(var i = 0; i < attendance.length; i++){
		var listItem = [];
		var day = Object.values(attendance[i]).join("")
		var subject = Object.keys(database.attendance)[i];
		var attendedClasses = (day.match(/1/g) || []).length;
		var totalClases = day.length;
		listItem.push(subject);
		listItem.push(attendedClasses);
		listItem.push(totalClases);
		listAttClasses.push({name: listItem});
	}
	
	var carouselList = [];
	for(var i = 0; i < listAttClasses.length; i++){
		var temp = listAttClasses[i];
		var a = temp.name[1];
		var b = temp.name[2];
		var x = (17 * b - 20 * a)/3;
		if(x <= 0){
			x = 0;
			var obj = {title: temp.name[0], text: 'Attendance is satisfactory!'};
		}
		else{
			x = Math.ceil(x);
			var obj = {title: temp.name[0], text: 'Need atleast ' + x.toString() + ' more classes!'};
		}
		carouselList.push(obj);
	}
	// console.log(carouselList);
	


	return (
		<View style = {styles.container}>
			
			<View style = {styles.top}>
				<View style = {{flexDirection: 'column'}}>
					<View style = {{flexDirection: 'row'}}>

						<Text style = {styles.welcomeText}>Welcome, {database.name.split(' ')[0]}</Text>

						<View style = {styles.profilePicBorder}>
							<Image source = {{uri: database.profilePic}} style = {styles.profilePic} />
						</View>

					</View>

					<View style = {{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
						<Text style = {styles.topTitle}>Attendance is {(Math.min(...listAttendance) < 75)? 'LOW': ((Math.min(...listAttendance) < 85 & Math.min(...listAttendance) >= 75)? 'GOOD': 'EXCELLENT')}</Text>
					</View>

				</View>
			</View>
			
			<View style = {styles.bottom}>
				<SafeAreaView style={{flex: 1, backgroundColor:'#f7f7f7', paddingTop: 50, }}>
		            <View style={{ flex: 1, flexDirection:'row', justifyContent: 'center', }}>
		                <Carousel
		                  layout={"default"}
		                  // ref={ref => this.carousel = ref}
		                  data={carouselList}
		                  sliderWidth={250}
		                  itemWidth={300}
		                  renderItem={renderCard}
		                  onSnapToItem = { index => setCardsState({activeIndex:index, carouselItems: [carouselList]}) } />
		            </View>
	          	</SafeAreaView>
			</View>

		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	top: {
		flex: 1,
		backgroundColor: '#0142f0',
		borderBottomLeftRadius: 40,
		borderBottomRightRadius: 40,
		flexDirection: 'row',
	},
	bottom: {
		flex: 1,
		backgroundColor: '#f7f7f7',
	},
	welcomeText: {
		color: 'white',
		fontSize: 20,
		fontWeight: '600',
		marginVertical: 80,
		marginHorizontal: 40,
		width: 160,
	},
	profilePicBorder: {
		justifyContent: 'center',
		alignItems: 'center',
		width: 60,
		height: 60,
		marginVertical: 70,
		marginHorizontal: 70,
		backgroundColor: 'black',
		borderRadius: 40,
		borderWidth: 1,
		borderColor: 'white',
	},
	profilePic: {
		width: 60,
		height: 60,
		borderRadius: 100,
		borderWidth: 2,
		borderColor: 'white',
		// marginVertical: 40,
		// marginHorizontal: 50,
	},
	topTitle: {
		color: 'white',
		fontSize: 30,
		fontWeight: '700',
		width: 250,
		textAlign: 'center',
		// marginVertical: 80,
		// marginHorizontal: 40
	}
});