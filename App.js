import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, View, Button, TextInput, StatusBar, Dimensions, FlatList } from 'react-native';
import * as SQLite from'expo-sqlite';
//import{ AsyncStorage, Alert} from'react-native';
//import * as firebase from 'firebase';


export default function App() {
  const[item, setItem] = useState('');
  const[quant, setQuant] = useState('');
  const[list, setList] = useState([]);

  const db  = SQLite.openDatabase('listdb.db');

  useEffect(() => {
    db.transaction(tx  => {
      tx.executeSql('create table if not exists list (id integer primary key not null, item text, quant text);');
    },  null, updateList);
  }, []); 

  const saveItem = () => {
    db.transaction(tx => {
      tx .executeSql('insert into list (item, quant) values(?, ?);',
        [item, quant]);
    }, null, updateList
  )
}

  const deleteItem = (id) => {
      db.transaction(
        tx => { tx.executeSql('delete from list where id = ?;', [id]);}, null, updateList)
  }


const updateList = () => {
  db.transaction(tx => {
    tx.executeSql('select * from list;', 
    [], (_, { rows }) => 
      setList(rows._array)
      ); 
  });
  setItem('');
  setQuant('');
}

   return (
    <View  style={styles.container}>
 <Text style={{fontWeight:'800'}}>SHOPPING LIST</Text>
<TextInput
        style={{fontSize: 14, width: 200, margin:10, borderWidth:1, padding:5}}
        value={item}
        placeholder="Item"
        onChangeText={(item) => setItem(item)}
      />
<TextInput
        style={{fontSize: 14, width: 200, margin:10, borderWidth:1, padding:5}}
        value={quant}
        placeholder="Quantity"
        onChangeText={(quant) => setQuant(quant)}
      />
     <Button title="SAVE" onPress={saveItem}/>
     <FlatList 
        style={{marginLeft: "5%"}}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => 
          <View 
              style={styles.listcontainer}>
                < Text >{item.item}, {item.quant}</Text>
                <Text style={{color: 'red'}} 
                onPress={()  =>  deleteItem(item.id)  }> DELETE </Text>
                </View>}
        data={list}/>
     <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
 container: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop:80,
  backgroundColor:'#F5F5F5',
 },
 listcontainer: { 
  flexDirection:'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop:5,
},
});
