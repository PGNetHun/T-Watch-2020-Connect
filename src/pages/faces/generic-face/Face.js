import * as React from "react";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";

const ImageWidth = "150px";
const ImageHeight = "150px";
const ButtonOpacity = "80%";
const ContainerStyle = { position: "relative", width: ImageWidth, height: ImageHeight };
const ThumbnailStyle = { padding: 0, border: 0, cursor: "pointer" };
const ButtonStyle = { position: "absolute", bottom: 5, right: 5, backgroundColor: "white", opacity: ButtonOpacity, borderRadius: 5 };

function FaceComponent({ name, imageUrl, isInstalled, showPreview, installFace, deleteFace }) {
    return (
        <div style={ContainerStyle} >
            <button type="button" style={ThumbnailStyle} onClick={() => showPreview(imageUrl)}>
                <Tooltip title={name}>
                    <img src={imageUrl} width={ImageWidth} height={ImageHeight} loading="lazy"></img>
                </Tooltip>
            </button>
            <div style={ButtonStyle}>
                {!isInstalled &&
                    <Tooltip title="Install face">
                        <IconButton size="small" onClick={async () => await installFace(name)}>
                            <DownloadIcon></DownloadIcon>
                        </IconButton>
                    </Tooltip>
                }
                {isInstalled &&
                    <Tooltip title="Delete face">
                        <IconButton size="small" onClick={async () => await deleteFace(name)}>
                            <DeleteIcon></DeleteIcon>
                        </IconButton>
                    </Tooltip>
                }
            </div>
        </div>
    );
}

export const Face = React.memo(FaceComponent);