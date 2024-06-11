import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Alert, Platform } from "react-native";
import { DatePickerModal } from "react-native-paper-dates";
import DropdownComponent from "@/components/Dropdown";
import NumericInput from "@/components/NumericInput";
import countriesNamesJson from '@assets/data/countriesNames.json';
import countriesCitiesJson from '@assets/data/countriesInfo.json';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { en, registerTranslation } from 'react-native-paper-dates';
import * as Calendar from 'expo-calendar';

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

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission not granted to access calendar');
      }
    })();
  }, []);

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
    );
  };

  const createEvent = async () => {
    try {
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      console.log('Available calendars:', calendars);

      const defaultCalendar = calendars.find(calendar => calendar.source.name === 'Default' || calendar.accessLevel === Calendar.CalendarAccessLevel.OWNER);
      if (!defaultCalendar) {
        Alert.alert('No suitable calendar found.');
        return;
      }

      console.log('Using calendar:', defaultCalendar);

      const eventId = await Calendar.createEventAsync(defaultCalendar.id, {
        title: `Trip to ${city}, ${country}`,
        startDate: new Date(range.startDate), // Ensure this is in local time
        endDate: new Date(range.endDate), // Ensure this is in local time
        timeZone: 'EET', // Set to Eastern European Time
        location: city,
        notes: `Budget: ${budget}`,
      });
      console.log(`Your new event ID is: ${eventId}`);
      Alert.alert('Event Created', `Your new event ID is: ${eventId}`);
    } catch (error) {
      console.log('Error creating event:', error);
      Alert.alert('Error', 'Could not create event');
    }
  };

  const handleCreate = () => {
    logInfo();
    createEvent();
  };

  return (
    <View style={styles.mainContainer}>
      <DropdownComponent label='country' labelField="name" valueField="name" dropdownData={countriesNames} onChange={setCountry} iconName="earth" />
      <DropdownComponent label='city' labelField="name" valueField="name" dropdownData={countriesCities[country]} onChange={setCity} iconName="city" />
      <View style={styles.calendarContainer}>
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
            saveLabel="Save"
            label='Choose your vacation interval'
            presentationStyle='pageSheet'
          />
        </TouchableOpacity>
      </View>
      <NumericInput label='budget' onChange={setBudget}></NumericInput>
      <View style={styles.createButtonContainer}>
        <TouchableOpacity
          onPress={handleCreate}
          style={[styles.createButton, { backgroundColor: mainColor }]}
        >
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
});
