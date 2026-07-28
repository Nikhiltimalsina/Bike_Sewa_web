// Ambient declaration for plain, non-CSS-module stylesheets imported for
// their side effects only, e.g. `import "leaflet/dist/leaflet.css";`
// Next.js's built-in types (next/types/global.d.ts) only declare
// `*.module.css`, so plain `*.css` imports from node_modules packages
// (like leaflet) need this declaration or TypeScript reports:
// "Cannot find module or type declarations for side-effect import".
declare module "*.css";