const path = require('path');
function resolve (dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    pages: {
        index: {
            // page 的入口
            entry: 'client/main.js'
        }
    },
    chainWebpack: (config)=>{
        //修改文件引入自定义路径
        config.resolve.alias
            .set('@', resolve('client'))
    },
    pwa: {
        iconPaths: {
            favicon32: 'favicon.ico',
            favicon16: 'favicon.ico',
            appleTouchIcon: 'favicon.ico',
            maskIcon: 'favicon.ico',
            msTileImage: 'favicon.ico',
        }
    },
    configureWebpack: (config) => {
        // 取消console打印    
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      // 如果是多环境打包
      //if (process.env.NODE_ENV === 'production') {
        //config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
     // }
    }  
}