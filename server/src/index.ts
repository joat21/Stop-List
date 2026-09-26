import "dotenv/config";
import { createApp } from "./app";

const PORT = Number(process.env.PORT) || 8080;
const HOST = "0.0.0.0";

const server = createApp().listen(PORT, HOST, () => {
  console.log(`Server listening at http://${HOST}:${PORT}`);
});

server.on("error", (err) => {
  console.error("[Server] failed to start:", err);
  process.exit(1);
});
