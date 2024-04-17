import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Text } from '@/components/Themed';
import PackingListItem from '@/components/PackingListItem';

interface Item {
  id: string;
  text: string;
  checked: boolean;
}

const PackingListLayout = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [text, setText] = useState('');

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a new packing list for your next trip!</Text>
      <TextInput
        style={styles.input}
        onChangeText={setText}
        value={text}
        placeholder="Add an item"
        onSubmitEditing={addItem}
      />
      <View style={styles.itemsContainer}>
        {items.map((item) => (
          <PackingListItem
            key={item.id}
            item={item}
            deleteItem={deleteItem}
            editItem={editItem}
            toggleChecked={toggleChecked}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    color: 'black',
    padding: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    borderRadius: 50,
    height: 50,
    width: '90%',
    borderColor: 'lightgray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  itemsContainer: {
    width: '90%',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

export default PackingListLayout;
