import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;
  const isProd = process.env.NODE_ENV === "production";

  // Optional server-side health checks
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", env: process.env.NODE_ENV });
  });

  if (!isProd) {
    // Development Mode: Mount Vite dev server middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Started Express development server with Vite middleware.");
  } else {
    // Production Mode: Hostinger / Node.js container hosting
    const distPath = path.join(process.cwd(), "dist");

    // 1. Serve static assets like js, css, images directly
    app.use("/assets", express.static(path.join(distPath, "assets")));
    app.use(express.static(distPath, { index: false })); // Serve other root-level assets but do not serve default index.html automatically

    // 2. Custom routing: Serve pre-rendered page if exists, otherwise fallback to SPA shell
    app.get("*all", (req, res) => {
      const reqPath = req.path;
      
      // Clean up path to find corresponding pre-rendered index.html
      const cleanPath = reqPath.replace(/\/+$/, ""); // Remove trailing slashes
      
      let filePath = "";
      if (cleanPath === "" || cleanPath === "/") {
        filePath = path.join(distPath, "index.html");
      } else {
        filePath = path.join(distPath, cleanPath, "index.html");
      }

      if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
      } else {
        // Fallback to primary SPA index.html for clients to handle routing dynamically
        res.sendFile(path.join(distPath, "index.html"));
      }
    });

    console.log("Started Express production server with pre-render routing.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
