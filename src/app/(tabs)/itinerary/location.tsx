import React from 'react';
import { View, StyleSheet, Text} from 'react-native';
import LocationImgCarousel from './locationImgCarousel';
import { sampleLocationData } from '@/types';
import Entypo from '@expo/vector-icons/Entypo';

const Location: React.FC<sampleLocationData> = ({ title, description, address, images}) => {
    return(
        <View style={styles.container}>
            <LocationImgCarousel images={images}/>
             <View style={styles.textContainer}>
                
                {/* <FontAwesomeIcon name="location-pin" size={20} color="#2f95dc" /> */}
                <View style={styles.titleContainer}>
                <Entypo name='location-pin' size={28} color="#7975F8"/>
                <Text style={styles.title}> {title} </Text>
                </View>
                
                <Text style={styles.description}>{description}</Text>
                <Text style={styles.address}>{address}</Text>
            </View>
        </View>
    )
}

export default Location;

const styles = StyleSheet.create({
    container: {
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleContainer:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
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