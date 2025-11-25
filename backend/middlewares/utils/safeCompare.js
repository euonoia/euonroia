import crypto from "crypto";

export const safeCompare = (a, b) => {
  const aBuffer = Buffer.from(String(a));
  const bBuffer = Buffer.from(String(b));

  // Prevent leaking info through timing side-channels
  return (
    aBuffer.length === bBuffer.length &&
    crypto.timingSafeEqual(aBuffer, bBuffer)
  );
};
