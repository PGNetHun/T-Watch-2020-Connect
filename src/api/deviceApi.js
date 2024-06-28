import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { encodeArrayBuffer } from "../utils/base64";

const _TIMEOUT_MS = 10000;
const _POST = "POST";
const _DELETE = "DELETE";
const textDecoder = new TextDecoder()

const rawBaseQuery = (baseUrl) => fetchBaseQuery({
    baseUrl,
    timeout: _TIMEOUT_MS,
    mode: "cors",
    prepareHeaders: (headers, { getState, endpoint }) => {
        if (endpoint !== "connect" && endpoint !== "getInfo") {
            const state = getState();
            if (state.device.is_connected && state.device.token) {
                headers.set("Authorization", `Bearer ${state.device.token}`);
            }
        }

        return headers;
    }
});

const dynamicBaseQuery = async (args, api, extraOptions) => {
    // Get device URL from store
    const baseUrl = api.getState().device.url;
    if (!baseUrl) {
        return {
            error: {
                status: 503,
                statusText: "Service unavailable",
                data: "No device URL specified",
            }
        };
    }

    return rawBaseQuery(baseUrl)(args, api, extraOptions);
};

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


export const deviceApi = createApi({
    reducerPath: `deviceApi`,
    baseQuery: dynamicBaseQuery,
    endpoints: (builder) => ({
        getInfo: builder.query({
            query: () => `info`
        }),
        
        updateInfo: builder.mutation({
            query: (info) => ({
                url: `api/info`,
                method: _POST,
                body: info
            })
        }),

        connect: builder.mutation({
            query: (authcode) => ({
                url: `authenticate`,
                method: _POST,
                body: { "code": authcode }
            })
        }),

        disconnect: builder.mutation({
            query: (body) => ({
                url: `logout`,
                method: _POST,
                body
            })
        }),

        getFile: builder.query({
            query: (path) => ({
                url: `api/file?path=${path}`,
                responseHandler: multiFormatResponseHandler
            })
        }),

        postFile: builder.mutation({
            query: ({ path, content, overwrite=false }) => ({
                url: `api/file?path=${path}&overwrite=${overwrite}`,
                method: _POST,
                body: content,
                headers: {
                    'Content-Type': 'application/octet-stream'
                }
            })
        }),

        getFiles: builder.query({
            query: (path) => `api/files?path=${path}`
        }),

        getDirectories: builder.query({
            query: (path) => `api/directories?path=${path}`
        }),

        createDirectory: builder.mutation({
            query: (path) => ({
                url: `api/directory?path=${path}`,
                method: _POST
            })
        }),

        getEntries: builder.query({
            query: (path) => `api/entries?path=${path}`
        }),

        deleteEntry: builder.mutation({
            query: (path) => ({
                url: `api/entry?path=${path}`,
                method: _DELETE
            })
        }),

        getTokens: builder.query({
            query: () => `api/tokens`
        }),

        deleteTokens: builder.mutation({
            query: (tokens) => ({
                url: `api/file`,
                method: _DELETE,
                body: tokens
            })
        }),

        getKeyVaultKeys: builder.query({
            query: () => `api/keyvault/keys`
        }),

        getKeyVaultItem: builder.query({
            query: (key) => `api/keyvault?key=${key}`
        }),

        postKeyVaultItem: builder.mutation({
            query: ({ key, value }) => ({
                url: `api/keyvault?key=${key}`,
                method: _POST,
                body: { "value": value }
            })
        }),

        deleteKeyVaultItem: builder.mutation({
            query: (key) => ({
                url: `api/keyvault?key=${key}`,
                method: _DELETE
            })
        }),

        executeCommand: builder.mutation({
            query: ({ id, parameters = null }) => ({
                url: `api/command?id=${id}`,
                method: _POST,
                body: parameters || ""
            })
        }),

        executeScript: builder.mutation({
            query: (script) => ({
                url: `api/script`,
                method: _POST,
                body: script
            })
        }),

        screenshot: builder.query({
            query: () => ({
                url: `api/screenshot`,
                keepUnusedDataFor: 0,
                responseHandler: multiFormatResponseHandler
            })
        })
    })
})

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
    useGetInfoQuery,
    useUpdateInfoMutation,
    useConnectMutation,
    useDisconnectMutation,
    useGetFileQuery,
    useLazyGetFileQuery,
    usePostFileMutation,
    useGetFilesQuery,
    useGetDirectoriesQuery,
    useCreateDirectoryMutation,
    useGetEntriesQuery,
    useLazyGetEntriesQuery,
    useDeleteEntryMutation,
    useGetTokensQuery,
    useDeleteTokensMutation,
    useGetKeyVaultKeysQuery,
    useGetKeyVaultItemQuery,
    useLazyGetKeyVaultItemQuery,
    usePostKeyVaultItemMutation,
    useDeleteKeyVaultItemMutation,
    useExecuteCommandMutation,
    useExecuteScriptMutation
} = deviceApi;