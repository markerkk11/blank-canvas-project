import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";

// Immediately fix HTML paths when this config is loaded
(function fixHtmlPaths() {
  const publicDir = path.resolve(__dirname, 'public');
  
  function findHtmlFiles(dir: string, files: string[] = []): string[] {
    if (!fs.existsSync(dir)) return files;
    
    const items = fs.readdirSync(dir);
    const skipDirs = ['wp-content', 'wp-includes', 'wp-json', 'wp-admin', 'assets', 'node_modules'];
    
    for (const item of items) {
      if (skipDirs.includes(item)) continue;
      
      const fullPath = path.join(dir, item);
      try {
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          findHtmlFiles(fullPath, files);
        } else if (item.endsWith('.html')) {
          files.push(fullPath);
        }
      } catch (e) {
        // Skip inaccessible files
      }
    }
    
    return files;
  }
  
  try {
    const htmlFiles = findHtmlFiles(publicDir);
    let fixedCount = 0;
    
    for (const file of htmlFiles) {
      try {
        let content = fs.readFileSync(file, 'utf8');
        const original = content;
        
        // Replace assets/laxapellets_se/ with empty string
        content = content.replace(/assets\/laxapellets_se\//g, '');
        
        if (content !== original) {
          fs.writeFileSync(file, content, 'utf8');
          fixedCount++;
        }
      } catch (e) {
        // Skip files that can't be read
      }
    }
    
    if (fixedCount > 0) {
      console.log(`[vite.config] Fixed ${fixedCount} HTML files (removed assets/laxapellets_se/)`);
    }
  } catch (e) {
    console.log('[vite.config] Could not fix HTML paths:', e);
  }
})();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(), 
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
