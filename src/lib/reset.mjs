import fs from "node:fs";

fs.writeFileSync("src/lib/allocations.json", JSON.stringify({}));
fs.writeFileSync("src/lib/state.json", JSON.stringify({}));
fs.writeFileSync("src/lib/players.json", JSON.stringify({}));
