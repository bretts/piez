function update3PMDetailsTable(page) {
	var threePmDetailsTable	= '<table class="detailed-results"><tr><th>URL</th><th>Script Management Action</th></tr>';
	page.threePmDownloadDetails.forEach(function(detail) {
		threePmDetailsTable += '<tr class="urlInfo">';
		threePmDetailsTable += '<td class="urlData"' + 'data-url="' + detail.url + '">' + '<a href="' + detail.url + '"' + ' target="_blank"' + '>' + detail.url + '</a>' + '</td>';
		threePmDetailsTable += '<td>' + detail.threePmAction + '</td>';
		threePmDetailsTable += '</tr>';
		document.getElementById('detailsBox1').style.display = 'block';
	});
	threePmDetailsTable += '</table>';
	document.getElementById('detailsBox1Table').innerHTML = threePmDetailsTable;
}

function updateNon3PMDetailsTable(page) {
	// var nonImIcDetailsTable	= '<table class="detailed-results"><tr><th>URL</th><th>Image Type</th><th>Size</th>';
	// page.nonImOrIcImageDetails.forEach(function(detail) {
	// 	nonImIcDetailsTable += '<tr class="urlInfo">';
	// 	nonImIcDetailsTable += '<td class="urlData"' + 'data-url="' + detail.url + '">' + '<a href="' + detail.url + '"' + ' target="_blank"' + '>' + detail.url + '</a>' + '</td>';
	// 	nonImIcDetailsTable += '<td>' + detail.contype + '</td>';
	// 	nonImIcDetailsTable += '<td>' + displayBytes(detail.contlen) + '</td>';
	// 	nonImIcDetailsTable += '</tr>';
	// 	document.getElementById('detailsBox3').style.display = 'block';
	// 	document.getElementById('nonImIcBytes').textContent = displayBytes(page.totalNonImOrIcSize);
	// });
	// nonImIcDetailsTable += '</table>';
	// document.getElementById('detailsBox3Table').innerHTML = nonImIcDetailsTable;
}