import React from "react";
import DropdownComponent from "@/components/Dropdown";
import { View, StyleSheet, Pressable } from "react-native";
import { Button } from 'react-native-paper';
import { DatePickerModal } from "react-native-paper-dates";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";


const NewItinerary = () => {

  const [range, setRange] = React.useState<{ startDate: Date | undefined, endDate: Date | undefined }>({ startDate: undefined, endDate: undefined });

  const [open, setOpen] = React.useState(false);

  const onDismiss = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = React.useCallback(
    ({ startDate, endDate }: { startDate: CalendarDate, endDate: CalendarDate }) => {
      setOpen(false);
      setRange({ startDate: startDate, endDate: endDate });
    },
    [setOpen, setRange]
  );

  return (
      <View>
        <DropdownComponent></DropdownComponent>
        <DropdownComponent></DropdownComponent>
          <Pressable onPress={() => setOpen(true)} style={{justifyContent: 'center', flex: 1, alignItems: 'center', marginTop: 300}}>
            <Button style={styles.button} onPress={() => setOpen(true)} uppercase={false} mode="outlined">
              Pick range
            </Button>
            <DatePickerModal
              disableStatusBarPadding
              locale="en"
              mode="range"
              visible={open}
              onDismiss={onDismiss}
              startDate={range.startDate}
              endDate={range.endDate}
              onConfirm={onConfirm}
              startYear={2023}
              endYear={2024}
            />
        </Pressable>
      </View>
      
)}

export default NewItinerary;


const styles = StyleSheet.create({
  button: {
    backgroundColor: 'gray',
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
})