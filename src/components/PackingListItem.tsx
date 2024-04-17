import React, {useState} from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { CheckBox } from 'react-native-elements';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';

interface PackingListItemProps {
    item: {
      id: string;
      text: string;
      checked: boolean;
    };
    deleteItem: (id: string) => void; 
    editItem: (id: string, editedText: string) => void;
    toggleChecked: (id: string) => void; 
  }

const PackingListItem: React.FC<PackingListItemProps> = ({
    item,
    deleteItem,
    editItem,
    toggleChecked,
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(item.text);
    
    const handleEdit = () => {
        editItem(item.id, editedText);
        setIsEditing(false);
    }
  return (
    <View style = {styles.container}>
      <CheckBox
        checked={item.checked}
        onPress={() => toggleChecked(item.id)}
      />
      {!isEditing ?
      <Text style={[styles.text, item.checked && styles.lineThrough]}>
        {item.text}
      </Text>
      : 
        <TextInput
        value={editedText}
        onChangeText={setEditedText}
        autoFocus
        />
      }
      <View style ={styles.buttonContainer}>
        {!isEditing ?
        <TouchableOpacity onPress={() => setIsEditing(true)} >
            <FontAwesomeIcon name="pen" size={15}  />
        </TouchableOpacity> 
        :
        <TouchableOpacity onPress={handleEdit}>
            <FontAwesomeIcon name="check" size={15} />
        </TouchableOpacity>
        }
        <TouchableOpacity onPress={() => deleteItem(item.id)}>
            <FontAwesomeIcon name="trash" size={15}/>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default PackingListItem;

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '90%',
        margin: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    text: {
        textDecorationLine: 'none',
        flexWrap: 'wrap',
        maxWidth: '70%',
    },
    lineThrough: {
        textDecorationLine: 'line-through', // Apply line-through style conditionally
        color: 'gray', // Additional styling for checked items (optional)
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: '80%',
    },
  });
  