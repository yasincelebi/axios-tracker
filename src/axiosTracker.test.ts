import {vi} from "vitest";

vi.mock("axios", () => {
    return {
        default: {
            create: vi.fn(() => ({
                interceptors: {
                    request: {use: vi.fn()},
                    response: {use: vi.fn()},
                },
                get: vi.fn(),
                post: vi.fn(),
                put: vi.fn(),
                delete: vi.fn(),

            })),
            get: vi.fn(),

        }
    };
});