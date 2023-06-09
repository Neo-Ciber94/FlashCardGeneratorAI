
export const config = {
    runtime: 'edge',
}

export default async function handler(req: Request) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        start(controller) {
            async function run() {
                for (let i = 0; i < 60; i++) {
                    if (req.signal.aborted) {
                        break;
                    }

                    controller.enqueue(encoder.encode(`Hello ${i}`))
                    await wait(1000);
                }
                controller.close();
            }

            run();
        },
    })

    return new Response(stream);
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))