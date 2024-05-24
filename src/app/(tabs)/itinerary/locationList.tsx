import React from 'react';
import { FlatList } from 'react-native';
import Location from './location'; 
import { sampleLocationData } from '@/types';

const LocationList: React.FC<{locations: sampleLocationData[]}> = ({ locations }) => {
  return (
    <FlatList
      data={locations}
      renderItem={({ item }) => <Location {...item} />}
      keyExtractor={(_, index) => index.toString()} 
    />
  );
}

export default LocationList;
