import { GOOGLE_MAPS_API_DIRECTIONS_URL } from "../../../library/googleMapsAPIUrls";

async function getDistanceHook(origin, destination) {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const url = GOOGLE_MAPS_API_DIRECTIONS_URL;
  let cors = "";
  if (process.env.REACT_APP_ENVIRONMENT === "local")
    cors = `http://localhost:8080/`;

  // console.log(origin, destination);

  const fullUrl = `${cors}${url}?origin=${origin}&destination=${destination}&key=${apiKey}`;

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
    if (resBody?.routes[0]?.legs[0])
      return resBody.routes[0].legs[0].duration.text;
    return false;
  } catch (err) {
    alert(err);
    throw Error(err);
  }
}

export default getDistanceHook;
