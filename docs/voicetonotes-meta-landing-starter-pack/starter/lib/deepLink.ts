import { DEEP_LINK } from "./links";

export function buildDeepLink(search: string) {
  const destination = new URL(DEEP_LINK);
  const incoming = new URLSearchParams(search);

  incoming.forEach((value, key) => {
    destination.searchParams.set(key, value);
  });

  return destination.toString();
}
