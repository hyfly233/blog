const secret = require('./secret')

const moment = require('moment')
moment.locale("zh-cn")

module.exports = {
    '@vuepress/pwa': {
        serviceWorker: true,
        updatePopup: {
            '/': {
                message: "New content is available.",
                buttonText: "Refresh"
            },
            '/zh/': {
                message: "侦测到在途核打击",
                buttonText: "确认"
            }
        }
    },
    '@vuepress/back-to-top': {},
    '@vuepress/last-updated': {
        transformer: (timestamp) => {
            return moment(timestamp).format("LLLL")
        }
    },
    '@vuepress/google-analytics': {
        'ga': secret.ga
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
