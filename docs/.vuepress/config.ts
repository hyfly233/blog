import { head } from './config/head'
import { navConfig } from './config/navConfig'
import { defaultTheme } from 'vuepress'
import { searchPlugin } from '@vuepress/plugin-search'
import { backToTopPlugin } from '@vuepress/plugin-back-to-top'
import { prismjsPlugin } from '@vuepress/plugin-prismjs'

export default {
    base: '/blog/',
    title: 'とんぼの気持ち',
    head: head,
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
    ],
}