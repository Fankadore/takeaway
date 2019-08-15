const moveElement = (array, startIndex, endIndex) => {
	startIndex = parseInt(startIndex);
	endIndex = parseInt(endIndex);

	if (startIndex < endIndex) {
		if (startIndex < 0 || endIndex <= 0) return;

		while (startIndex < endIndex) {
			const temp = array[startIndex + 1];
			array[startIndex + 1] = array[startIndex];
			array[startIndex] = temp;
			startIndex++;
		}
	}
	else if (startIndex > endIndex) {
		if (startIndex <= 0 || endIndex < 0) return;
		while (startIndex > endIndex) {
			const temp = array[startIndex - 1];
			array[startIndex - 1] = array[startIndex];
			array[startIndex] = temp;
			startIndex--;
		}
	}

	return array;
};

module.exports = {
	moveElement,
};
