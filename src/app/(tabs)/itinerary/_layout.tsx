import React from "react";
import DropdownComponent from "@/components/Dropdown";
import { View, StyleSheet, Pressable, Text } from "react-native";

import countriesDataJson from '@assets/data/countriesNames.json';
import Calendar from "@/components/Calendar";

const countriesData = JSON.parse(JSON.stringify(countriesDataJson));

const NewItinerary = () => {


  return (
      <View>
        <DropdownComponent label='country' labelField="name" valueField="name" dropdownData={countriesData}></DropdownComponent>
        {/* <DropdownComponent label='city'></DropdownComponent> */}
        {/* aici pretty much trebuie sa fac un context / un provider ceva astfel incat cand se schimba tara selectata sa trimit in
            al 2 lea dropdown orasele tarii respective */}
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