
export function getErrorMessage(obj: any, defaultMessage = "Something went wrong"): string {
    if (obj == null) {
        return defaultMessage;
    }

    if (typeof obj === 'string') {
        return obj.length > 0 ? obj : defaultMessage;
    }

    if (obj instanceof Error) {
        return getErrorMessage(obj.message);
    }

    if (obj.message) {
        return getErrorMessage(obj.message);
    }

    if (obj.error) {
        return getErrorMessage(obj.error);
    }

    if (obj.errors) {
        return getErrorMessage(obj.errors);
    }

    if (Array.isArray(obj) && obj.length > 0) {
        return getErrorMessage(obj[0]);
    }

    return defaultMessage;
}

export async function getResponseError(res: Response, defaultMessage = "Something went wrong"): Promise<string> {
    if (res.ok) {
        throw new Error("Response is not an error");
    }

    if (res.headers.get("Content-Type") === "application/json") {
        return getErrorMessage(await res.json(), defaultMessage);
    }

    if (res.headers.get("Content-Type") === "plain/text") {
        return getErrorMessage(await res.text(), defaultMessage);
    }

    return res.statusText;
}