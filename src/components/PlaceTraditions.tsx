import { Text, StyleSheet, View, FlatList } from 'react-native';

const PlaceTraditions = ({ info }: { info: any[] }) => {
    
    const [traditions, traditionsDescription] = info;

    return (
        <View>
            <Text style={styles.title}>Traditions</Text>
            <View style={styles.line}></View>
            <Text style={styles.text}>
                {traditionsDescription}
            </Text>
            <Text style={styles.title2}>
                Typical traditions include:
            </Text>
            <FlatList
                data={traditions}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.item}>{item}</Text>
                    </View>
                )}
            />
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
    title2: {
        fontSize: 16,
        left: 24,
        marginTop: 16,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    line: {
        borderWidth: 1,
        marginHorizontal: 20,
        marginTop: 10,
        borderColor: 'gainsboro'
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 24,
        marginTop: 4,
    },
    bullet: {
        fontSize: 16,
        marginRight: 8,
    },
    item: {
        fontSize: 16,
    },
});

export default PlaceTraditions;
