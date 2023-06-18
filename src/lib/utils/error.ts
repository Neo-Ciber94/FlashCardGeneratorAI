
export type ErrorCode = 'BAD_REQUEST' | 'NOT_FOUND';

export class ServerError extends Error {
    private _code: ErrorCode;

    constructor(code: ErrorCode, message?: string) {
        super(message);
        this._code = code;
    }

    get code() {
        return this._code;
    }

    get statusCode() {
        switch (this._code) {
            case 'BAD_REQUEST':
                return 400;
            case 'NOT_FOUND':
                return 404;
            default:
                return 500;
        }
    }
}