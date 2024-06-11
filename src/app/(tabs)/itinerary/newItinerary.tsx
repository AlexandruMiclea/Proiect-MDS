import React, { useState, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import { DatePickerModal } from "react-native-paper-dates";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from "expo-router";

import DropdownComponent from "@/components/Dropdown";
import NumericInput from "@/components/NumericInput";
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

import countriesNamesJson from '@assets/data/countriesNames.json';
import countriesCitiesJson from '@assets/data/countriesInfo.json';

import { en, registerTranslation } from 'react-native-paper-dates';

registerTranslation('en', en);

const countriesNames = JSON.parse(JSON.stringify(countriesNamesJson));
const countriesCities = JSON.parse(JSON.stringify(countriesCitiesJson));

const NewItinerary = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const mainColor = Colors[colorScheme ?? 'light'].tint;

  const [country, setCountry] = useState<string>('');
  const [city, setCity] = useState<string | null>(null);
  const [range, setRange] = useState<{ startDate: CalendarDate, endDate: CalendarDate }>({ startDate: undefined, endDate: undefined });
  const [open, setOpen] = useState(false);
  const [budget, setBudget] = useState<string>('');

  // Callback function to handle calendar dismissal & confirmations
  const calendarOnDismiss = useCallback(() => setOpen(false), []);
  const calendarOnConfirm = React.useCallback(
    ({ startDate, endDate }: { startDate: CalendarDate, endDate: CalendarDate }) => {
      setOpen(false);
      setRange({ startDate: startDate, endDate: endDate });
    },
    [setOpen, setRange]
  );

   // Function to handle country change in the dropdown
  const handleCountryChange = (selectedCountry: string) => {
    setCountry(selectedCountry);
    setCity(null);
  };

    // Function to validate user inputs
  const validateInputs = () => {
    if (!country) return showAlert('Please select a country.');
    if (!city) return showAlert('Please select a city.');
    if (!range.startDate || !range.endDate) return showAlert('Please select a date range.');
    if (!budget) return showAlert('Please enter a budget.');
    if (parseInt(budget) < 100) return showAlert('Please enter a budget bigger than 100.');
    return true;
  };

  const showAlert = (message: string) => {
    Alert.alert('Validation Error', message);
    return false;
  };

   // Function to log the user's selected information
  const logInfo = () => {
    console.log(
      `Country: ${country}\nCity: ${city}\nStart date & End date: ${range.startDate?.toLocaleDateString()} - ${range.endDate?.toLocaleDateString()}\nBudget: ${budget}`
    );
  };

  // Function to handle form submission
  const handleSubmit = () => {
    if (validateInputs()) {
      router.navigate({
        pathname: "itinerary/itineraryPage",
        params: { 
          country, 
          city, 
          startDate: range.startDate?.toLocaleDateString(), 
          endDate: range.endDate?.toLocaleDateString(), 
          budget 
        }
      });
      logInfo();
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* Dropdown for selecting country */}
      <DropdownComponent 
        label='country' 
        labelField="name" 
        valueField="name" 
        dropdownData={countriesNames} 
        onChange={handleCountryChange} 
        iconName="earth" 
      />
      {/* Dropdown for selecting city */}
      <DropdownComponent 
        label='city' 
        labelField="name" 
        valueField="name" 
        dropdownData={countriesCities[country]} 
        onChange={setCity} 
        iconName="city" 
      />
      <View style={styles.calendarContainer}>
        <View style={styles.calendarBorder}>
          {/* Display selected date range */}
          <Text style={styles.intervalText}>
            Trip interval: {range.startDate?.toLocaleDateString()} - {range.endDate?.toLocaleDateString()}
          </Text>
          {/* Button to open date picker */}
          <TouchableOpacity 
            onPress={() => setOpen(true)} 
            style={[styles.button, { backgroundColor: mainColor }]}
          >
            <FontAwesome size={18} color="white" name="calendar-o" />
            {/* Date picker modal */}
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
              validRange={{ startDate: new Date() }}
              saveLabel="Save"
              label='Choose your vacation interval'
              presentationStyle='pageSheet'
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* Numeric input for budget */}
      <NumericInput label='budget' onChange={setBudget} />
      <View style={styles.createButtonContainer}>
        {/* Button to submit the form */}
        <TouchableOpacity
          onPress={handleSubmit}
          style={[styles.createButton, { backgroundColor: mainColor }]}
        >
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NewItinerary;

const styles = StyleSheet.create({
  createButtonContainer: {
    display: 'flex',
    position: 'absolute',
    bottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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
  mainContainer: {
    margin: 8,
    height: '100%',
    backgroundColor: 'white',
  },
  intervalText: {
    fontSize: 16,
    top: '33%',
    left: 14,
  },
  button: {
    padding: 1,
    justifyContent: 'center',
    height: '72%',
    aspectRatio: 1,
    alignItems: 'center',
    borderRadius: 7,
    position: 'absolute',
    right: 6,
    top: 7,
  },
  calendarContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 82,
  },
  calendarBorder: {
    width: '100%',
    borderWidth: 1,
    height: '100%',
    borderRadius: 8,
    borderColor: 'gray',
  },
});
