import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { DatePickerModal } from "react-native-paper-dates";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";

const Calendar = () => {

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
    
        <Pressable onPress={() => setOpen(true)} style={styles.button}>
        <Text>Pick range</Text>
          <DatePickerModal
          locale="en"
          mode="range"
          visible={open}
          onDismiss={onDismiss}
          startDate={range.startDate}
          inputEnabled={false}
          endDate={range.endDate}
          onConfirm={onConfirm}
          startYear={2023}
          endYear={2025}
          saveLabel="Save"
          label='Choose your vacation interval'
          presentationStyle='pageSheet'
          />
        </Pressable>

)}

export default Calendar;

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