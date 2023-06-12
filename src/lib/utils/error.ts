
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
}