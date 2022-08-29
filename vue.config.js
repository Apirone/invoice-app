/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
    chainWebpack: config => {
        config.resolve.alias.set('vue', '@vue/compat')

        config.module
            .rule('vue')
            .use('vue-loader')
            .tap(options => {
                return {
                    ...options,
                    compilerOptions: {
                        compatConfig: {
                            MODE: 2
                        }
                    }
                }
            })
    },
    publicPath: process.env.APP_BASEPATH,
    devServer: {
        proxy: 'http://localhost:8080'
    }
}
