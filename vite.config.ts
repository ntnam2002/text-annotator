import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        dts({ tsconfigPath: "./tsconfig.app.json" }),
        cssInjectedByJsPlugin(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        lib: {
            entry: "src/Annotator/main.ts",
            name: "annotator",
            fileName: (format) => `annotator.${format}.js`,
            formats: ["es", "cjs"],
        },
        rollupOptions: {
            external: ["react", "react-dom"],
            output: [
                {
                    format: "es",
                    exports: "named",
                    globals: {
                        react: "React",
                        "react-dom": "ReactDOM",
                    },
                },
                {
                    format: "cjs",
                    exports: "named",
                    globals: {
                        react: "React",
                        "react-dom": "ReactDOM",
                    },
                },
            ],
        },
    },
});
