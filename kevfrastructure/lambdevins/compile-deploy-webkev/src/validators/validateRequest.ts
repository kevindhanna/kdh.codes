import { validateGithubSignature } from "./validateGithubSignature";

type Maybe<T> = T | undefined;
export const validateRequestBody = async (
    request: Request,
): Promise<[Maybe<Record<string, unknown>>, Maybe<Response>]> => {
    const signatureHeader = request.headers.get("HTTP_X_HUB_SIGNATURE_256");
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
    // const bodyReader = request.body?.getReader();

    // const decoder = new TextDecoder();
    // let body = "";
    // while (true) {
    //     const { done, value } = await bodyReader.read();
    //     if (done) {
    //         break;
    //     }
    //     body = body + decoder.decode(value);
    // }

    const bodyJson = await request.json();

    const isValid = await validateGithubSignature({
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
