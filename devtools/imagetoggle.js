function ImageToggle() {
	this.toggleBox = document.getElementById('imageCompareBox');
	this.orImageElement = document.getElementById('toggleOriginalImage');
	this.trImageElement = document.getElementById('toggleTransformedImage');
	this.transformedSelected = document.getElementById('transformedImage');
	this.originalSelected = document.getElementById('originalImage');
	instance = this;

	this.toggleBox.onclick = function() {
		var swapIndex = instance.orImageElement.style.zIndex;
		instance.orImageElement.style.zIndex = instance.trImageElement.style.zIndex;
		instance.trImageElement.style.zIndex = swapIndex;

		if (instance.transformedSelected.className == 'unselectedImage' && instance.originalSelected.className == 'unselectedImage') {
			instance.transformedSelected.className = 'selectedImage';
			instance.originalSelected.className = 'unselectedImage';
		} else {
			var swapSelectedImage = instance.transformedSelected.className;
			instance.transformedSelected.className = instance.originalSelected.className;
			instance.originalSelected.className = swapSelectedImage;
		}
	}
}

ImageToggle.prototype.addImages = function(originalImage, transformedImage) {
	document.getElementById("imageCompareBox").style.display = 'none';
	document.getElementById("imageAjaxLoader").style.display = 'block';
	instance = this;

	var oImage = new Image();
	var tImage = new Image();
	tImage.src = transformedImage;
	this.transformedImage = tImage;

	tImage.onload = function() {
		oImage.src = originalImage;
		instance.originalImage = oImage;
	};

	oImage.onload = function() {
		document.getElementById("compareUrlTitle").style.visibility = 'visible';
		document.getElementById("imageCompareBox").style.display = 'block';
		document.getElementById("imageAjaxLoader").style.display = 'none';

		instance.transformedSelected.className = 'unselectedImage';
		instance.originalSelected.className = 'unselectedImage';

		instance.trImageElement.src = tImage.src;
		instance.trImageElement.style.zIndex = -1;
		instance.trImageElement.setAttribute('width', tImage.width);
		instance.trImageElement.setAttribute('height', tImage.height);

		instance.orImageElement.src = oImage.src;
		instance.orImageElement.setAttribute('width', tImage.width);
		instance.orImageElement.setAttribute('height', tImage.height);
		instance.orImageElement.style.zIndex = 1;

		instance.toggleBox.setAttribute('width', tImage.width);
		instance.toggleBox.setAttribute('height', tImage.height);
	};
};
