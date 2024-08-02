const path = require("path");

module.exports={
    mode: "development", 
    entry: "./index.tsx", 
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "bundle.js",
        publicPath: '/',
    },
    
    target: "web",
    devServer: {
        port: "5175",
        open: false,
        hot: true ,
        liveReload: true,
        historyApiFallback: true
    },
    resolve: {
        extensions: ['.js','.ts','.tsx', '.json']
    },
    module:{
        rules: [
            {
                test: /\.(ts|tsx)$/,    //kind of file extension this rule should look for and apply in test
                exclude: /node_modules/, //folder to be excluded
                use:  'babel-loader' //loader which we are going to use
            },
            {
                test: /\.css$/,
                use: ['style-loader','css-loader']
            }
        ]
    }
}