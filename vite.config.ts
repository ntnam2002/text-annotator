import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), dts({ tsconfigPath: "./tsconfig.app.json" })],
    build: {
        lib: {
            entry: "src/components/Annotator/index.tsx",
            name: "annotator",
            fileName: (format) => `annotator.${format}.js`,
            formats: ["es", "cjs"],
        },
        rollupOptions: {
            external: ["react", "react-dom"],
            output: {
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                },
            },
        },
    },
});
