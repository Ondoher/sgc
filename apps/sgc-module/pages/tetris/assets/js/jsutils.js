function make2DArray(rows, cols, value)
{
	var result = [];

	for (var row = 0; row < rows; row++)
	{
		result.push([]);
		for (var col = 0; col < cols; col++)
			result[row].push(value);
	}

	return result;
}

//----------------------------------------------------------------------------

function makeArray(len, value)
{
	var result = [];

	for (var idx = 0; idx < len; idx++)
		result.push(value);

	return result;
}
