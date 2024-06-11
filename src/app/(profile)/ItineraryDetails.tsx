import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Itinerary } from '@/types';
import { supabase } from '@/lib/supabase';
import LocationList from '../(tabs)/itinerary/locationList';
import PackingList from '@/components/PackingList';
import { sampleLocationData } from '@/types';


const ItineraryDetails = () => {
  const { id, city, country, budget, start_date, final_date } = useLocalSearchParams<Itinerary>();
  const buttons : string[] = ["Attractions", "Packing list"]; //"Tickets"
  const [selectedButton, setSelectedButton] = useState<string>('Attractions');
  const [locations, setLocations] = useState<sampleLocationData[]>();
  
  useEffect(() => {
    const fetchItineraries = async () => {
        try{
            console.log("Fetching locations for itinerary ID:", id); 
            const {data, error} = await supabase
                                        .from('locations')
                                        .select("*")
                                        .eq('id_itinerar', id);
            if (error){
                throw error;
            }
             // Transform data from database to match type of sampleLocationData in frontend
             const transformedData = data.map((location: any) => {
                var urls: [{imageUrl: string}?] = [];
                for (const key in location) {
                    if (Object.prototype.hasOwnProperty.call(location, key) && key.startsWith("photo")) {
                        const value = location[key];
                        if (value) {
                            urls.push({ imageUrl: value });
                        }
                    }
                }
            
                return {
                    title: location.title,
                    description: location.description,
                    address: location.address,
                    images: urls
                };
            });
            
            setLocations(transformedData);
        }
        catch(error:any){
            console.error("Error fetching locations: ", error.message);
        }
    }
    fetchItineraries()
  },[])
  return (
    <View style={{flex:1}}>
    <View style={styles.buttons}>
          {buttons.map(button => 
            <Pressable
              onPress={() => { setSelectedButton(button) }} 
              style={[
                styles.button, 
                {
                  backgroundColor: selectedButton === button ? 'white' : '#7975F8'
                  
                }
              ]} 
              key={button}
            >
              <Text 
                style={[
                  styles.buttonText, 
                  {
                    color: selectedButton === button ? '#7975F8' : 'white',
                    fontWeight: selectedButton === button ? '700' : '500',
                  }
                  ]}
              >
                {button}
              </Text>
            </Pressable>
          )}
        </View>
    <View style={{ flex: 1, marginTop: 10, width: '100%', marginHorizontal: 5 }}>
    {selectedButton === "Attractions" && locations && <LocationList locations={locations}/>}
    {selectedButton === "Packing list" && <PackingList/>}
    {/* {selectedButton === "Tickets" && <Tickets/>} */}
    </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: "center"
  },

  button: {
    width: '24%',
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 14,
    marginTop: '8%',
    borderRadius: 8,
    borderColor: '#7975F8',
    borderWidth: 1,
  },

  buttonText: {
    fontSize: 15,
  },
});

export default ItineraryDetails;
