// TODO:
// - fix performance issue of loading so many items (use react-window ?)

import * as React from "react";
import { toast } from 'react-toastify';
import { Box, Backdrop, CircularProgress } from "@mui/material";
import { useGetDirectoriesQuery, useDeleteEntryMutation, usePostFileMutation, useCreateDirectoryMutation } from "../../../api/deviceApi";
import { useGetTextFileQuery, useLazyGetBinaryFileQuery } from "../../../api/storeApi";
import { StoreUrl } from "../../../constants/urls";
import { FacesPath, FontsPath } from "../../../constants/files";
import { Face } from "./Face";
import Preview from "./Preview";

const GenericFaceName = "generic-face";
const RemoteFacesPath = `faces/${GenericFaceName}`;
const RemoteFacesListFile = `${RemoteFacesPath}/faces.txt`;
const RemoteFontsPath = `fonts`;
const DeviceFacesPath = `${FacesPath}/${GenericFaceName}`
const DeviceFontsPath = `${FontsPath}`;

function GenericDigitalFacePanel() {
    const { data: remoteFacesList, isLoading: isRemoteFacesListLoading } = useGetTextFileQuery(RemoteFacesListFile);
    const { data: deviceFaces, refetch: refetchFaces, isLoading: isDeviceFacesLoading } = useGetDirectoriesQuery(DeviceFacesPath);
    const [getResourceFile] = useLazyGetBinaryFileQuery();
    const [writeDeviceFile] = usePostFileMutation();
    const [createDeviceDirectory] = useCreateDirectoryMutation();
    const [deleteDeviceEntry] = useDeleteEntryMutation();

    const [previewUrl, setPreviewUrl] = React.useState(null);
    const [isDeviceCommunicating, showDeviceCommunication] = React.useState(false);

    const installFace = React.useCallback(async (name) => {
        showDeviceCommunication(true);
        try {
            const remoteFacePath = `${RemoteFacesPath}/${name}`;
            const deviceFacePath = `${DeviceFacesPath}/${name}`;

            const copyFile = async function (from, to) {
                const file = await getResourceFile(from);
                await writeDeviceFile({ path: to, content: file.data.asBuffer() })
            }

            // Face directory
            await createDeviceDirectory(deviceFacePath);

            const faceConfigFile = await getResourceFile(`${remoteFacePath}/face.json`);
            const faceConfig = faceConfigFile.data.asJson();

            // Background image
            if (faceConfig.background?.image) {
                await copyFile(`${remoteFacePath}/${faceConfig.background.image}`, `${deviceFacePath}/${faceConfig.background.image}`);
                //const backgroundImage = await getResourceFile(`${remoteFacePath}/${faceConfig.background.image}`);
                //await writeDeviceFile({ path: `${deviceFacePath}/${faceConfig.background.image}`, content: backgroundImage.data.asBuffer() });
            }

            // Copy additional face files
            const fonts = []
            const files = []
            for (const item of faceConfig.items) {
                if (item.type == "label" && item.font && !fonts.includes(item.font)) {
                    await copyFile(`${RemoteFontsPath}/${item.font}`, `${DeviceFontsPath}/${item.font}`);
                    // const fontFile = await getResourceFile(`${RemoteFontsPath}/${item.font}`);
                    // await writeDeviceFile({ path: `${DeviceFontsPath}/${item.font}`, content: fontFile.data.asBuffer() })
                    fonts.push(item.font);
                }
                else if (item.type == "gif" && item.file && !files.includes(item.file)) {
                    await copyFile(`${remoteFacePath}/${item.file}`, `${deviceFacePath}/${item.file}`);
                    files.push(item.file);
                }
                else if (item.type == "image" && item.file && !files.includes(item.file)) {
                    await copyFile(`${remoteFacePath}/${item.file}`, `${deviceFacePath}/${item.file}`);
                    files.push(item.file);
                }
                else if (item.type == "handle" && item.image && !files.includes(item.image)) {
                    await copyFile(`${remoteFacePath}/${item.image}`, `${deviceFacePath}/${item.image}`);
                    files.push(item.image);
                }
            }

            // Save face config file only at the end
            await writeDeviceFile({ path: `${deviceFacePath}/face.json`, content: faceConfigFile.data.asBuffer() })

            toast.success(`Face installed: ${name}`)

            await refetchFaces();
        }
        catch (error) {
            console.error(error);
            toast.error(`Failed to install face: ${name}`)
        }
        showDeviceCommunication(false);
    }, []);

    const deleteFace = React.useCallback(async (name) => {
        showDeviceCommunication(true);
        const path = `${DeviceFacesPath}/${name}`;
        try {
            await deleteDeviceEntry(path);
            toast.success(`Face deleted: ${name}`)

            await refetchFaces();
        }
        catch (error) {
            console.error(error);
            toast.error(`Failed to delete face: ${name}`)
        }
        showDeviceCommunication(false);
    }, []);

    return (
        <>
            {!!remoteFacesList && (
                <Box sx={{ width: "100%", display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: "1em" }}>
                    {remoteFacesList.asText().split("\n").map((name, index) => (
                        <Face
                            key={index}
                            name={name}
                            imageUrl={`${StoreUrl}${RemoteFacesPath}/_previews/${name}_preview.jpg`}
                            isInstalled={deviceFaces?.includes(name) === true}
                            showPreview={setPreviewUrl}
                            installFace={installFace}
                            deleteFace={deleteFace}
                        />
                    ))}
                </Box>
            )}
            {(isRemoteFacesListLoading || isDeviceFacesLoading) && <Box textAlign={"center"} ><CircularProgress /></Box>}
            {previewUrl && <Preview url={previewUrl} onClose={() => setPreviewUrl(null)}></Preview>}
            {isDeviceCommunicating &&
                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            }
        </>
    );
}

export default GenericDigitalFacePanel;
