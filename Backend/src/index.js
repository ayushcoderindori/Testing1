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

// Start server immediately
httpServer.listen(port, () => {
  console.log(`⚙️ VideoVault Server running on http://localhost:${port}`);
  console.log(`🎯 API available at http://localhost:${port}/api/v1`);
  console.log(`🏥 Health check: http://localhost:${port}/api/v1/healthcheck`);
  console.log(`🔗 Frontend should connect to: http://localhost:5173`);
});

// Optional database connection
if (process.env.MONGODB_URI) {
  try {
    const { default: connectDB } = await import('./db/index.js');
    connectDB()
      .then(() => console.log("✅ MongoDB connected successfully"))
      .catch((err) => {
        console.log("⚠️ MongoDB connection failed:", err.message);
        console.log("🔧 Server running without database");
      });
  } catch (err) {
    console.log("📝 Database module not available - running without database");
  }
} else {
  console.log("📝 No MongoDB URI provided - running without database");
  console.log("💡 Add MONGODB_URI to .env to enable database features");
}
