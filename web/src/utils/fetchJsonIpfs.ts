/**
 *
 * @param uri complete uri to fetch the data from
 * @returns parsed json data
 * @requires the function is specifically for json content
 */
const fetchJsonIpfs = async (uri: string) => {
  try {
    const response = await fetch(uri, { method: "GET", headers: { "Content-Type": "application/json" } });

    if (!response.ok) {
      throw Error(`HTTP ERROR: Failed to fetch from the uri : ${uri}`);
    }

    const result = await response.json();

    return result;
  } catch (err: any) {
    console.log("fetchJsonIpfs:", { err });

    return null;
  }
};

export default fetchJsonIpfs;
