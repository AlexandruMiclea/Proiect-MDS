import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View, Image, TouchableOpacity} from 'react-native';
import { Text } from '@/components/Themed';
import PackingListItem from '@/components/PackingListItem';
import { countries } from 'countries-list';
const cities = require('assets/countries/countries.json');
 

interface Item {
  id: string;
  text: string;
  checked: boolean;
}

const PackingListLayout = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [text, setText] = useState('');
  const [isCelsiusActive, setIsCelsiusActive] = useState(true);
  const [temperature, setTemperature] = useState(29);

  const addItem = () => {
    if (text === '') return;
    const newItem = { id: Date.now().toString(), text, checked: false };
    setItems([...items, newItem]);
    setText('');
  };

  const editItem = (id: string, editedText: string) => {
    if (editedText) {
      setItems(items.map((item) => (item.id === id ? { ...item, text: editedText } : item)));
    }
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const toggleChecked = (id: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  const calculateProgress = () => {
    const checkedCount = items.filter((item) => item.checked).length;
    const totalCount = items.length;
    if (totalCount > 0){
      return (checkedCount / totalCount * 100).toFixed(0);
    }
    return 0;
  }
  const toggleTemperatureUnit = () => {
    setIsCelsiusActive(!isCelsiusActive);
    if (isCelsiusActive) {
      setTemperature((temperature * 9) / 5 + 32);
    } else {
      setTemperature((temperature - 32) / 1.8);
    }
  };
  const progress = calculateProgress();
  return (
    <View style={styles.container}>
      <Image source={require("../../../../assets/images/stockholm.png")} style={styles.image}/>
      <View style={styles.listContainer}>
      <Text style={styles.title}>{cities["Romania"][0].name}</Text>
  
      <View style={styles.detailsContainer}>
        <View>
          <Text style={styles.dates}>Jul 20 - Jul 24</Text>
          <Text style={styles.progress}>Progress: {progress}%</Text>
        </View>
        <View style={styles.temperatureContainer}>
          <Text style={styles.weather}>{temperature}</Text>
            <TouchableOpacity onPress={toggleTemperatureUnit}>
              <Text style={[styles.weather, !isCelsiusActive && styles.inactiveText]}>°C</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleTemperatureUnit}>
              <Text style={[styles.weather, isCelsiusActive && styles.inactiveText]}> | °F </Text>
            </TouchableOpacity>  
        </View>
      </View>
      <TextInput
        style={styles.input}
        onChangeText={setText}
        value={text}
        placeholder="Add an item"
        onSubmitEditing={addItem}
      />
      <ScrollView contentContainerStyle={styles.itemsContainer}>
        {items.map((item) => (
          <PackingListItem
            key={item.id}
            item={item}
            deleteItem={deleteItem}
            editItem={editItem}
            toggleChecked={toggleChecked}
          />
        ))}
      </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  listContainer:{
    width:'100%',
    padding:20
  },
  title: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom:10,
  },
  detailsContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dates: {
    fontWeight: '500',
    textTransform: 'uppercase',
    marginBottom:10,
  },
  progress:{
    color: '#7478fc',
    marginBottom: 10,
    fontWeight:'900'
  },
  temperatureContainer:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  weather: {
    fontSize: 27,
    fontWeight:'500'
  },
  inactiveText:{
    color:'#c2c0c0',
  },
  input: {
    borderRadius: 50,
    height: 50,
    borderColor: 'lightgray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  itemsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  image: {
    width:"100%",
    height: 150,
  }
});

export default PackingListLayout;
