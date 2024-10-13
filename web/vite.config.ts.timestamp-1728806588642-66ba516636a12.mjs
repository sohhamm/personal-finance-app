// vite.config.ts
import react from "file:///Users/nuclear/Desktop/code/personal-finance-app/web/node_modules/@vitejs/plugin-react-swc/index.mjs";
import checker from "file:///Users/nuclear/Desktop/code/personal-finance-app/web/node_modules/vite-plugin-checker/dist/esm/main.js";
import tsconfigPaths from "file:///Users/nuclear/Desktop/code/personal-finance-app/web/node_modules/vite-tsconfig-paths/dist/index.js";
import { TanStackRouterVite } from "file:///Users/nuclear/Desktop/code/personal-finance-app/web/node_modules/@tanstack/router-plugin/dist/esm/vite.js";
import { defineConfig } from "file:///Users/nuclear/Desktop/code/personal-finance-app/web/node_modules/vite/dist/node/index.js";
var vite_config_default = defineConfig({
  plugins: [
    TanStackRouterVite(),
    react(),
    tsconfigPaths(),
    checker({
      typescript: true
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbnVjbGVhci9EZXNrdG9wL2NvZGUvcGVyc29uYWwtZmluYW5jZS1hcHAvd2ViXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbnVjbGVhci9EZXNrdG9wL2NvZGUvcGVyc29uYWwtZmluYW5jZS1hcHAvd2ViL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9udWNsZWFyL0Rlc2t0b3AvY29kZS9wZXJzb25hbC1maW5hbmNlLWFwcC93ZWIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djJ1xuaW1wb3J0IGNoZWNrZXIgZnJvbSAndml0ZS1wbHVnaW4tY2hlY2tlcidcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gJ3ZpdGUtdHNjb25maWctcGF0aHMnXG5pbXBvcnQge1RhblN0YWNrUm91dGVyVml0ZX0gZnJvbSAnQHRhbnN0YWNrL3JvdXRlci1wbHVnaW4vdml0ZSdcbmltcG9ydCB7ZGVmaW5lQ29uZmlnfSBmcm9tICd2aXRlJ1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIFRhblN0YWNrUm91dGVyVml0ZSgpLFxuICAgIHJlYWN0KCksXG4gICAgdHNjb25maWdQYXRocygpLFxuICAgIGNoZWNrZXIoe1xuICAgICAgdHlwZXNjcmlwdDogdHJ1ZSxcbiAgICB9KSxcbiAgXSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQThVLE9BQU8sV0FBVztBQUNoVyxPQUFPLGFBQWE7QUFDcEIsT0FBTyxtQkFBbUI7QUFDMUIsU0FBUSwwQkFBeUI7QUFDakMsU0FBUSxvQkFBbUI7QUFHM0IsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsbUJBQW1CO0FBQUEsSUFDbkIsTUFBTTtBQUFBLElBQ04sY0FBYztBQUFBLElBQ2QsUUFBUTtBQUFBLE1BQ04sWUFBWTtBQUFBLElBQ2QsQ0FBQztBQUFBLEVBQ0g7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
