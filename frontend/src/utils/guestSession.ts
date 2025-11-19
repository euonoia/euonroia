
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";


export const getGuestSessionId = (): string => {
  let guestSessionId = Cookies.get("guestSessionId");

  if (!guestSessionId) {
    guestSessionId = uuidv4();
    Cookies.set("guestSessionId", guestSessionId, { path: "/", expires: 7 });
  }

  return guestSessionId;
};
