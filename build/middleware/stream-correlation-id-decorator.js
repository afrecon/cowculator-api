"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamCorrelationIdDecorator = void 0;
const events_1 = require("events");
/**
 * Predicate to test if parameter is an object
 *
 * @param obj parameter to test
 * @returns true if parameter is an object
 */
function isObject(obj) {
    return typeof (obj) === 'object';
}
/**
 * Decorator for a writeable stream to include correlationId with each record.
 */
class StreamCorrelationIdDecorator extends events_1.EventEmitter {
    /**
     * @constructor
     */
    constructor(stream, getContextVariable) {
        super();
        this.stream = stream;
        this.getContextVariable = getContextVariable;
        this.writable = true;
    }
    end(str, encoding, cb) {
        return this.stream.end(str);
    }
    /**
     * Write the record to the supplied writable stream with the additional `correlationId` if available.
     */
    write(record) {
        var _a;
        try {
            const loggerData = isObject(record) ? record : JSON.parse(record);
            loggerData.correlationId = (_a = this.getContextVariable('correlationId')) !== null && _a !== void 0 ? _a : '';
            return this.stream.write(JSON.stringify(loggerData) + '\n');
        }
        catch (_) {
            return this.stream.write(record);
        }
    }
}
exports.StreamCorrelationIdDecorator = StreamCorrelationIdDecorator;
//# sourceMappingURL=stream-correlation-id-decorator.js.map