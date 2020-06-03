import React, {useState, useEffect} from 'react';
import { StyleSheet, ScrollView, Text, View, FlatList, Button, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';
import Modal from 'react-native-modalbox';
// import {DB} from './src/config.js';
import Firebase from 'firebase';
import ModalContent from './ModalContent';

const {width, height} = Dimensions.get('window');




export default function AttendanceScreen(props) {

// var db;
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

  var user = global.user;
  // var propData = JSON.parse(props.data);
  // console.log(user);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSubject, setModalSubject] = useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const [database, setDatabase] = useState(JSON.parse(`sample database`));
  // console.log(data);



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
    console.disableYellowBox = true;
  }, [])

  function getPercentageRange(p){
    if(p >= 85){
      return 1;
    }
    if(p >= 75 && p < 85){
      return 2;
    }
    if(p < 75){
      return 3;
    }
  }

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

  function countIncrease(){
    setCount(count + 1);
  }

  function sortDates(obj){
    obj = Object.entries(obj);
    for(var i = 0; i < obj.length; i++){
        var day = obj[i][0];
        day = day.split('-');
        day = [day[1], day[0], day[2]];
        obj[i][0] = day;
//         obj[i][0] = new Date(day);
    }
    var sortedDates = obj.sort((a, b) => new Date(b[0]) - new Date(a[0]));
    var finalList = [];
    for(var i = 0; i < sortedDates.length; i++){
        sortedDates[i][0] = new Date(sortedDates[i][0]).toDateString();
//         sortedDates[i] = {name: sortDates[i]};
//         console.log(sortedDates[i]);
        finalList.push({name: sortedDates[i]});
    }
    return finalList;
  }


  // var db = JSON.parse(data);
  var listAttendance = [];
  var attendance = Object.values(database.attendance);
  for(var i = 0; i < attendance.length; i++){
      var listItem = [];
      var day = Object.values(attendance[i]).join("")
      var subject = Object.keys(database.attendance)[i];
      var attPerc = (((day.match(/1/g) || []).length)/day.length) * 100;
      attPerc = Math.round(attPerc * 100) / 100
      listItem.push(subject);
      listItem.push(attPerc);
      listAttendance.push({name: listItem});
      // console.log(listAttendance)
  }
  /*
    listAttendance = [{name: ['UE18CS251', 0]}, {name: [...]}...]
  */


  function GetModal() {
    var object = {"1-1-20":"11","2-1-20":"1","3-1-20":"1","4-1-20":"1"};
    var object = Object(object);
    
    return (
      <Modal 
        entry = 'bottom'
        backdropPressToClose = {true}
        isOpen =  {modalVisible}
        style = {styles.modalBox}
        onClosed = {() => setModalVisible(false)}
      >
        <View style = {styles.content}>
          <ModalContent dayAtt = {object}/>
        </View>
      </Modal>
    );
}







  return (
    <View>
      <ScrollView
        refreshControl = {
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
      >
        <View style={styles.container}>

          <View style = {styles.header}>
            <Text style = {styles.headerText}>Hello {database.name}!</Text>
          </View>

          <View style = {styles.tableHeader}>
            <Text style = {styles.tableHeaderItem}>Subject</Text>
            <Text style = {styles.tableHeaderItem}>Percentage</Text>
          </View>

          <FlatList
            style = {{width: '100%'}}
            data = {listAttendance}
            keyExtractor = {(item) => {return item.name.toString()}}
            renderItem = {({item}) => (
              <View>

                <TouchableOpacity onPress = {() => {setModalVisible(!modalVisible); setModalSubject(item.name[0])}}>
                  <View style = {styles.listItem}>
                    <View style = {{justifyContent: 'center'}}>
                      <Text style = {styles.subjectCode}>{database.subjects[item.name[0]]}</Text>
                      <Text>{item.name[0]}</Text>
                    </View>

                    <Text style = {[
                      (getPercentageRange(item.name[1]) == 1)? styles.satisfactory: styles.subjectPerc,
                      (getPercentageRange(item.name[1]) == 2)? styles.warning: styles.subjectPerc,
                      (getPercentageRange(item.name[1]) == 3)? styles.danger: styles.subjectPerc,
                      styles.subjectPerc]}>{item.name[1]}%</Text>
                  </View>
                </TouchableOpacity>

                
              </View>
            )}
          />
          
        </View>
      </ScrollView>
        <GetModal />
    </View>
  );
}

const styles = StyleSheet.create({
  satisfactory: {
    color: 'green'
  },
  warning: {
    color: 'orange'
  },
  danger: {
    color: 'red'
  },
  header: {
    // backgroundColor: 'orange',
    width: '100%',
    height: '7.55%',
    marginTop: 0,
    // alignItems: 'center',
    justifyContent: 'flex-end',
  },
  headerText: {
    fontSize: 25,
    marginLeft: 10,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50
    // marginTop: 10
  },
  listItem: {
    flex: 1,
    paddingVertical: 25,
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  subjectCode: {
    fontSize: 20,
    lineHeight: 40,
    width: 130,
    marginRight: 15,
    fontWeight: 'bold',
    // fontFamily: 'roboto'
  },
  subjectPerc: {
    fontSize: 25,
    lineHeight: 40
  },
  tableHeader: {
    flexDirection: 'row',
    width: '100%',
    borderBottomWidth: 5,
    borderBottomColor: 'black',
    borderTopWidth: 5,
    borderTopColor: 'black',
    paddingVertical: 0,
    justifyContent: 'space-between',
    paddingHorizontal: 25
  },
  tableHeaderItem: {
    fontSize: 25,
    lineHeight: 60,
    width: 150,
    fontWeight: 'bold',
  },
  refreshButton: {
    marginVertical: 50,
    backgroundColor: '#3498db',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 5,
    elevation: 5,
  },
  refreshButtonText: {
    color: '#FFF'
  },
  modalBox: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    height,
    width,
    backgroundColor: 'transparent'
  },
  content: {
    position: 'absolute',
    bottom: 0,
    width,
    height: '50%',
    borderTopLeftRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 20,
    backgroundColor: 'white',
  }
});
