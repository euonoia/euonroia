import React from "react";
import { Route } from "react-router-dom";
import PoliciesPage from "../policies/PoliciesPage";
import PrivacyPolicy from "../policies/privacy/PrivacyPolicy";
import TermsOfService from "../policies/terms/TermsOfService";
import CookiePolicy from "../policies/cookies/CookiePolicy";

export const PolicyRoutes = (
  <>
    <Route path="/policies" element={<PoliciesPage />}>
      <Route path="privacy" element={<PrivacyPolicy />} />
      <Route path="terms" element={<TermsOfService />} />
      <Route path="cookies" element={<CookiePolicy />} />
      {/* Optional default redirect */}
      <Route index element={<PrivacyPolicy />} />
    </Route>
  </>
);
