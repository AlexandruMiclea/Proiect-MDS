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
export type LocationListProps {
    locations: LocationProps[];
}
type AddressObj = {
    street1: string,
    street2?: string,
    city: string,
    state: string,
    country: string,
    psotalcode: string,
    address_string: string,
}

export type LocationObj = {
    location_id: string;
    name: string,
    distance: string,
    bearing: string,
    address_obj: AddressObj
}

export type TAGetResponse = {
    data: LocationObj[]
}

type ImageDataObj = {
    height: number,
    width: number,
    url: string
}

type ImageFmtObj = {
    thumbnail: ImageDataObj,
    small: ImageDataObj,
    medium: ImageDataObj,
    large: ImageDataObj,
    original: ImageDataObj
}

type ImageObj = {
    id: number,
    is_blessed: boolean,
    caption: string,
    published_date: string,
    images: ImageFmtObj
    album: string,
    source: {
        name: string,
        localized_name: string
    }
    user: {
        username: string
    }
}

export type PhotoGetResponse = {
    data: ImageObj[]
}

export type DetailsGetResponse = {

}

export type LocationQuery = {
    key: string,
    searchQuery: string,
    category: string,
    latLong: string,
    radius: number,
    radiusUnit: string
}

export type DetailsQuery = {
    key: string,
    language: string,
    currency: string,
}

export type PhotoQuery = {
    key: string,
    language: string,
    limit: number,
}

export type sampleLocationData = {
    title: string,
    description: string,
    address: string,
    images: [
        {
            imageUrl: string
        }?,
    ]
};