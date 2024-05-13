import React, { useCallback, useEffect, useState } from "react";
import DropdownComponent from "@/components/Dropdown";
import { View, StyleSheet, TouchableOpacity, Text, TextInput } from "react-native";
import countriesNamesJson from '@assets/data/countriesNames.json';
import countriesCitiesJson from '@assets/data/countriesInfo.json';
import { DatePickerModal } from "react-native-paper-dates";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import NumericInput from "@/components/NumericInput";
import { en, registerTranslation } from 'react-native-paper-dates';
import ItineraryPage from './itineraryPage'
import { useNavigation, useRouter } from "expo-router"

registerTranslation('en', en)

const countriesNames = JSON.parse(JSON.stringify(countriesNamesJson));
const countriesCities = JSON.parse(JSON.stringify(countriesCitiesJson));

const NewItinerary = () => {
  const router = useRouter();

  type Errors = {
    validCountry: string,
    validCity: string,
    validStartDate: string,
    validEndDate: string,
    validBudget: string,
  };

  let errors: Errors = { validCountry: "", validCity: "", validStartDate: "", validEndDate: "", validBudget: "" }

  const [country, setCountry] = useState<string>('');
  const [city, setCity] = useState<string | null>(null);

  const [range, setRange] = React.useState<{ startDate: CalendarDate, endDate: CalendarDate }>({ startDate: undefined, endDate: undefined });
  const [open, setOpen] = React.useState(false);

  const [budget, setBudget] = useState<string>('');

  const colorScheme = useColorScheme();
  const mainColor = Colors[colorScheme ?? 'light'].tint;

  function validateForm() {
    if (!country){
      errors.validCountry = "No country selected.";
    }
    if (!city){
      errors.validCity = "No city selected.";
    }
    if (!range.startDate){
      errors.validStartDate = "No start date selected.";
    }
    if (!range.endDate){
      errors.validEndDate = "No end date selected.";
    }
    if (!budget){
      errors.validBudget = "No itinerary budget given.";
    }

    return errors.validCountry === "" && errors.validCity === "" && errors.validStartDate === "" && errors.validEndDate === "" && errors.validBudget === ""
  }

  const calendarOnDismiss = React.useCallback(() => {
      setOpen(false);
  }, [setOpen]);

  const calendarOnConfirm = React.useCallback(
      ({ startDate, endDate }: { startDate: CalendarDate, endDate: CalendarDate }) => {
      setOpen(false);
      setRange({ startDate: startDate, endDate: endDate });
      },
      [setOpen, setRange]
  );

  const logInfo = () => {
    console.log(
      "Country: " + country + '\n' + "City: " + city + '\n' + 
      "Start date & End date: " + range.startDate?.toLocaleDateString() + " " + range.endDate?.toLocaleDateString() + '\n' +
      "Budget: " + budget + '\n'
    )}

  const handleSubmit = () => {
    logInfo();
    validateForm();
    if (validateForm()){
      console.log("success");
      router.navigate({pathname: "itinerary/itineraryPage", params: {country: country, city: city, startDate: range.startDate?.toLocaleDateString(), endDate: range.endDate?.toLocaleDateString(), budget: budget}})
      // TODO the data is valid, redirect to next screen in stack
    } else {
      // TODO log the errors in their respective zones
      console.log("error log:");
      console.log(errors.validCountry);
      console.log(errors.validCity);
      console.log(errors.validStartDate);
      console.log(errors.validEndDate);
      console.log(errors.validBudget);
    }
  }

  return (
      <View style={styles.mainContainer}>
        <DropdownComponent label='country' labelField="name" valueField="name" dropdownData={countriesNames} onChange={setCountry} iconName="earth"></DropdownComponent>
        <DropdownComponent label='city' labelField="name" valueField="name" dropdownData={countriesCities[country]} onChange={setCity} iconName="city"></DropdownComponent>

        <View style={styles.calendarContainer}>
            <Text style={styles.intervalText}>Trip interval: {range.startDate?.toLocaleDateString()} - {range.endDate?.toLocaleDateString()}</Text>
            <TouchableOpacity onPress={() => setOpen(true)} style={[styles.button, {backgroundColor: mainColor}]}>
              <FontAwesome size={18} color="white" name="calendar-o"/>
                <DatePickerModal
                locale="en"
                mode="range"
                visible={open}
                onDismiss={calendarOnDismiss}
                startDate={range.startDate}
                inputEnabled={false}
                endDate={range.endDate}
                onConfirm={calendarOnConfirm}
                startYear={2023}
                endYear={2025}
                // TODO: adauga validRange!
                saveLabel="Save"
                label='Choose your vacation interval'
                presentationStyle='pageSheet'
                />
            </TouchableOpacity>
        </View>
        <NumericInput label='budget' onChange={setBudget}></NumericInput>

        <View style={styles.createButtonContainer}>
          {/* aici trebuie sa adaugati voi onPress la touchableopacity sa faca ce vreti voi
              datele de care aveti nevoie sunt country, city, range.startDate, range.endDate si budget
              in functia de la onpress sa faceti un for care trece prin countriescities[country] si salveaza info despre orasu respectiv*/}
          <TouchableOpacity 
            onPress ={handleSubmit}
            style={[styles.createButton, {backgroundColor: mainColor}]
          }>
            <Text style={styles.createButtonText}>Create</Text>
          </TouchableOpacity>
        </View>
      </View>
      
)}

export default NewItinerary;


const styles = StyleSheet.create({
  createButtonContainer: {
    display: 'flex',
    position: 'absolute',
    bottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  createButton: {
    
    display: 'flex',
    width: '80%',
    height: '100%',
    alignItems: 'center',
    borderRadius: 14,
  },
  createButtonText: {
    color: 'white',
    paddingVertical: 14,
  },
  budgetInput: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 10,
    width: 200,
  },
  mainContainer: {
    margin: 8,
    height: '100%',
  },
  intervalText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: 'gray',
    padding: 1,
    justifyContent: 'center', 
    height: '72%',
    aspectRatio: 1,
    alignItems: 'center',
    margin: 4,
    borderRadius: 7,
    position: 'absolute',
    right: 14,
  },
  calendarContainer: {
    padding: 16,
    height: 92,
    backgroundColor: 'white',
    flexDirection: 'row',
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