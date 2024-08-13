import {Workbook, Column} from 'exceljs'
type ResType = {[key : string] : string};
export function exportExcel(data : ResType[]){
    if (data.length == 0){
        return;
    }
    const workbook = new Workbook();
    const sheet = workbook.addWorksheet("Sheet 1");
    sheet.columns = Object.keys(data[0]).map((val : string) =>{
        return {header: val, key: val} as Partial<Column>;
    });
    sheet.addRows(data);

    workbook.xlsx.writeBuffer().then(res =>{
        const blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = "datasheet.xlsx";
        link.click();
        URL.revokeObjectURL(link.href);
    })
}