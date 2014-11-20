var karmaConfig = require("./karmaConfig.json");
var karmaVUI = require("../index.js");

module.exports = function(config) {
	config.set(karmaVUI.addConfig(karmaConfig, false));
};
