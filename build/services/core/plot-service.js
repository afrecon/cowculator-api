"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlotService = void 0;
const chunker_1 = require("./chunker");
const moment = require("moment");
/**
 * Express specific implementation of an HTTP server
 */
class PlotService {
    constructor(firestore, loggerFactory) {
        this.firestore = firestore;
        this.logger = loggerFactory.getNamedLogger('hottenplot-service');
        this.logger.debug('Plot Service Started');
    }
    async UploadData(code) {
        const filePath = '../../plots.xlsx';
        const start = moment().utc();
        const plotsGenerator = (0, chunker_1.parseExcelFileInChunks)(filePath);
        await this.savePlotsToFirestore(plotsGenerator, 'plots');
        const end = moment().utc();
        const diff = end.diff(start, 'seconds');
        console.log('FILE PROCCESSING COMPLETE IN ' + diff + ' Seconds');
        return {
            message: 'FILE PROCCESSING COMPLETE IN ' + diff + ' Seconds'
        };
    }
    async savePlotsToFirestore(plotsGenerator, collectionName) {
        for await (const plots of plotsGenerator) {
            let batch = this.firestore.batch();
            for (const plot of plots) {
                const ref = this.firestore.collection(collectionName).doc();
                batch.set(ref, plot);
            }
            await new Promise((resolve) => {
                setTimeout(async () => {
                    console.log('Writing a batch of 490 documents...');
                    await batch.commit();
                    resolve(null);
                }, 3000);
            });
        }
    }
}
exports.PlotService = PlotService;
//# sourceMappingURL=plot-service.js.map