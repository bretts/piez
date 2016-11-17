(function(global) {
	'use strict';

	global.Page = function() {
        this.pageLoaded                 = false;
        this.pageLoadTime				= 0;
		this.totalOriginalSize          = 0;
		this.totalImTransformSize       = 0;
		this.totalIMImagesTransformed   = 0;
		this.imDownloadDetails          = [];
		this.localCacheEnabled          = false;

		this.totalIcTransformSize       = 0;
		this.totalICImagesTransformed   = 0;
		this.icDownloadDetails          = [];
		this.genericFormatTotal         = 0;
		this.chromeFormatTotal          = 0;
		this.safariFormatTotal          = 0;
		this.ieFormatTotal              = 0;

		this.totalNonImImages           = 0;
		this.nonImOrIcImageDetails      = [];
		this.totalNonImOrIcSize         = 0;

        this.preconnects                = {common: [], unique: [], notUsed: [], linkHeader: []};
        this.resourcesPushed            = {common: [], unique: [], notUsed: [], edgePushed: []};
	};
})(this);
