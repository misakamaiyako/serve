interface ExcelData {
	[ key:string ]:string
}

interface ExcelColumn {
	key:string,
	title:string | null
}

export default function makeExcel (data:ExcelData[], columns:ExcelColumn[], name:string = 'work sheet'):string {
	let Excel = `<?xml version="1.0" encoding="utf-8"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><Author>Misaka</Author><Created>${ Date.now() }</Created></DocumentProperties><Styles><Style ss:ID="Currency"><NumberFormat ss:Format="Currency"/></Style><Style ss:ID="Date"><NumberFormat ss:Format="Medium Date"/></Style></Styles><Worksheet ss:Name="${ name }"><Table ss:DefaultColumnWidth="120"><Row>`;
	columns.forEach(g => {
		Excel += `<Cell><Data ss:Type="String">${ g.title }</Data></Cell>`
	});
	Excel += '</Row>';
	data.forEach(t => {
		let row = '<Row>';
		if (columns.length > 0) {
			columns.forEach(g => {
				if (g.key) {
					row += `<Cell><Data ss:Type="String">${ t[ g.key ] }</Data></Cell>`
				}
			});
		} else {
			columns.forEach(g => {
				for (const key in g) {
					row += `<Cell><Data ss:Type="String">${ t[ key ] }</Data></Cell>`
				}
			});
		}
		row += '</Row>';
		Excel += row;
	});
	Excel += '</Table></Worksheet></Workbook>';
	return Excel
}
