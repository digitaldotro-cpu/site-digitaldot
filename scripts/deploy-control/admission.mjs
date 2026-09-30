import { authorizePromotion } from "./protocol.mjs";
import { OperationStore } from "./journal.mjs";

/** Binding of validation to admission. It records intent, never performs deploy effects. */
export function admitPromotion({ transport, approval, observed, store, now = Date.now() }) {
  const plan = authorizePromotion(transport, approval, observed, now);
  if (!(store instanceof OperationStore)) throw new TypeError("A validated operation store is required.");
  return store.begin(plan);
}
