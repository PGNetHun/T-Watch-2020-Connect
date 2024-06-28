import * as React from "react";
import {
  Box, CircularProgress, Paper, IconButton, TableContainer, Typography, Tooltip,
  Table, TableHead, TableRow, TableBody, TableCell
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useGetKeyVaultKeysQuery, useLazyGetKeyVaultItemQuery, useDeleteKeyVaultItemMutation } from "../../api/deviceApi";
import EditDialog from "./EditDialog";

const _COLUMN_KEY_SX = { width: "30%" };
const _COLUMN_VALUE_SX = { width: "55%", overflowWrap: "anywhere" };
const _COLUMN_BUTTONS_SX = { width: "15%", textAlign: "right" };

function KeyVault() {
  const { data, refetch: refetchKeys, isLoading } = useGetKeyVaultKeysQuery();
  const [trigger] = useLazyGetKeyVaultItemQuery({ refetchOnFocus: false, refetchOnReconnect: false });
  const [deleteKeyVaultItem] = useDeleteKeyVaultItemMutation();
  const [items, setItems] = React.useState([]);
  const [itemKey, setItemKey] = React.useState(null);
  const [isItemNew, setIsItemNew] = React.useState(false);

  React.useEffect(() => {
    if (data) {
      setItems(data.map(createItem));
    }
  }, [data]);

  const createItem = (key) => {
    return {
      key: key,
      value: "",
      showValue: false,
      fetched: false
    }
  }

  const setItem = (key, item) => {
    setItems(items => {
      const copied = [...items];
      const existing = copied.find(x => x.key === key);
      Object.assign(existing, item);
      return copied;
    })
  }

  const refreshValue = (key, item = null) => {
    item = item || items.find(x => x.key === key);
    if (!item) {
      setItems([...items, createItem(key)]);
    }
    trigger(key)
      .unwrap()
      .then(({ value }) => {
        item.value = value;
        item.fetched = true;
        setItem(key, item);
      });
  }

  const setShowValue = (key, showValue) => {
    const item = items.find(x => x.key === key);
    item.showValue = showValue;
    setItem(key, item);
    if (!item.fetched) {
      refreshValue(key, item);
    }
  }

  const openEditDialog = (key, isNew = false) => {
    setIsItemNew(isNew);
    setItemKey(key);
  }

  const onEditDialogClose = (saved, key) => {
    setIsItemNew(false);
    setItemKey(null);
    if (saved) {
      refreshValue(key);
      refetchKeys()
    }
  }

  const deleteItem = async (key) => {
    if (window.confirm(`Delete this item?\r\n"${key}"`)) {
      await deleteKeyVaultItem(key);
      await refetchKeys();
    }
  }

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={_COLUMN_KEY_SX}>Key</TableCell>
              <TableCell sx={_COLUMN_VALUE_SX}>Value</TableCell>
              <TableCell sx={_COLUMN_BUTTONS_SX}>
                <Tooltip title="Refresh list"><IconButton onClick={() => refetchKeys()}><RefreshIcon /></IconButton></Tooltip>
                <Tooltip title="Add new item"><IconButton onClick={() => openEditDialog("", true)}><AddIcon></AddIcon></IconButton></Tooltip>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items?.map(({ key, value, showValue }, index) =>
            (<TableRow key={index}>
              <TableCell sx={_COLUMN_KEY_SX}>{key}</TableCell>
              <TableCell sx={_COLUMN_VALUE_SX}>
                <Typography >{showValue ? value : "************************"}</Typography>
              </TableCell>
              <TableCell sx={_COLUMN_BUTTONS_SX}>
                <Tooltip title="Show / hide value">
                  <IconButton onClick={() => setShowValue(key, !showValue)}>
                    {showValue && <VisibilityOffIcon />}
                    {!showValue && <VisibilityIcon />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit item"><IconButton onClick={() => openEditDialog(key, false)}><EditIcon /></IconButton></Tooltip>
                <Tooltip title="Delete item"><IconButton onClick={() => deleteItem(key)}><DeleteIcon /></IconButton></Tooltip>
              </TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {isLoading && <Box textAlign={"center"} mt={2}><CircularProgress /></Box>}
      {(isItemNew || itemKey) && <EditDialog itemKey={itemKey} isItemNew={isItemNew} onClose={onEditDialogClose}></EditDialog>}
    </Box>
  );
}

export default KeyVault;
