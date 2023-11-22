import { defaultTrackers, trackerSource } from "@/constants";
import { Torrent } from "@/types/Movie";
import axios from "axios";


export async function getTrackers() {
  let res = {trackers: defaultTrackers, default: true};
  try {
    const resp = (await axios.get<string>(trackerSource)).data;
    const trackerList = resp.split("\n\n");
    if (!trackerList[trackerList.length - 1]) trackerList.pop();
    res = {trackers: trackerList, default: false};
  } catch(e) {
    console.error(e)
  }
  finally {
    return res;
  }
}

export function createMagnetLink(hash: string, title: string, trackers: string[]) {
  const trackersStringified = trackers.map((tracker) => `tr=${tracker}`).join("&")
  return `magnet:?xt=urn:btih:${hash}&dn=${encodeURI(title)}&${trackersStringified}`
}