import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import HomeScreen from './HomeScreen';
import AttendanceScreenConstructor from './AttendanceScreenConstructor';
import AttendanceScreen from './AttendanceScreen';
import ProfileScreen from './ProfileScreen';
import IconMI from 'react-native-vector-icons/MaterialIcons';
import IconF from 'react-native-vector-icons/Feather';
import IconAD from 'react-native-vector-icons/AntDesign';
import { useState, useEffect } from 'react';
import { AsyncStorage } from 'react-native';




var user = '<user-id-goes-here>';
// var user = navigation.getParams('SRN');
// console.log(user);
// var user = this.props.navigation.dangerouslyGetParent().getParam('SRN');


const TabNavigator = createBottomTabNavigator({
    AttendanceScreen: {
        screen: AttendanceScreen,
        navigationOptions: {
            tabBarLabel: 'Attendance',
            tabBarIcon: ({tintColor}) => (
                // <IconM name = "account-check-outline" color = {tintColor} size = {35}/>
                // <IconSLI name = "check" color = {tintColor} size = {35}/>
                <IconF name = "check-circle" color = {tintColor} size = {35}/>
            )
        }
    },
    Home: {
        screen: HomeScreen,
        navigationOptions: {
            tabBarLabel: 'Home',
            tabBarIcon: ({tintColor}) => (
                <IconAD name = "home" color = {tintColor} size = {35}/>
            )
        }
    },
    Profile: {
        screen: ProfileScreen,
        navigationOptions: {
            tabBarLabel: 'Profile',
            tabBarIcon: ({tintColor}) => (
                <IconMI name = "person-outline" color = {tintColor} size = {35}/>
            )
        }
    },
},
{
    initialRouteName: "Home",
    tabBarOptions: {
        showLabel: false,
    },
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    }
});

export default createAppContainer(TabNavigator);