// this is the place where we make the API calls to TripAdvisor
import { LocationQuery, DetailsQuery, PhotoQuery, TAGetResponse, PhotoGetResponse, DetailsGetResponse} from "@/types";

// get locations around a city that we selected in the newItinerary page
// this method receives the parameters necessary for the API call as a LocationQuery type
// see types.tsx for details on how a LocationQuery should look like
export async function getAttractions({reqParams} : {reqParams : LocationQuery}): Promise<TAGetResponse>{
    const queryParams = new URLSearchParams();

    Object.entries(reqParams).forEach(([key, value]) => {
        queryParams.append(key, String(value));
    });
    
    const options = {method: 'GET', headers: {accept: 'application/json', Referer: 'http://ma.duc.stramb'}};
    const ans = await fetch(`https://api.content.tripadvisor.com/api/v1/location/search?` + queryParams.toString(), options)
    .then(res => res.json())
    .then(res => {return res as TAGetResponse})
    .catch(err => console.error(err));
    
    return ans;
}

// get photos of a location that we selected in the newItinerary page
// this method receives the parameters necessary for the API call as a PhotoQuery type
// see types.tsx for details on how a PhotoQuery should look like
// we also pass locationId as a standalone parameter because we need to parse it differently in the api call link
export async function getPhotos({locationId, reqParams} : {locationId: string, reqParams : PhotoQuery}) : Promise<PhotoGetResponse>{
    const queryParams = new URLSearchParams();

    Object.entries(reqParams).forEach(([key, value]) => {
        queryParams.append(key, String(value));
    });
    
    const options = {method: 'GET', headers: {accept: 'application/json', Referer: 'http://ma.duc.stramb'}};
    const ans = fetch('https://api.content.tripadvisor.com/api/v1/location/' + locationId + '/photos?' + queryParams.toString(), options)
    .then(response => response.json())
    .then(response => {return response as PhotoGetResponse})
    .catch(err => console.error(err));

    return ans;
}

// get details about a location that we selected in the newItinerary page
// this method receives the parameters necessary for the API call as a DetailsQuery type
// see types.tsx for details on how a DetailsQuery should look like
// we also pass locationId as a standalone parameter because we need to parse it differently in the api call link
export async function getDescription({locationId, reqParams} : {locationId: string, reqParams : DetailsQuery}): Promise<DetailsGetResponse> {
    const queryParams = new URLSearchParams();

    Object.entries(reqParams).forEach(([key, value]) => {
        queryParams.append(key, String(value));
    });
    
    const options = {method: 'GET', headers: {accept: 'application/json', Referer: 'http://ma.duc.stramb'}};

    const ans = fetch('https://api.content.tripadvisor.com/api/v1/location/' + locationId + '/details?' + queryParams.toString(), options)
    .then(response => response.json())
    .then(response => {return response as DetailsGetResponse})
    .catch(err => console.error(err));

    return ans;
}