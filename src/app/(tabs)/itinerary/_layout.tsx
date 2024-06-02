import React, { useState } from "react";
import DropdownComponent from "@/components/Dropdown";
import { View, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import countriesNamesJson from '@assets/data/countriesNames.json';
import countriesCitiesJson from '@assets/data/countriesInfo.json';
import { DatePickerModal } from "react-native-paper-dates";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import NumericInput from "@/components/NumericInput";
import { en, registerTranslation } from 'react-native-paper-dates';

registerTranslation('en', en);

const countriesNames = JSON.parse(JSON.stringify(countriesNamesJson));
const countriesCities = JSON.parse(JSON.stringify(countriesCitiesJson));

const NewItinerary = () => {
  const [country, setCountry] = useState<string>('');
  const [city, setCity] = useState<string | null>(null);
  const [range, setRange] = React.useState<{ startDate: CalendarDate, endDate: CalendarDate }>({ startDate: undefined, endDate: undefined });
  const [open, setOpen] = React.useState(false);
  const [budget, setBudget] = useState<string>('');

  const colorScheme = useColorScheme();
  const mainColor = Colors[colorScheme ?? 'light'].tint;

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

  const validateInputs = () => {
    if (!country) {
      Alert.alert('Validation Error', 'Please select a country.');
      return false;
    }
    if (!city) {
      Alert.alert('Validation Error', 'Please select a city.');
      return false;
    }
    if (!range.startDate || !range.endDate) {
      Alert.alert('Validation Error', 'Please select a date range.');
      return false;
    }
    if (!budget) {
      Alert.alert('Validation Error', 'Please enter a budget.');
      return false;
    }
    return true;
  };

  const logInfo = () => {
    if (validateInputs()) {
      console.log(
        "Country: " + country + '\n' + 
        "City: " + city + '\n' + 
        "Start date & End date: " + range.startDate?.toLocaleDateString() + " - " + range.endDate?.toLocaleDateString() + '\n' +
        "Budget: " + budget + '\n'
      );
    }
  };

  const validRange = {
    startDate: new Date(),
    endDate: undefined,
    disabledDates: undefined
  };

  return (
    <View style={styles.mainContainer}>
      <DropdownComponent label='country' labelField="name" valueField="name" dropdownData={countriesNames} onChange={setCountry} iconName="earth"></DropdownComponent>
      <DropdownComponent label='city' labelField="name" valueField="name" dropdownData={countriesCities[country]} onChange={setCity} iconName="city"></DropdownComponent>

      <View style={styles.calendarContainer}>
        <View style={styles.calendarBorder}>
          <Text style={styles.intervalText}>Trip interval: {range.startDate?.toLocaleDateString()} - {range.endDate?.toLocaleDateString()}</Text>
          <TouchableOpacity onPress={() => setOpen(true)} style={[styles.button, { backgroundColor: mainColor }]}>
            <FontAwesome size={18} color="white" name="calendar-o" />
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
              validRange={validRange}
              saveLabel="Save"
              label='Choose your vacation interval'
              presentationStyle='pageSheet'
            />
          </TouchableOpacity>
        </View>
      </View>
      <NumericInput label='budget' onChange={setBudget}></NumericInput>

      <View style={styles.createButtonContainer}>
        <TouchableOpacity
          onPress={logInfo}
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
    top: '33%',
    left: 12,
  },
  button: {
    backgroundColor: 'gray',
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
    backgroundColor: 'white',
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
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
});
