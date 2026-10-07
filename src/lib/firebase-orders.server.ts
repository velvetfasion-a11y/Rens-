import { firestore, isFirebaseConfigured } from "@/lib/firebase.server";

const COLLECTION = "orders";

export type FirestoreOrder = {
  id: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  address: string;
  postal: string;
  city: string;
  country: string;
  qty: number;
  method: string;
  goodsKr: number;
  deliveryKr: number;
  totalKr: number;
  shippedAt: string | null;
};

export async function syncOrderToFirestore(order: FirestoreOrder): Promise<void> {
  if (!isFirebaseConfigured()) return;
  await firestore()
    .collection(COLLECTION)
    .doc(order.id)
    .set(order, { merge: true });
}

export async function markFirestoreOrderShipped(id: string): Promise<void> {
  if (!isFirebaseConfigured()) return;
  await firestore().collection(COLLECTION).doc(id).set(
    { shippedAt: new Date().toISOString() },
    { merge: true },
  );
}
