const {
  resolve
} = require("path");

module.exports = {
  entry: './src/index.js',
  mode: 'production',
  output: {
    path: resolve(process.cwd(), 'dist'),
    filename: 'imagekitio-react.js',
    library: 'imageKitReact',
    libraryTarget: 'umd',
    publicPath: '/dist/',
    umdNamedDefine: true
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader"
      }
    }]
  },
  externals: {
    "React": "react",
    "imagekit": "imagekit-javascript"
  }
};
