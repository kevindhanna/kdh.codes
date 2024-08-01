import assert from "assert";

export interface ValidBody {
    name: string;
    email: string;
    phone: string;
    contactPreference: string;
    body: string;
}

export const requiredFields: (keyof ValidBody)[] = [
    "name",
    "email",
    "phone",
    "contactPreference",
    "body",
];
function isValidBody(body: Partial<ValidBody>): asserts body is ValidBody {
    for (let field of requiredFields) {
        if (typeof body[field] !== "string")
            throw new Error(`Missing ${field}`);
    }
}
type Validation = [ValidBody, undefined] | [undefined, Response];
const invalidResponseTuple: [undefined, Response] = [
    undefined,
    new Response("This doesn't look right :/", {
        status: 400,
        headers: {
            "Content-Type": "text/plain",
        },
    }),
];

const readBody = async (bodyStream: ReadableStream) => {
    const bodyReader = bodyStream.getReader();
    let bytes = new Uint8Array();
    while (true) {
        const { done, value } = await bodyReader.read();
        if (done) {
            break;
        }

        bytes = new Uint8Array([...bytes, ...value]);
    }
    const decoder = new TextDecoder();
    const body = decoder.decode(bytes);
    return body;
};

export const validateRequest = async (
    request: Request,
): Promise<Validation> => {
    if (!request.body) {
        console.warn("No body");
        return invalidResponseTuple;
    }

    if (request.method !== "POST") {
        console.warn("Wrong method");
        return invalidResponseTuple;
    }

    const body = await readBody(request.body);
    if (!body) {
        console.warn("Body missing");
        return invalidResponseTuple;
    }

    const bodyParts = new URLSearchParams(body);
    const formData = {
        name: bodyParts.get("name") ?? undefined,
        email: bodyParts.get("email") ?? undefined,
        phone: bodyParts.get("phone") ?? undefined,
        contactPreference: bodyParts.get("contactPreference") ?? undefined,
        body: bodyParts.get("body") ?? undefined,
    };
    try {
        isValidBody(formData);
    } catch (e) {
        console.warn(
            `Invalid form data, ${e instanceof Error ? e.message : e}`,
        );
        return invalidResponseTuple;
    }

    return [formData, undefined];
};
