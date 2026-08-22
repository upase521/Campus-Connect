import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Runs on a different port than campusconnect-jsx (which
    // defaults to 5173) so both apps can run side by side.
    port: 5174,
  },
});
