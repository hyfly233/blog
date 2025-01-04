import {backToTopPlugin} from "@vuepress/plugin-back-to-top";
import {copyCodePlugin} from "@vuepress/plugin-copy-code";
import {defaultTheme} from "@vuepress/theme-default";
import {defineUserConfig} from "vuepress";
import {navConfig} from "./config/navConfig";
import {prismjsPlugin} from "@vuepress/plugin-prismjs";
import {searchPlugin} from "@vuepress/plugin-search";
import {shikiPlugin} from "@vuepress/plugin-shiki";
import {viteBundler} from "@vuepress/bundler-vite";

export default defineUserConfig({
    base: "/blog/",
    title: "とんぼの気持ち",
    bundler: viteBundler(),
    theme: defaultTheme({
        logo: "/assets/img/game.ico",
        sidebar: "heading",
        contributors: true,
        contributorsText: "贡献者",
        lastUpdated: true,
        lastUpdatedText: "最后更新时间",
        navbar: navConfig,
        repo: "hyfly233/blog",
    }),
    plugins: [
        searchPlugin({
            maxSuggestions: 10,
        }),
        backToTopPlugin(),
        copyCodePlugin({
            duration: 2000,
        }),
        prismjsPlugin({
            preloadLanguages: ["markdown", "jsdoc", "yaml"],
            notationDiff: true, // 是否启用差异标记 https://ecosystem.vuejs.press/zh/plugins/markdown/prismjs.html#collapsedlines
        }),
        shikiPlugin({
            // 配置项
            langs: ["ts", "json", "vue", "md", "bash", "diff", "java", "javascript", "python", "shell", "yaml", "sql", "go", "xml", "hcl", "terraform", "c", "lua", "nginx", "ini"],
        }),
    ],
});
