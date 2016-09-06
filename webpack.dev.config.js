var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: [
    './src/index.js',
    './src/style.css',
    'webpack-dev-server/client?http://0.0.0.0:4000',
    'webpack/hot/only-dev-server'
  ],

    output: {
        path: '/',// public 이 아니고 /, 이렇게 하면 파일을 메모리에 저장하고 사용합니다
        filename: 'bundle.js'
    },

    devServer: {
        hot: true,
        inline: true,
        host: '0.0.0.0',
        port: 4000,
        contentBase: __dirname + '/public/',
        /* 모든 요청을 프록시로 돌려서 express의 응답을 받아오며,
        bundle 파일의 경우엔 우선권을 가져서 devserver 의 스크립트를 사용하게 됩니다 */
        proxy: {
            "**": "http://localhost:3000" // express 서버주소
        },
        stats: {
          // 콘솔 로그를 최소화 합니다
          assets: false,
          colors: true,
          version: false,
          hash: false,
          timings: false,
          chunks: false,
          chunkModules: false
        }
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['react-hot', 'babel?' + JSON.stringify({
                    cacheDirectory: true,
                    presets: ['es2015', 'react']
                })],
                exclude: /node_modules/,
            },
            {
              test: /\.css$/,
              loader: 'style!css-loader'
            }
        ]
    },

    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ],

    resolve: { // ./component 같은 접근을 더 편하게 해줌.
      root: path.resolve('./src')
    }
};
