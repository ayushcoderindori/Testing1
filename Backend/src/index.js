import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { app } from "./app.js";
import { createServer } from "http";

const httpServer = createServer(app);
const port = process.env.PORT || 8000;

httpServer.listen(port, () => {
  console.log(`⚙️ Server running on http://localhost:${port}`);
  console.log(`🎯 API available at http://localhost:${port}/api/v1`);
  console.log(`🏥 Health check: http://localhost:${port}/api/v1/healthcheck`);
});

// Optional database connection
if (process.env.MONGODB_URI) {
  import('./db/index.js').then(({ default: connectDB }) => {
    connectDB().then(() => {
      console.log("✅ MongoDB connected");
    }).catch(err => {
      console.log("⚠️ Running without database");
    });
  });
} else {
  console.log("📝 No database configured");
}
