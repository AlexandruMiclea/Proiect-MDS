import { Text, StyleSheet, View } from 'react-native';

// Define the component and its props
const PlaceGeneral = ({ info }: { info: string[] }) => {
    const [cityName, primaryLanguage, secondaryLanguage, climate, price] = info;

    let priceCategory: string = "";

    // Determine the price category based on the price value
    if (price === "$") {
        priceCategory = "offers a variety of affordable options, ensuring a pleasant stay for budget-conscious travelers.";
    } else if (price === "$$") {
        priceCategory = "offers a range of options to fit different budgets, ensuring a pleasant stay for everyone.";
    } else if (price === "$$$") {
        priceCategory = "offers a range of high-end options, ensuring a luxurious and comfortable stay for those seeking premium experiences.";
    }

    return (
        <View>
            <Text style={styles.title}>General</Text>
            <View style={styles.line}></View>
            <Text style={styles.text}>
                The natives of {cityName} speak {primaryLanguage.toLowerCase()}, followed by {secondaryLanguage.toLowerCase()} as a secondary language. The city
                enjoys a {climate.toLowerCase()} climate, making it a great place to visit year-round. As for prices, {cityName} {priceCategory}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        lineHeight: 24,
        marginHorizontal: 24,
        marginTop: 16,
    },
    title: {
        fontSize: 16,
        lineHeight: 24,
        left: 24,
        fontWeight: 'bold',
    },
    line: {
        borderWidth: 1,
        marginHorizontal: 20,
        marginTop: 10,
        borderColor: 'gainsboro'
    }
});

export default PlaceGeneral;
