import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Dinamik router yükleme fonksiyonu
async function loadRouters(basePath, parentPath = "") {
  const files = fs.readdirSync(basePath);

  for (const fileOrDir of files) {
    const fullPath = path.join(basePath, fileOrDir);
    const routePath = parentPath ? `${parentPath}/${fileOrDir}` : `/${fileOrDir}`;

    if (fs.statSync(fullPath).isDirectory()) {
      // Eğer bir klasörse, içerideki dosyaları kontrol et
      await loadRouters(fullPath, routePath);
    } else if (fileOrDir === "router.js") {
      // Eğer `router.js` dosyasını bulursak
      const route = await import(pathToFileURL(fullPath).href); // Dinamik import
      const routeName = parentPath || "/";
      router.use(routeName, route.default || route); // Default export'u kullan
    }
  }
}

// src/app içindeki tüm routerları yükle
const appPath = path.join(__dirname, "../app");
await loadRouters(appPath);

export default router;
