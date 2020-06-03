import React from 'react';
import { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import { AsyncStorage } from 'react-native';
import Firebase from 'firebase';
import { NavigationEvents } from 'react-navigation';

export default function LoginScreen(props){

	const [SRN, setSRN] = useState('');
	const [password, setPassword] = useState('');
	// var SRN = '';
	// var password = '';
	const [warningMessage, setWarningMessage] = useState('');



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
	    .ref('/users/')
	    .once('value', snapshot => {
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

	useEffect(() => {
		// SRN = '';
		// password = '';
		// setSRN('');
		// setPassword('');
		onRefresh();
		getData();

		// const onFocusDataUpdate = props.navigation.addListener(
		// 	'willFocus',
		// 	() => {
		// 		setSRN('');
		// 		setPassword('');
		// 		updateDatabase();
		// 		getData();
		// 	}
		// );


		// return onFocusDataUpdate.remove();


	}, []);
	
	// useFocusEffect(() => {
	// 	React.useCallback(() => {
	// 		setSRN('');
	// 		setPassword('');
	// 		onRefresh();
	// 		getData();
	// 	}, [])
	// });

	function onFocusFunction(){
		// setSRN('');
		// setPassword('');
		updateDatabase();
		getData();
	}




	async function onSubmit() {
		// SRN = SRN1;
		// password = password1;
		try{
			await setSRN(SRN);
			await updateDatabase();
			// console.log(database)
			// await wait(2000);
			// await AsyncStorage.setItem('SRNToken', SRN);
			if(SRN == '' || password == ''){
				setWarningMessage('Please enter the correct SRN and password');
			}
			else{
				await setSRN(SRN);
				await updateDatabase();
				// await wait(2000);
				if(database[SRN] == null){
					setWarningMessage('SRN does not exist');
				}
				else{
					if(database[SRN]['password'] != password){
						setWarningMessage('Incorrect Password, please try again');
					}
					else{
						await AsyncStorage.setItem('SRNToken', SRN);
						global.user = SRN;
						// console.log(global.user);
						props.navigation.navigate('AppHome');
					}
				}
			}
		}
		catch(err){
			console.log(err);
		}
	}

	async function getData() {
		try {
		  const value = await AsyncStorage.getItem('SRNToken')
		  if(value !== null) {
				global.user = value;
				// console.log(global.user);
				// SRN = value;
				setSRN(value);
		  }
		} catch(e) {
			console.log(e);
		}
	  }





	return (
		<View style = {styles.container}>
			<NavigationEvents            
				onWillFocus = {payload => onFocusFunction()}
				onDidFocus = {payload => onFocusFunction()}
				onWillBlur = {payload => onFocusFunction()}
				onDidBlur = {payload => onFocusFunction()}
			/>
			{/* <Text>{global.user}</Text> */}
			{/* <Text>{SRN}</Text>
			<Text>{password}</Text> */}
			<Text style = {{color: 'white', alignSelf: 'center', fontWeight: 'bold'}} >{warningMessage}</Text>
			<TextInput
				placeholder = 'SRN'
				placeholderTextColor = 'rgba(255, 255, 255, 0.7)'
				style = {styles.input}
				onChangeText = {(text) => {setSRN(text)}}
			/>
			<TextInput
				placeholder = 'password'
				placeholderTextColor = 'rgba(255, 255, 255, 0.7)'
				secureTextEntry
				style = {styles.input}
				onChangeText = {(text) => {setPassword(text)}}
			/>
			<TouchableOpacity style = {styles.buttonContainer} onPress = {() => /*props.navigation.navigate('AppHome')*/ {onSubmit()}}>
				<Text style = {styles.buttonText}>Login</Text>
			</TouchableOpacity>

			{global.user && <Text style = {styles.continueText}>{global.user} already logged in</Text>}
			
			{global.user && 
				<TouchableOpacity onPress = {() => props.navigation.navigate('AppHome')} style = {styles.continueButton} activeOpacity = {0.9} >
					<Text>Continue</Text>
				</TouchableOpacity>
			}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 20,
	},
	input: {
		height: 45,
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		marginBottom: 15,
		color: '#FFF',
		paddingHorizontal: 10,
		fontSize: 15
	},
	buttonContainer: {
		backgroundColor: '#2980b9',
		paddingVertical: 15,
		marginTop: 25,
	},
	buttonText: {
		textAlign: 'center',
		color: '#FFF',
		fontWeight: '700',
		fontSize: 15,
	},
	continueText: {
		fontSize: 16,
		textAlign: 'center',
		color: 'white',
		marginTop: 30,
	},
	continueButton: {
		backgroundColor: 'white',
		width: '50%',
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		borderRadius: 20,
	},
});