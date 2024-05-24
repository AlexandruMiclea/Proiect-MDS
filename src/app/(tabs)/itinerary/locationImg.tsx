import React from 'react';
import {View, StyleSheet, Image, useWindowDimensions} from 'react-native';
import { LocationImageItem } from '@/types';

const LocationImg: React.FC<{ item: LocationImageItem }> = ({ item }) => {
    const { width } = useWindowDimensions();
    const marginHorizontal = 20; 
    const imgContainerWidth = width - 2 * marginHorizontal;
    return (
        <View style={[styles.container, { width}]}>
            <Image source = {{uri: item.imageUrl}}
                style={[styles.image, {width: imgContainerWidth, resizeMode:'contain'}]}/>
        </View>
    )
}
export default LocationImg;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        flex: 1,
        alignItems: 'center',
        justifyContent:'center',
    },
})