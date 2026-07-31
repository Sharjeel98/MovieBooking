module.exports = {
  replaceAttrValues: {
    '#827D88': 'currentColor',
    '#A6A6A6': 'currentColor',
  },
  svgoConfig: {
    plugins: [
      {
        name: 'preset-default',
        params: { overrides: { removeViewBox: false } },
      },
      {
        name: 'removeAttrs',
        params: { attrs: '(fill-opacity|fill-rule)' },
      },
    ],
  },
};
