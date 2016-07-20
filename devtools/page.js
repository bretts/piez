(function(global) {
	'use strict';

	global.Page = function() {
		this.totalOriginalSize          = 0;
		this.totalImTransformSize       = 0;
		this.totalIMImagesTransformed   = 0;
		this.imDownloadDetails          = [];
		this.localCacheEnabled          = false;

		this.totalIcTransformSize       = 0;
		this.totalICImagesTransformed   = 0;
		this.icDownloadDetails          = [];
	};
})(this);