import React from 'react';
import { View, StyleSheet, Text} from 'react-native';
import LocationImgList from './locationImgList';
import { sampleLocationData } from '@/types';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const Location: React.FC<sampleLocationData> = ({ title, description, address, images}) => {
    console.log("desc" + description);
    console.log("title" + title);
    console.log("addr" + address);
    console.log("images" + images)
    return(
        <View style={styles.container}>
            <LocationImgList images={images}/>
             <View style={styles.textContainer}>
                <Text style={styles.title}> 
                {/* <FontAwesome name={"location-dot" as string} size={20} color={"#2f95dc"} /> */}

                    {title}
                </Text>
                <Text style={styles.description}>{description}</Text>
                <Text style={styles.address}>{address}</Text>
            </View>
        </View>
    )
}

export default Location;

const styles = StyleSheet.create({
    container: {
        height: 280,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontWeight:'700',
        fontSize: 20,
        marginVertical: 10,
    },
    description: {
        fontWeight:'300',
        color: '#62656b',
    },
    address: {
        fontSize: 14,
        marginBottom: 20,
    }
})