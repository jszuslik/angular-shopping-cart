module.exports = {
    entry: "./cart/app/main",
    output: {
        path: __dirname,
        filename: "./dist/bundle.js"
    },
    resolve: {
        extensions: ['', '.js', '.ts']
    },
    module: {
        loaders: [
            {
                test: /\.ts/, loaders: ['ts-loader'], exclude: /node-modules/
            }
        ]
    }

};