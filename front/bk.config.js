const { resolve } = require('path');

module.exports = {
  assetsDir: '',
  outputAssetsDirName: '',
  outputDir: 'dist',
  publicPath: process.env.BK_STATIC_URL,
  host: process.env.BK_APP_HOST,
  port: process.env.BK_APP_PORT,
  cache: true,
  open: true,
  typescript: true,
  forkTsChecker: false,
  bundleAnalysis: false,
  replaceStatic: false,
  target: 'web',
  lazyCompilation: true,
  lazyCompilationHost: 'localhost',
  envPrefix: 'BK_',
  copy: {
    from: './static',
    to: './dist/',
  },
  resource: {
    main: {
      entry: './src/main',
      html: {
        filename: 'index.html',
        template: './index.html',
        templateParameters: process.env,
      },
    },
  },
  css: {
    scssLoaderOptions: {
      additionalData: '@import "./src/style/variables.scss";',
    },
  },
  configureWebpack() {
    return {
      resolve: {
        alias: {
          '@pluginHandler': resolve(__dirname, './src/plugin-handler'),
        },
      },
    };
  },
  chainWebpack: (config) => config,
};
