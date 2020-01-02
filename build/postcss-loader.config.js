const path = require('path');
const atImport = require('postcss-import');
const nested = require('postcss-nested');
const presetEnv = require('postcss-preset-env');
const theme = require('../theme.json');

module.exports = {
  loader: 'postcss-loader',
  options: {
    plugins() {
      return [
        atImport({
          path: path.join(process.cwd(), 'src')
        }),
        nested(),
        presetEnv({
          preserve: false,
          features: {
            'nesting-rules': true,
            'color-mod-function': true
          },
          browserslist: [
            'last 3 versions',
            '> 1% in CN',
            'Firefox ESR',
            'opera 12.1',
            'ie >= 9',
            'edge >= 12',
            'safari >= 7'
          ],
          importFrom: [
            {
              customProperties: Object.keys(theme).reduce((acc, key) => (acc[`--${key}`] = theme[key], acc), {})
            }
          ]
        })
      ];
    }
  }
};
