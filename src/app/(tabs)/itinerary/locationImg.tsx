import React from 'react';
import {View, StyleSheet, Image, useWindowDimensions} from 'react-native';

const LocationImg: React.FC<{ item: { imageUrl: string; } | undefined }> = ({ item }) => {
    const { width } = useWindowDimensions();
    const marginHorizontal = 20; 
    const imgContainerWidth = width - 2 * marginHorizontal;
    if(item){
        return (
            <View style={[styles.container, { width}]}>
                <Image source = {{uri: item.imageUrl}}
                    style={[styles.image, {width: imgContainerWidth, resizeMode:'cover'}]}/>
            </View>
        )
    }
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