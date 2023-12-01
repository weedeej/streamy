import { adminDb } from "@/firebaseConfig/firebase-admin";

export async function copyCollection(src: FirebaseFirestore.CollectionReference, destCollection: FirebaseFirestore.CollectionReference) {
  const documents = await src.get();
  let writeBatch = adminDb.batch();
  let i = 0;
  for (const doc of documents.docs) {
      writeBatch.set(destCollection.doc(doc.id), doc.data());
      i++;
      if (i > 400) {  // write batch only allows maximum 500 writes per batch
          i = 0;
          console.log('Intermediate committing of batch operation');
          await writeBatch.commit();
          writeBatch = adminDb.batch();
      }
  }
  if (i > 0) {
      console.log('Firebase batch operation completed. Doing final committing of batch operation.');
      await writeBatch.commit();
  } else {
      console.log('Firebase batch operation completed.');
  }
}