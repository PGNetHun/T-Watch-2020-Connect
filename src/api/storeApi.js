import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { StoreUrl } from "../constants/urls";
import { encodeArrayBuffer } from "../utils/base64";

const textDecoder = new TextDecoder()

const multiFormatResponseHandler = async (response) => {
    const buffer = await response.arrayBuffer();

    return {
        status: response.status,
        size: response.headers.get("content-length"),
        type: response.headers.get("content-type"),
        asBuffer: () => buffer,
        asBase64: () => encodeArrayBuffer(buffer),
        asText: () => textDecoder.decode(buffer),
        asJson: () => JSON.parse(textDecoder.decode(buffer))
    }
};

export const storeApi = createApi({
    reducerPath: `storeApi`,
    baseQuery: fetchBaseQuery({ baseUrl: StoreUrl }),
    endpoints: (builder) => ({
        getJsonFile: builder.query({
            query: (path) => `${path}`
        }),

        getTextFile: builder.query({
            query: (path) => ({
                url: `${path}`,
                responseHandler: multiFormatResponseHandler
            })
        }),

        getBinaryFile: builder.query({
            query: (path) => ({
                url: `${path}`,
                responseHandler: multiFormatResponseHandler
            })
        })
    })
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
    useGetJsonFileQuery,
    useLazyGetJsonFileQuery,
    useGetTextFileQuery,
    useLazyGetTextFileQuery,
    useGetBinaryFileQuery,
    useLazyGetBinaryFileQuery
} = storeApi;