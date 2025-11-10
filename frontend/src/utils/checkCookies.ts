// src/utils/checkCookies.ts
export async function checkThirdPartyCookies(): Promise<boolean> {
  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.src = "https://euonroia-secured.onrender.com/auth/me";
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    setTimeout(() => {
      try {
        resolve(true); // cookies probably allowed
      } catch {
        resolve(false); // blocked
      } finally {
        document.body.removeChild(iframe);
      }
    }, 1000);
  });
}
