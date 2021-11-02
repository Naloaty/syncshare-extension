/* eslint-env node */

const CopyPlugin      = require("copy-webpack-plugin");
const commonDevConfig = require("../webpack/webpack.dev.js");
const { merge }       = require("webpack-merge");
const path            = require("path");

const outputFolder = path.resolve(__dirname, "distr")
const commonRoot   = path.resolve(__dirname, "..", "common");

const config = {
    output: { 
        path: outputFolder 
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(commonRoot, "manifest", "manifest.template.json"),
                    to:   path.resolve(outputFolder, "manifest.json"),
                    transform(content) {
                        const manifest = JSON.parse(content.toString());

                        manifest.name = "SyncShare - Development";
                        manifest.version = process.env.npm_package_version;

                        const services = [
                            process.env.SERVICE_URL
                        ];

                        manifest.content_security_policy = `default-src 'self'; connect-src 'self' ${services.join(" ")} http:;`;

                        return JSON.stringify(manifest, null, 2);
                    }
                },
                {
                    from: path.resolve(commonRoot, "assets")
                }
            ]
        })
    ]
};


module.exports = merge(commonDevConfig, config);