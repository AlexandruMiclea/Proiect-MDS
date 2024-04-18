import { FlatList } from 'react-native';
import places from '@assets/data/places'; // schimba aici gen scoate -try
import ExploreListItem from '@components/ExploreListItem';

export default function ExploreScreen() {
  return (
      <FlatList
        data={places}
        renderItem={({item}) => 
          <ExploreListItem place={item}/>}
        contentContainerStyle={{gap: 10, padding: 10}} // spatiu intre randuri
      />
  );
}
