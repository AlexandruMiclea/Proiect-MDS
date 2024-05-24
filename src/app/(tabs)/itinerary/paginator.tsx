import React from 'react';
import {View, StyleSheet, Animated, useWindowDimensions} from 'react-native';
import { LocationImageItem } from '@/types';

const Paginator: React.FC<{ data: LocationImageItem[], scrollX:Animated.Value }> = ({data, scrollX}) => {
    const {width} = useWindowDimensions();
    return (
        <View style={styles.container}>
            {data.map((_, i) => {
                const inputRange = [(i-1) * width, i * width, (i+1) * width]; // [previous_dot, current_dot, next_dot]
                const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [10,20,10],
                    extrapolate:'clamp',
                })
                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp',
                })
                return <Animated.View style={[styles.dot, {width:dotWidth, opacity}]} key={i.toString()}/>
            })}
        </View>
    )
}
export default Paginator;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginTop: 5,
    },
    dot:{
        height:10,
        borderRadius:5,
        backgroundColor:"#000",
        marginHorizontal: 7,
    }
})