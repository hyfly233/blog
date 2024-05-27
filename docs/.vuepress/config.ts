import {head} from './config/head'
import {navConfig} from './config/navConfig'
import {viteBundler} from '@vuepress/bundler-vite'
import {defaultTheme} from '@vuepress/theme-default'
import {defineUserConfig} from 'vuepress'
import {searchPlugin} from '@vuepress/plugin-search'
import {backToTopPlugin} from '@vuepress/plugin-back-to-top'
import {prismjsPlugin} from '@vuepress/plugin-prismjs'
import {googleAnalyticsPlugin} from "@vuepress/plugin-google-analytics";

export default defineUserConfig({
    base: '/blog/',
    title: 'とんぼの気持ち',
//    head: head,
    bundler: viteBundler(),
    theme: defaultTheme({
        logo: '/assets/img/game.ico',
        sidebar: 'auto',
        contributors: true,
        contributorsText: '贡献者列表',
        lastUpdated: true,
        lastUpdatedText: "最后更新时间",
        navbar: navConfig,
        repo: 'hyfly233/blog',
    }),
    plugins: [
        searchPlugin({
            maxSuggestions: 10
        }),
        backToTopPlugin(),
        prismjsPlugin({
            preloadLanguages: ['markdown', 'jsdoc', 'yaml']
        }),
        googleAnalyticsPlugin({
            "id": "G-7XQX2KF44C"
        })
    ],
})