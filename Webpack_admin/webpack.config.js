const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const mode = "development";
module.exports={
    mode: mode, 
    entry: "./index.tsx"
    ,
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "bundle.js",
        publicPath: '',
    },
    plugins: [
        new MiniCssExtractPlugin()
    ],
    target: "web",
    devServer: {
        port: "5176",
        open: false,
        hot: true ,
        liveReload: true,
        historyApiFallback: true
    },
    resolve: {
        extensions: ['.js','.ts','.tsx', '.json']
    },
    
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    module:{
        rules: [
            {
                test: /\.(ts|tsx)$/, 
                exclude: /node_modules/, 
                use:  'babel-loader' 
            },
            {
                test: /\.css$/,
                use : [
                mode == 'production' ? 
                    MiniCssExtractPlugin.loader : 'style-loader',
                    ,'css-loader'],
            }
        ]
    }
}