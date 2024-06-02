import React, {useState, useRef} from 'react';
import { View, FlatList, StyleSheet, Animated, ViewToken  } from 'react-native';
import LocationImg from './locationImg';
import Paginator from './paginator';

const locationImgCarousel:React.FC<{images : [{imageUrl:string}?]}> = ({images}) => {
    const [currentIndex, setCurrentIndex] = useState(0); // keep track of the index of the currently visible slide
    const scrollX = useRef(new Animated.Value(0)).current; // keep track of the current scroll position of the FlatList
    const slidesRef = useRef(null);

    const viewableItemChanged = useRef(({ viewableItems } : { viewableItems: ViewToken<any>[] }) => {
        setCurrentIndex(viewableItems?.[0]?.index ?? 0);
    }).current;
    
    // the next slide needs to be at least 50% on the screen before it changes to it
    const viewConfig = useRef({viewAreaCoveragePercentThreshold:50}).current;
    return(
        <View style={styles.container}>
            <FlatList
                data = {images} 
                renderItem={({ item }) => <LocationImg item={item}/>}
                keyExtractor={(_, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator = {false}
                pagingEnabled // snapping to each item
                bounces={false} // disable bouncing effect at the edges
                onScroll={Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {
                    useNativeDriver: false,
                })} //track the scroll position and update scrollX
                scrollEventThrottle={32}
                onViewableItemsChanged={viewableItemChanged}
                viewabilityConfig={viewConfig}
                ref = {slidesRef}
            />  
            <Paginator data={images} scrollX={scrollX}/>

        </View>
    );
}

export default locationImgCarousel;

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})