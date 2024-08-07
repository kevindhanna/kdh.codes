import { validateSignature } from "./validateSignature";

type Maybe<T> = T | undefined;
export const validateRequest = async (
    request: Request,
): Promise<[Maybe<Record<string, unknown>>, Maybe<Response>]> => {
    const signatureHeader = request.headers.get("X-Hub-Signature-256");
    if (!signatureHeader) {
        console.error("Missing signature header");
        return [
            undefined,
            new Response("Nope!", {
                status: 401,
                headers: {
                    "Content-Type": "text/plain",
                },
            }),
        ];
    }

    if (!request.body) {
        console.error("Missing request body");
        return [
            undefined,
            new Response("Nope!", {
                status: 401,
                headers: {
                    "Content-Type": "text/plain",
                },
            }),
        ];
    }

    const bodyJson = await request.json();

    const isValid = await validateSignature({
        secret: process.env.GITHUB_WEBHOOK_SECRET!,
        header: signatureHeader,
        payload: JSON.stringify(bodyJson),
    });
    if (!isValid) {
        console.error(`Signature does not match`);
        return [
            undefined,
            new Response("Nope!", {
                status: 401,
                headers: {
                    "Content-Type": "text/plain",
                },
            }),
        ];
    }

    return [bodyJson, undefined];
};
