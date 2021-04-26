import { Client, GeocodeRequest } from "@googlemaps/google-maps-services-js";
import { AddressComponents } from "./Models";
import { extractToken, verifyRequests } from "./requestValidation";

const apiKey: string | undefined = process.env.GOOGLE_API_KEY;
const coordinateCache: any = {};

const buildAddressString = (addressComponents: AddressComponents): string => {
  const { address, city, country, postalCode, region } = addressComponents;

  const addressString = address ? `${address},` : "";
  const cityString = city ? `${city},` : "";
  const postalString = postalCode ? `${postalCode},` : "";
  const regionString = region ? `${region},` : "";
  const countryString = country ? `${country}` : "";

  return `${addressString}${cityString}${regionString}${postalString}${countryString}`;
};

const createGeocodeRequest = (data: AddressComponents): GeocodeRequest => {
  if (!data) throw new Error("No body was sent in request");

  const address = buildAddressString(data);

  return {
    params: {
      address,
      key: apiKey!,
    },
  };
};

const getCoordinates = async (req: any, res: any) => {
  try {
    const idToken = extractToken(req);
    await verifyRequests(idToken);
    const client = new Client({});
    const address: AddressComponents = {
      address: req.address,
      city: req.city,
      country: req.country,
      postalCode: req.postal_code,
      region: req.region,
    };
    const geocodeRequest = createGeocodeRequest(address);
    const cacheCoordinates = coordinateCache[geocodeRequest.data.address];

    if (cacheCoordinates) return res.json({ coordinates: cacheCoordinates });

    const geocodeResponse = await client.geocode(geocodeRequest);

    if (geocodeResponse.status !== 200) {
      console.error(new Error(geocodeResponse.data.error_message));
      return res
        .status(500)
        .json({ error: geocodeResponse.data.error_message });
    }

    const coordinates = geocodeResponse.data.results[0].geometry.location;
    coordinateCache[geocodeRequest.data.address] = coordinates;

    return res.status(200).json({ coordinates });
  } catch (error) {
    console.error(error);
    return res.json({ error: error.message });
  }
};

export default getCoordinates;
