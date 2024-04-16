const places = [
    {
        id: "1",
        name: "Paris",
        country: "France",
        image: require("../../assets/images/paris.png"),
        primaryLanguage: "French",
        secondaryLanguage: "English",
        climate: "Temperate",
        attractions: ["Landmarks", "Museums", "Art"],
        attractionDescription: "Paris is famous for iconic landmarks like the Eiffel Tower and Notre-Dame Cathedral, world-class museums such as the Louvre and Musée d'Orsay, and its vibrant art scene.",
        traditions: ["Café culture", "Wine and Cheese", "Fashion"],
        traditionsDescription: "Parisians enjoy leisurely café outings, take pride in their wine and cheese culture, and contribute significantly to the global fashion industry.",
        price: "$$$"
    },
    {
        id: "2",
        name: "Stockholm",
        country: "Sweden",
        image:  require("@assets/images/stockholm.png"),
        primaryLanguage: "Swedish",
        secondaryLanguage: "English",
        climate: "Temperate",
        attractions: ["Archipelago", "Museums", "Historic Sites"],
        attractionDescription: "Stockholm boasts a beautiful archipelago, intriguing museums like the Vasa Museum, and historic sites such as the Royal Palace and Gamla Stan.",
        traditions: ["Fika", "Midsummer Celebration", "Nobel Prize Ceremony"],
        traditionsDescription: "Swedes embrace the tradition of fika (coffee break), celebrate Midsummer with joyous festivities, and host the prestigious Nobel Prize Ceremony.",
        price: "$$"
    }
    
]

export default places;