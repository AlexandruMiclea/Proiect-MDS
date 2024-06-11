import React, {useState, useEffect} from 'react';
import { supabase } from '@/lib/supabase';
import {Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import { useRouter} from "expo-router";
import { Itinerary } from '@/types';
import { useAuth } from "@/app/providers/AuthProvider";

const ItineraryHistory = () => {
    const [itineraries, setItineraries] = useState<Itinerary[] | undefined>();
    const { session } = useAuth();
    useEffect(() => {
        const fetchItineraries = async () => {
            try{
                const userId = session?.user.id;
                const {data, error} = await supabase
                                            .from('itineraries')
                                            .select("*")
                                            .eq('profile_id', userId);
                if (error){
                    throw error;
                }
                setItineraries(data);
            }
            catch(error:any){
                console.error("Error fetching itineraries: ", error.message);
            }
        }
        fetchItineraries()
    },[])

    const router = useRouter();
    const handlePress = (itinerary: Itinerary) => {
        router.push({
            pathname: "./ItineraryDetails",
            params:{
                id: itinerary.id,
                city: itinerary.city,
                country: itinerary.country,
                budget: itinerary.budget,
                start_date: itinerary.start_date,
                final_date: itinerary.final_date,
            }
        });
    }

return (
    <FlatList
      data={itineraries}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handlePress(item)} style={styles.card}>
          <Text style={styles.cardText}>{item.city}, {item.country}</Text>
          <Text style={styles.cardText}>{item.start_date} - {item.final_date}</Text>
          <Text style={styles.cardText}>Budget: {item.budget}€</Text>
        </TouchableOpacity>
      )}
    />
)
}
export default ItineraryHistory;

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        padding: 16,
        marginHorizontal: 20,
        marginVertical: 10

      },
      cardText: {
        fontSize: 16,
        marginBottom: 8,
      },
});