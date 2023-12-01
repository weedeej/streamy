import { NextApiRequest, NextApiResponse } from "next";
import {} from "firebase-admin";
import { adminAuth, adminDb } from "@/firebaseConfig/firebase-admin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {method, headers, body} = req;
  const {uid} = req.query as {uid: string};
  const {key, value} = body;

  if (!key || value === null || value === undefined) {
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
    await adminAuth.verifyIdToken(accessToken, true);
  } catch {
    res.status(401).send("Unauthorized");
    return;
  }

  const result = await adminDb.collection("users").doc(uid).update({[key]: value});
  return res.status(200).send(result);
}