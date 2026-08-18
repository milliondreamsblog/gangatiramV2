import { defineConfig, type Plugin } from "vitest/config";
import path from "node:path";

// Vite's default asset handling resolves static image imports (e.g.
// `import x from "@/public/foo.svg"`) to a plain URL string. Next.js's
// webpack build instead produces a `StaticImageData` object
// (`{ src, width, height }`), which `next/image` requires in order to render
// without explicit `width`/`height` props. This plugin mimics that shape
// under Vitest so components using `next/image` with static imports (e.g.
// `components/sections/Footer.tsx`) can render in tests. `blurDataURL` is
// included because Next's loader supplies one for static imports, and
// `next/image` requires it whenever a component sets `placeholder="blur"`
// (e.g. the parallax hero background in `components/sections/PageHero.tsx`).
const BLUR_DATA_URL =
  "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
function staticImageDataPlugin(): Plugin {
  return {
    name: "static-image-data-mock",
    enforce: "pre",
    load(id) {
      if (/\.(png|jpe?g|gif|svg|webp|avif)(\?.*)?$/.test(id)) {
        const publicPath = id.split("/public/")[1];
        const src = publicPath ? `/${publicPath}` : id;
        return `export default ${JSON.stringify({ src, width: 1, height: 1, blurDataURL: BLUR_DATA_URL })};`;
      }
    },
  };
}

export default defineConfig({
  plugins: [staticImageDataPlugin()],
  resolve: { alias: { "@": path.resolve(__dirname) } },
  test: { environment: "node", globals: true, include: ["**/*.test.ts", "**/*.test.tsx"] },
});
