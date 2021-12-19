import { config } from "dotenv";
import { getUserList } from "./studip/bridge";
config();

(async () => {
  console.log(await getUserList("Nico Finkernagel"));
})();
