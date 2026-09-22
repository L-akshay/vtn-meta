import { buildDeepLink } from "./deepLink";
import { trackClickToStore, type StorePlacement } from "./analytics";
import { detectOS } from "./os";

export function navigateToStore(placement: StorePlacement) {
  const os = detectOS(window.navigator.userAgent);
  const destination = buildDeepLink(window.location.search);

  trackClickToStore(placement, os);
  window.location.assign(destination);
}
