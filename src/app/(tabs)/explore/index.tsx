import { FlatList } from 'react-native';
import places from '@assets/data/places';
import ExploreListItem from '@components/ExploreListItem';

// The scrollable list from the ExploreScreen, if you press on one, you enter the ExploreListItem screen
export default function ExploreScreen() {
  return (
      <FlatList
        data={places}
        renderItem={({item}) => 
          <ExploreListItem place={item}/>}

        // Add spacing between rows
        contentContainerStyle={{gap: 10, padding: 10}}
      />
  );
}
