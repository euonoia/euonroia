// src/utils/checkCookies.ts
export async function checkThirdPartyCookies(): Promise<boolean> {
  try {
    const res = await fetch("https://euonroia-secured.onrender.com/auth/me", {
      method: "GET",
      credentials: "include", // sends cookies
      mode: "cors",           // cross-origin
    });

    // If status is 200, cookies work
    if (res.status === 200) return true;

    // If 401 or other, cookies may be blocked or no login
    return false;
  } catch (err) {
    // Network errors or blocked cookies
    return false;
  }
}
