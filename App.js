import React from 'react';
import {View, Text} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import AttendanceScreen from './src/screens/AttendanceScreen';
import LoginScreen from './src/screens/LoginScreen';
import AppHome from './src/screens/AppHome';

// export default function App(){
//   return (
//     <View style = {{alignContent: 'center', justifyContent: 'center'}}>
//       <Text>Hello!</Text>
//     </View>
//   );
// }

const AppNavigator = createStackNavigator({
  Attendance: {
    screen: AttendanceScreen,
    navigationOptions: {
      title: 'Welcome'
    }
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      title: 'Login'
    }
  },
  AppHome: {
    screen: AppHome,
    navigationOptions: {
      headerShown: false,
    }
  }
},
{
  initialRouteName: 'Login',
  defaultNavigationOptions: {
    headerStyle: {
        backgroundColor: '#3498db',
        elevation: 10,
        height: 100,
        shadowOpacity: 0
    },
    // headerTintColor: '#000',
    headerTitleStyle: {
        fontWeight: 'bold',
        color: '#ffffff'
    }
  }
})

export default createAppContainer(AppNavigator);