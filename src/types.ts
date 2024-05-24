export type Place = {
    id: string;
    name: string;
    image: string;
    primaryLanguage: string;
    secondaryLanguage: string;
    climate: string;
    attractions: string[];
    attractionDescription: string;
    traditions: string[];
    traditionsDescription: string;
    price: string;
};
export type LocationImageItem = {
    imageUrl: string;
}
export type LocationProps = {
    title: string;
    description: string;
    address: string;
    images: LocationImageItem[];
}