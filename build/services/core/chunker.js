"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseExcelFileInChunks = void 0;
const moment = require("moment");
const geofire = require("geofire-common");
const ExcelJS = require("exceljs");
async function* parseExcelFileInChunks(filePath, countryCode) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    for (var i = 0; i < workbook.worksheets.length; i++) {
        const worksheet = workbook.worksheets[0];
        let plots = [];
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber === 1)
                return; // Skip header row
            const plot = {
                plotNumber: row.getCell(1).text,
                lat: Number(row.getCell(2).value),
                lng: Number(row.getCell(3).value),
                city: row.getCell(4).text,
                country: row.getCell(5).text,
                countryCode: countryCode !== null && countryCode !== void 0 ? countryCode : '+267',
                hits: 0,
                geohash: geofire.geohashForLocation([Number(row.getCell(2).value), Number(row.getCell(3).value)]),
                lastUpdated: moment().valueOf(),
            };
            plots.push(plot);
            if (plots.length === 40) {
                // Yield a chunk of 400 plots and reset the plots array
                return void (function* () { yield plots; plots = []; }());
            }
        });
        if (plots.length > 0) {
            // Yield remaining plots if any
            yield plots;
        }
    }
}
exports.parseExcelFileInChunks = parseExcelFileInChunks;
//# sourceMappingURL=chunker.js.map