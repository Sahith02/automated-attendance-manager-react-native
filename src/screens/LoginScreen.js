import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Button, Image, TouchableOpacity } from 'react-native';
import LoginForm from './LoginForm';

export default function LoginScreen(props){
	return (
		<KeyboardAvoidingView behavior = 'position' keyboardVerticalOffset = {-2000} style = {styles.container}>

			<View>
				<Image
					source = {require('../../assets/loginLogo.png')}
					style = {{width: 350, height: 250, alignSelf: 'center'}}
				/>
			</View>

			<View styles = {styles.logoContainer}>
				<Text style = {styles.title}>Login</Text>
			</View>

			<View style = {styles.formContainer}>
				<LoginForm navigation = {props.navigation}/>
			</View>

			<View style = {styles.continueView}>
				
				
				{/* {global.user &&
					<TouchableOpacity onPress = {() => props.navigation.navigate('AppHome')} style = {styles.continueButton} activeOpacity = {0.9} >
					<Text>Continue</Text>
				</TouchableOpacity>} */}
			</View>

		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#3498db',
		justifyContent: 'center',
	},
	logoContainer: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
	},
	title: {
		color: '#FFF',
		marginTop: 10,
		// width: 160,
		fontSize: 35,
		fontWeight: 'bold',
		textAlign: 'center',
		opacity: 0.9,
	},
	formContainer: {
		// marginBottom: 10,
		// justifyContent: 'center',
	},
	continueView: {
		// backgroundColor: 'white',
		height: 100,
	},
});