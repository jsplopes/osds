/*const TARGET = process.env.npm_lifecycle_event;

if (TARGET === "build:dev" || TARGET === "dev" || !TARGET) {
    module.exports = require("./config/webpack/webpack.config.dev");
    console.info("--> ./config/webpack.config.dev.js");
} else if (TARGET === "build:prod") {
    module.exports = require("./config/webpack/webpack.config.prod");
    console.info("--> ./config/webpack.config.prod.js");
}*/

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;
const pkg = require("./package.json");

const dev = require("./config/webpack/webpack.config.dev");

const prod = require("./config/webpack/webpack.config.prod");

module.exports = (env, argv) => {
    console.log(argv.mode);
    const isDevMode = (argv && argv.mode) === "development" ? true : false;

    return {
        mode: isDevMode ? "development" : "production",
        entry: {
            [pkg.name]: "./src/oui.ts"
        },
        output: {
            //chunkFilename: `index.js`,
            //filename: isProdMode ? "index.min.js" : "index.js",~
            filename: "[name].[chunkhash].js",
            path: `${__dirname}/dist`,
            libraryTarget: "umd",
            library: "OUI",
            umdNamedDefine: true
        },
        // Enable sourcemaps for debugging webpack's output.
        devtool: "source-map",
        resolve: {
            // Add '.ts', '.tsx', ... as resolvable extensions.
            extensions: [".ts", ".tsx", ".js", ".jsx", ".scss"],
            modules: [__dirname + "/node_modules"]
        },
        resolveLoader: {
            modules: [__dirname + "/node_modules"]
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/
                },
                {
                    test: /\.scss$/,
                    use: ["style-loader", "css-loader", "sass-loader"]
                },
                {
                    test: /\.(png|svg|jpg|gif|ico)$/,
                    use: [
                        {
                            loader: "url-loader",
                            options: {
                                limit: 5000,
                                fallback: "file-loader"
                            }
                        }
                    ]
                },
                {
                    test: /\.(ttf|eot|woff|woff2|svg)$/,
                    include: /src/,
                    use: {
                        loader: "file-loader",
                        options: {
                            name: "src/style/fonts/[name].[ext]"
                        }
                    }
                }
            ]
        },
        externals: {
            react: {
                root: "React",
                commonjs2: "react",
                commonjs: "react",
                amd: "react"
            },
            "react-dom": {
                root: "ReactDOM",
                commonjs2: "react-dom",
                commonjs: "react-dom",
                amd: "react-dom"
            }
        },
        /*optimization: {
        runtimeChunk: {
            name: `runtime`
        },
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "initial",
                    name: "vendors",
                    priority: -10
                },
                commons: {
                    name: "commons",
                    chunks: "initial",
                    minChunks: 2
                }
            }
        }
    },*/
        // If rds build process changes, meaning if the first npm install is removed please review this copy
        plugins: [
            new CleanWebpackPlugin(),
            /*new DtsBundleWebpack({
            name: "oui",
            main: "dist/oui.d.ts",
            baseDir: "dist",
            out: "@types/oui.d.ts",
            removeSource: true,
            outputAsModuleFolder: true
        }),*/
            new BundleAnalyzerPlugin({ analyzerMode: "static" })
            /*  new CopyPlugin([
            { from: 'node_modules/react/umd/react.production.min.js', to: 'src/js/externals/' },
            { from: 'node_modules/react-dom/umd/react-dom.production.min.js', to: 'src/js/externals/' },
            { from: 'node_modules/styled-components/dist/styled-components.min.js', to: 'src/js/externals/' },
          ])*/
        ]
    };
};
