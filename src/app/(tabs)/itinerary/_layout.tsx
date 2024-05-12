import React, { useState } from "react";
import DropdownComponent from "@/components/Dropdown";
import { View, StyleSheet, Pressable, Text } from "react-native";
import countriesNamesJson from '@assets/data/countriesNames.json';
import countriesCitiesJson from '@assets/data/countriesInfo.json';
import { DatePickerModal } from "react-native-paper-dates";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

const countriesNames = JSON.parse(JSON.stringify(countriesNamesJson));
const countriesCities = JSON.parse(JSON.stringify(countriesCitiesJson));

const NewItinerary = () => {

  const [country, setCountry] = useState<string>('');
  const [city, setCity] = useState<string | null>(null);
  const [range, setRange] = React.useState<{ startDate: CalendarDate, endDate: CalendarDate }>({ startDate: undefined, endDate: undefined });

  const [open, setOpen] = React.useState(false);

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

  const colorScheme = useColorScheme();
  const mainColor = Colors[colorScheme ?? 'light'].tint;

  return (
      <View style={styles.mainContainer}>
        <DropdownComponent label='country' labelField="name" valueField="name" dropdownData={countriesNames} onChange={setCountry} iconName="earth"></DropdownComponent>
        <DropdownComponent label='city' labelField="name" valueField="name" dropdownData={countriesCities[country]} onChange={setCity} iconName="city"></DropdownComponent>

        <View style={styles.calendarContainer}>
            <Text style={styles.intervalText}>Trip interval: {range.startDate?.toLocaleDateString()} - {range.endDate?.toLocaleDateString()}</Text>
            <Pressable onPress={() => setOpen(true)} style={[styles.button, {backgroundColor: mainColor}]}>
              <FontAwesome size={18} style={{ }} color="white" name="calendar-o"/>
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
            </Pressable>
        </View>
          
            
      </View>
      
)}

export default NewItinerary;


const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'center',
    margin: 8,
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
    padding: 10,
    height: 80,
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