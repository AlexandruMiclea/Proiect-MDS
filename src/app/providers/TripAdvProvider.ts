import { LocationQuery, DetailsQuery, PhotoQuery, TAGetResponse, PhotoGetResponse, DetailsGetResponse} from "@/types";

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