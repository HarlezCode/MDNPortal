/*
    Actions that can be done locally
*/

import {Workbook, Column} from 'exceljs'
type ResType = {[key : string] : string};


/*
    Exports table entries to excel
    :param data: list of table entries
    :returns: void
*/
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

const clusterToUserid : {[index : string] : string} = {
    'HKEC' : 'emmhkec',
    'HKWC' : 'emmhkwc',
    'KEC' : 'emmkec',
    'KWC' : 'emmkwc',
    'KCC' : 'emmkcc',
    'NTEC' : 'emmntec',
    'NTWC' : 'emmntwc',
    'HAHO' : 'emmhaho'
};

/*
    Exports table data to csv for use of enrolling new devices
    :param data: list of table data entries
    :returns: void
*/
export function exportCsvNewDevice(data : {[index : string] : any}[]){
    if (data.length == 0){
        return;
    }
    const middle = ",0,PDA,,I,C,L,,,,,en-US,,FALSE,"
    let csv = "User ID,Country Code,Number (Without Country Code.),Operator (Not Required for PDA and Country Code other than 1.),OS (Possible values are A or I or B or W or S or P or L or M. A for Android. I for iOS. B for BlackBerry. W for Windows Mobile. S for Symbian. P for Palm webOS. L for OS X. M for Windows Phone 8.),E/C (E for Employee Owned. C for Company Owned),Source (Possible values are D or L. D for LDAP. L for Local.),First Name,Last Name,Email,Password (if passed empty then user will be created (if Local user does not exist) with User ID as Password.,Device Language (Possible values are en-US or ja-JP or ko-KR or fr-FR or de-DE. en-US for English. ja-JP for Japanese. ko-KR for Korean. fr-FR for French. de-DE for German. zh-CN for Chinese Simplified. zh-TW for Chinese Traditional. ru-RU for Russian.),User Display Name,Notify User(TRUE or FALSE),Serial Number\r\n";
    data.forEach((val : {[index : string] : any}) =>{
        csv += clusterToUserid[val["cluster"]] + middle + val["serial"] + "\r\n";
    })
    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "datasheet.csv";
    link.click();
    URL.revokeObjectURL(link.href);
}