const rewireCssModules = require("react-app-rewire-css-modules");
const rewireReactHotLoader = require("react-app-rewire-hot-loader");

module.exports = {
  webpack: function(config, env) {
    // adds SCSS/SASS support
    config = rewireCssModules(config, env);
    // adds React hot reload
    config = rewireReactHotLoader(config, env);

    return config;
  },
};
