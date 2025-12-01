import { Route } from "react-router-dom";
import Playground from "../games/playground"
import Games from "../games/spell_to_kill/QuizBattle"

export const GamesRoutes = (
<>
    <Route path="/playground" element={<Playground />} />
    <Route path="/games/spell_to_kill" element={<Games />} />
</>
)
