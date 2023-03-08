import { head } from './config/head'
import { navConfig } from './config/navConfig'
import { defaultTheme } from 'vuepress'
import { searchPlugin } from '@vuepress/plugin-search'
import { backToTopPlugin } from '@vuepress/plugin-back-to-top'
import { prismjsPlugin } from '@vuepress/plugin-prismjs'

export default {
    base: '/blog/',
    title: '尘世闲游',
    description: '河边共指星为客  花里空瞻月是卿',
    head: head,
    theme: defaultTheme({
        logo: '/assets/img/favicon.ico',
        sidebar: 'auto',
        contributors: true,
        contributorsText: '贡献者列表',
        lastUpdated: true,
        lastUpdatedText: "最后更新时间",
        navbar: navConfig,
    }),
    plugins: [
        searchPlugin({
            maxSuggestions: 10
        }),
        backToTopPlugin(),
        prismjsPlugin({
            preloadLanguages: ['markdown', 'jsdoc', 'yaml']
        }),
    ],
}