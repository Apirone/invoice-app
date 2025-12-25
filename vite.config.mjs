import {defineConfig, loadEnv} from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import * as process from "process";


export default ({mode, command}) => {
    const env = loadEnv(mode, process.cwd());
    console.log(command)

    return defineConfig({
        base: env.VITE_PUBLIC_PATH,
        plugins: [
            vue(),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
        },
        build: {
            rollupOptions: {
                output: {
                    entryFileNames: 'script.min.js',
                    assetFileNames: 'style.min.css',
                }
            },
            cssCodeSplit: true
        },
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern'
                }
            }
        }
    });
};

