import React from 'react';
import { View, Text, StyleSheet, Image, Modal, TextInput, Button, Dimensions, ToastAndroid, ScrollView, RefreshControl } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useState, useEffect } from 'react';
import Firebase from 'firebase';
import IconF from 'react-native-vector-icons/Feather';

const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;

export default function ProfileScreen(props){


	var user = global.user;

	const [modalVisible, setModalVisible] = useState(false);
	const [newPassword, setNewPassword] = useState('');
	const [toastVisible, setToastVisible] = useState(false);

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

	useEffect(() => {
		onRefresh();
		setToastVisible(false);
		// console.log(props.navigation);
	}, [])


	function changePassword(newPass){
		Firebase.database()
		.ref('/users/' + user)
		.update({password : newPass});
	}

	const Toast = ({ visible, message }) => {
		if (visible) {
		  ToastAndroid.showWithGravityAndOffset(
			message,
			ToastAndroid.SHORT,
			ToastAndroid.BOTTOM,
			25,
			50,
		  );
		  return null;
		}
		return null;
	  };





	  return (
		  <View>
			<Modal
				animationType = "fade"
				transparent = {true}
				visible = {modalVisible}
				onRequestClose = {() => {
				}}
			>
				<View style = {{flex: 1, width: widthScreen, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
				<View style = {styles.modalStyle}>
					<Text style = {{marginLeft: 20}}> Set New Password: </Text>

					<TextInput
						placeholder = 'new password'
						onChangeText = {(text) => setNewPassword(text)}
						style = {styles.newPassTextInput}
					/>

					<View style = {{flexDirection: 'row'}}>
						<View style = {{flex: 1, marginHorizontal: 5}}>
							<Button
								title = 'Cancel'
								onPress = {() => {setModalVisible(!modalVisible)}}
							/>
						</View>
						<View style = {{flex: 1, marginHorizontal: 5}}>
							<Button
								title = 'Save'
								onPress = {() => {
									if(newPassword.length > 0){
										setModalVisible(!modalVisible);
										changePassword(newPassword);
										setToastVisible(true);
									}
								}}
							/>
						</View>
					</View>
				</View>
				</View>
			</Modal>


			<Toast visible = {toastVisible} message = "Password updated Successfully!" />

			<View style={styles.header}>
				<View style={styles.headerContent}>
					<Text style = {styles.profileHeaderText}>Profile</Text>
					<TouchableOpacity onPress = {() => props.navigation.navigate('Login')} >
						<Text style = {styles.logoutText}>Logout</Text>
					</TouchableOpacity>

					<Image
						source={{uri: database.profilePic}}
						style = {styles.profilePic}
					/>

					<Text style={styles.name}>Name:  <Text style = {{color: 'green'}}>{database.name}</Text></Text>
					<Text style={styles.name}>SRN:  <Text style = {{color: 'green'}}>{database.SRN}</Text></Text>
					<Text style={styles.name}>Subjects:  <Text style = {{color: 'green', fontSize: 15}}>{Object.values(database.subjects).join(', ')}</Text></Text>
					<View style = {{flexDirection: 'row', alignItems: 'center'}}>
						<Text style={styles.name}>Password:  <Text style = {{color: 'green'}}>{'⬤'.repeat(database.password.length)}</Text></Text>
						<TouchableOpacity onPress = {() => {setNewPassword(''); setModalVisible(!modalVisible); setToastVisible(false);}} >
							<View style = {{padding: 5}}><IconF name = 'edit' size = {30} style = {{paddingTop: 20, paddingLeft: 10}} /></View>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	profileHeaderText: {
		position: 'absolute',
		fontSize: 30,
		color: 'white',
		alignSelf: 'flex-start',
		marginLeft: widthScreen * 0.05,
		marginTop: heightScreen * 0.05,
		fontWeight: 'bold',
	},
	header:{
		backgroundColor: "#1E90FF",
		height: heightScreen * 0.3,
	  },
	  headerContent:{
		padding:30,
		alignItems: 'center',
	  },
	  profilePic: {
		width: 130,
		height: 130,
		borderRadius: 63,
		borderWidth: 4,
		borderColor: "white",
		marginBottom:10,
		marginTop: '30%',
	  },
	  name: {
		fontSize: 18,
		backgroundColor: '#dfe6e9',
		padding: 10,
		borderRadius: 10,
		color: 'black',
		marginTop: 20,
	  },
	  modalStyle: {
		alignSelf: 'center',
		width: widthScreen * 0.8,
		height: heightScreen * 0.2,
		backgroundColor: 'white',
		justifyContent: 'center',
		borderRadius: 10,
		elevation: 500,
		marginTop: 300,
		position: 'absolute',
		justifyContent: 'space-around',
		borderWidth: 2,
	},
	newPassTextInput: {
		// borderWidth: 1,
		borderRadius: 5,
		padding: 5,
		fontSize: 18,
		width: '90%',
		alignSelf: 'center',
		backgroundColor: '#dfe6e9',
		color: 'black',
	},
	logoutText: {
		marginLeft: widthScreen * 0.7,
		marginTop: heightScreen * 0.03,
		color: 'white',
		fontWeight: 'bold',
	},
});