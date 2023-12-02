import { NextApiRequest, NextApiResponse } from "next";
import { } from "firebase-admin";
import { adminAuth, adminDb } from "@/firebaseConfig/firebase-admin";
import { Movie, StreamyUser } from "@/types";
import { copyCollection } from "@/utils/copyCollection";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, headers, body } = req;
  const { uid } = req.query as { uid: string };
  const { isPublic } = body;

  if (isPublic === null || isPublic === undefined) {
    res.status(400).send("Bad request: Unknown body");
    return;
  }

  if (!headers.authorization) {
    res.status(403).send("403 forbidden");
    return;
  }

  if (method !== "POST") {
    res.status(405).send("Incorrect HTTP Method");
    return;
  }

  const accessToken = headers.authorization.split("Bearer ")[1] as string | undefined;

  if (!accessToken) {
    res.status(400).send("Bad request: Unknown access");
    return;
  }

  try {
    const result = await adminAuth.verifyIdToken(accessToken, true);
    if (result.uid !== uid) throw ("Unauthorized");
  } catch {
    res.status(401).send("Unauthorized");
    return;
  }
  
  const userRef = adminDb.collection("users").doc(uid);
  const { watchListId, watchListCount, name } = (await userRef.get()).data() as StreamyUser;
  const userPublicWatchListRef = adminDb.collection("publicWatchlist").doc(watchListId);

  if (!isPublic) {
    const result = await userPublicWatchListRef.delete();
    return res.status(200).send(result);
  }

  await userPublicWatchListRef.create({owner: uid, count: watchListCount, ownerName: name});
  const watchListRef = userRef.collection("watchList");
  await copyCollection(watchListRef, userPublicWatchListRef.collection("watchList"))
  return res.status(200).send({success: true});
}