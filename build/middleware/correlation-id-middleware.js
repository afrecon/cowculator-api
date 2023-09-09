"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorrelationIdMiddleware = void 0;
const uuid = require("uuid");
const HTTPContext = require("express-http-context");
/**
 * Correlation ID middleware component extracts an existing correlation ID, if it exists, from the incoming request, or
 * generates a new correlation ID and attaches it to the request, the response and sets it to the request context
 */
class CorrelationIdMiddleware {
    /**
     * Get the middleware component
     */
    static getMiddleware() {
        return (req, res, next) => {
            var _a;
            const correlationId = (_a = req.get('correlationId')) !== null && _a !== void 0 ? _a : uuid.v4();
            req.headers['correlationId'] = correlationId;
            res.set('correlationId', correlationId);
            HTTPContext.set('correlationId', correlationId);
            next();
        };
    }
}
exports.CorrelationIdMiddleware = CorrelationIdMiddleware;
//# sourceMappingURL=correlation-id-middleware.js.map