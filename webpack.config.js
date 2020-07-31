var path = require('path'),
    { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    entry: {
	site: './pub/js/src/site.js',
	index: './pub/js/src/index.js',
	page: './pub/js/src/page.js',
	jquery: './pub/js/src/jquery/jquery.js'
    },
    output: {
 	path: path.resolve(__dirname, 'pub/js/build'),
	filename: '[name].js'	
    },
    optimization: {
	splitChunks: {
	    chunks: 'all',
	    cacheGroups: {
		commons: {
		    name: 'jquery',
		    chunks: 'all',
		    minChunks: 2,
		    minSize: 0,
		}
	    }
	}
    },
    module: {
     	rules: [
     	    {
		test: /\.sj$/,
 		exclude: /node_modules/,
		use: {
 		    loader: 'babel-loader',
 		    options: {
 			presets: ['@babel/preset-env'],
			plugins: []
 		    }
		}
     	    }
     	]
    },
    plugins: [
	new CleanWebpackPlugin()
    ]
}
