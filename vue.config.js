/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
    publicPath: process.env.APP_BASEPATH,
    devServer: {
        proxy: 'http://localhost:8080'
    }
}
