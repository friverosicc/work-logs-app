'use strict';

var argsList = require('args-list');

/**
 * Small dependency injection container.
 */
var DIContainer = function() {
	var _dependencies = {};
	var _factories = {};

	function factory(name, factory) {
		_factories[name] = factory;
	};

	function register(name, dependency) {
		_dependencies[name] = dependency;
	};

	function get(name) {
		if(!_dependencies[name]) {
			var factory = _factories[name];

			_dependencies[name] = factory && inject(factory);

			if(!_dependencies[name]) {
				throw new Error('Cannot find module: ' + name);
			}
		}

		return _dependencies[name];
	};

	function inject(factory) {
		var args = argsList(factory)
		.map(function(dependency) {
			return get(dependency);
		});

		return factory.apply(null, args);
	};

	return {
		factory: factory,
		register: register,
		get: get,
		inject: inject
	};
};

module.exports = DIContainer();
