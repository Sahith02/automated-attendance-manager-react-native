import React from 'react';
import { AppRegistry, View, Text, StyleSheet } from 'react-native';
import AttendanceScreen from './AttendanceScreen';
import Firebase from 'firebase';


export default class AttendanceScreenConstructor extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			data: `<sample-database-goes-here>`,
			user: '<user-id-goes-here>'
		};
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
	}

	componentDidMount(){
		Firebase.database()
	    .ref('/users/' + user)
	    .once('value')
	    .then(snapshot => {
	      var db = snapshot.val();
	      // console.log('User data: ', db);
	      this.setState({data: JSON.stringify(db)});
	      // this.state = {data: JSON.stringify(db)};
		  // console.log(this.state.database.SRN);
	    });
	}

	render(){
		return(
			<View>
				<AttendanceScreen username = {user} data = {this.state.data}/>
			</View>
		);
	}
}

AppRegistry.registerComponent('AttendanceScreenConstructor', () => AttendanceScreenConstructor);