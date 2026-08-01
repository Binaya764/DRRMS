import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";

import DataTable from "../components/DataTable";
import FormDialog from "../components/FormDialog";
import ConfirmDelete from "../components/ConfirmDelete";
import PageHeader from "../components/PageHeader";
import {
  getRequests,
  createRequest,
  deleteRequest,
  getInventory,
} from "../services/api";

const priorityColor = (p) =>
  ({ High: "error", Medium: "warning", Low: "info", EMERGENCY: "error" })[p] ||
  "default";
const statusColor = (s) =>
  ({
    Pending: "warning",
    Approved: "success",
    Completed: "info",
    Rejected: "error",
  })[s] || "default";

const emptyForm = { status: "Pending", priority_level: "Medium" };
const emptyItem = { resource_id: "", quantity_requested: "" };

export default function Requests() {
  const [rows, setRows] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [items, setItems] = useState([{ ...emptyItem }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    getRequests()
      .then((r) => setRows(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    getInventory()
      .then((r) => setResources(r.data))
      .catch(console.error);
  }, []);

  // ── Form handlers ──────────────────────────────────────
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleClose = () => {
    setOpen(false);
    setError("");
    setForm(emptyForm);
    setItems([{ ...emptyItem }]);
  };

  // ── Item row handlers ──────────────────────────────────
  const handleItemChange = (index, field, value) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    setItems(updated);
  };

  const addItemRow = () => setItems([...items, { ...emptyItem }]);

  const removeItemRow = (index) => {
    if (items.length === 1) return; // keep at least one row
    setItems(items.filter((_, i) => i !== index));
  };

  // ── Submit ─────────────────────────────────────────────
  const handleSubmit = () => {
    const validItems = items.filter(
      (i) => i.resource_id && i.quantity_requested,
    );
    if (validItems.length === 0) {
      setError("Add at least one item with a resource and quantity.");
      return;
    }
    setSaving(true);
    createRequest({ ...form, items: validItems })
      .then(() => {
        handleClose();
        load();
      })
      .catch((err) =>
        setError(err.response?.data?.error || err.message || "Failed to save."),
      )
      .finally(() => setSaving(false));
  };

  // ── Delete ─────────────────────────────────────────────
  const handleDelete = () => {
    setDeleting(true);
    deleteRequest(deleteTarget.request_id)
      .then(() => {
        setDeleteTarget(null);
        load();
      })
      .catch(console.error)
      .finally(() => setDeleting(false));
  };

  // ── Table columns ──────────────────────────────────────
  const columns = [
    { key: "request_id", label: "ID", render: (v) => <strong>#{v}</strong> },
    { key: "timestamp", label: "Date", render: (v) => v?.slice(0, 10) },
    {
      key: "priority_level",
      label: "Priority",
      render: (v) => <Chip label={v} color={priorityColor(v)} size="small" />,
    },
    {
      key: "status",
      label: "Status",
      render: (v) => <Chip label={v} color={statusColor(v)} size="small" />,
    },
    {
      key: "items",
      label: "Requested Items",
      render: (items) => {
        if (!items || items.length === 0)
          return (
            <Typography variant="body2" color="text.disabled">
              —
            </Typography>
          );
        return (
          <Stack spacing={0.5}>
            {items.map((item, i) => (
              <Chip
                key={i}
                label={`${item.resource_name || `Resource #${item.resource_id}`} × ${item.quantity_requested}`}
                size="small"
                variant="outlined"
                color="primary"
              />
            ))}
          </Stack>
        );
      },
    },
    {
      key: "_actions",
      label: "",
      render: (_, row) => (
        <Tooltip title="Delete">
          <IconButton
            size="small"
            color="error"
            onClick={() => setDeleteTarget(row)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <PageHeader
        title="Resource Requests"
        subtitle={`${rows.length} request${rows.length !== 1 ? "s" : ""}`}
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            sx={{ mb: 1, mt: 1 }}
          >
            New Request
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        rowKey="request_id"
        emptyMsg="No requests found."
      />

      {/* New Request Dialog */}
      <FormDialog
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        title="New Resource Request"
        submitLabel="Submit Request"
        loading={saving}
        error={error}
        maxWidth="md"
      >
        {/* Priority and Status */}
        <Stack direction="row" spacing={2}>
          <TextField
            select
            label="Priority"
            name="priority_level"
            value={form.priority_level}
            onChange={handleChange}
            sx={{ flex: 1 }}
          >
            {["Low", "Medium", "High", "EMERGENCY"].map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            sx={{ flex: 1 }}
          >
            {["Pending", "Approved", "Completed", "Rejected"].map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <Divider>
          <Typography variant="caption" color="text.secondary">
            Requested Items
          </Typography>
        </Divider>

        {/* Item rows */}
        {items.map((item, index) => (
          <Stack key={index} direction="row" spacing={1.5} alignItems="center">
            <TextField
              select
              label="Resource *"
              value={item.resource_id}
              onChange={(e) =>
                handleItemChange(index, "resource_id", e.target.value)
              }
              sx={{ flex: 2 }}
            >
              <MenuItem value="">— Select resource —</MenuItem>
              {resources.map((r) => (
                <MenuItem key={r.resource_id} value={r.resource_id}>
                  {r.resource_name} ({r.category}) — stock: {r.quantity}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Quantity *"
              type="number"
              value={item.quantity_requested}
              onChange={(e) =>
                handleItemChange(index, "quantity_requested", e.target.value)
              }
              sx={{ flex: 1 }}
              inputProps={{ min: 1 }}
            />

            <Tooltip title="Remove item">
              <span>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => removeItemRow(index)}
                  disabled={items.length === 1}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        ))}

        {/* Add another item */}
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
          onClick={addItemRow}
          sx={{ alignSelf: "flex-start" }}
        >
          Add Another Item
        </Button>
      </FormDialog>

      {/* Confirm Delete */}
      <ConfirmDelete
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Request?"
        message={`Request #${deleteTarget?.request_id} and all its items will be permanently removed.`}
      />
    </Box>
  );
}
