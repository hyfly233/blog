const secret = require('./secret')

const moment = require('moment')
moment.locale("zh-cn")

module.exports = {
    '@vuepress/search': {
        searchMaxSuggestions: 10
    },
    '@vuepress/back-to-top': {},
    '@vuepress/last-updated': {
        transformer: (timestamp) => {
            return moment(timestamp).format("LLLL")
        }
    },
    '@vssue/vuepress-plugin-vssue': {
        platform: 'github-v4',

        // 其他的 Vssue 配置
        owner: 'hyfly233',
        repo: 'blog',
        clientId: secret.clientId,
        clientSecret: secret.clientSecret,
        autoCreateIssue: true
    }
}