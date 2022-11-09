import formatAddress from "../../../helpers/formatAddress";
import { GOOGLE_MAPS_API_PLACEID_URL } from "../../../library/googleMapsAPIUrls";

async function getPlaceIdHook(address) {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const url = GOOGLE_MAPS_API_PLACEID_URL;
  const fields = "formatted_address,place_id,geometry";
  const formattedAddress = formatAddress(address);
  let cors = "";
  if (process.env.REACT_APP_ENVIRONMENT === "local")
    cors = `http://localhost:8080/`;

  const fullUrl = `${cors}${url}?fields=${fields}&input=${formattedAddress}&inputtype=textquery&key=${apiKey}`;

  try {
    const res = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "access-control-allow-origin": "*",
      },
    });

    if (!res.ok) {
      const resBody = await res.json();
      const errMsg = resBody.error.message;
      throw new Error(errMsg);
    }

    const resBody = await res.json();

    if (resBody.candidates[0]) {
      const placeId = `place_id:${resBody.candidates[0].place_id}`;
      const latLng = `${resBody.candidates[0].geometry.location.lat}%2C${resBody.candidates[0].geometry.location.lng}`;
      return { placeId, latLng };
    }
    return false;
  } catch (err) {
    alert(err);
    throw Error(err);
  }
}

export default getPlaceIdHook;
