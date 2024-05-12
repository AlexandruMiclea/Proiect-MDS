import React, { useState } from "react";
import DropdownComponent from "@/components/Dropdown";
import { View, StyleSheet, Pressable, Text } from "react-native";
import countriesNamesJson from '@assets/data/countriesNames.json';
import countriesCitiesJson from '@assets/data/countriesInfo.json';
import Calendar from "@/components/Calendar";

const countriesNames = JSON.parse(JSON.stringify(countriesNamesJson));
const countriesCities = JSON.parse(JSON.stringify(countriesCitiesJson));

const NewItinerary = () => {

  const [country, setCountry] = useState<string>('');
  const [city, setCity] = useState<string | null>(null);

  return (
      <View>
        <DropdownComponent label='country' labelField="name" valueField="name" dropdownData={countriesNames} onChange={setCountry}></DropdownComponent>
        <DropdownComponent label='city' labelField="name" valueField="name" dropdownData={countriesCities[country]} onChange={setCity}></DropdownComponent>

        <View>
            <Calendar></Calendar> 
            {/* e nevoie fix de acelasi lucru ca la dropdown si aici ca sa am acces la datele de inceput / final selectate de user */}
        </View>
          
            
      </View>
      
)}

export default NewItinerary;


const styles = StyleSheet.create({
  button: {
    backgroundColor: 'gray',
    padding: 10,
    justifyContent: 'center', 
    flex: 1, 
    alignItems: 'center', 
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
})