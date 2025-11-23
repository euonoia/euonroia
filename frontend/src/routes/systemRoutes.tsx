import { Route } from "react-router-dom";
import MaintenanceMessage from "../components/messages/Maintenance";
import AddingFeature from "../components/messages/AddingFeature";
import PasteToBlocks from "../pages/paste-to-blocks";

export const SystemRoutes = (
  <>
    <Route path="/maintenance" element={<MaintenanceMessage />} />
    <Route path="/adding-feature" element={<AddingFeature />} />
    <Route path="/paste-to-blocks" element={<PasteToBlocks />} />
  </>
);
