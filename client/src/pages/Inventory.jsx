import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import DataTable from "../components/DataTable";
import FormDialog from "../components/FormDialog";
import ConfirmDelete from "../components/ConfirmDelete";
import PageHeader from "../components/PageHeader";
import {
  getInventory,
  createInventory,
  deleteInventory,
} from "../services/api";

const stockColor = (q) =>
  Number(q) > 100 ? "success" : Number(q) > 50 ? "warning" : "error";
const stockLabel = (q) =>
  Number(q) > 100 ? "Sufficient" : Number(q) > 50 ? "Moderate" : "Low";

const empty = { resource_name: "", category: "", quantity: "" };

export default function Inventory() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    getInventory()
      .then((r) => setRows(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleClose = () => {
    setOpen(false);
    setError("");
    setForm(empty);
  };

  const handleSubmit = () => {
    if (!form.resource_name || !form.quantity) {
      setError("Resource name and quantity are required.");
      return;
    }
    setSaving(true);
    createInventory(form)
      .then(() => {
        handleClose();
        load();
      })
      .catch((err) =>
        setError(err.response?.data?.error || err.message || "Failed to save."),
      )
      .finally(() => setSaving(false));
  };

  const handleDelete = () => {
    setDeleting(true);
    deleteInventory(deleteTarget.resource_id)
      .then(() => {
        setDeleteTarget(null);
        load();
      })
      .catch(console.error)
      .finally(() => setDeleting(false));
  };

  const columns = [
    {
      key: "resource_name",
      label: "Resource Name",
      render: (v) => <strong>{v}</strong>,
    },
    { key: "category", label: "Category" },
    { key: "quantity", label: "Quantity", align: "right" },
    {
      key: "quantity",
      label: "Availability",
      render: (v) => (
        <Chip label={stockLabel(v)} color={stockColor(v)} size="small" />
      ),
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
        title="Inventory"
        subtitle={`${rows.length} resource${rows.length !== 1 ? "s" : ""} tracked`}
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            sx={{ mb: 1, mt: 1 }}
          >
            Add Resource
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        rowKey="resource_id"
        emptyMsg="No inventory items found."
      />

      <FormDialog
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        title="Add Resource"
        loading={saving}
        error={error}
      >
        <TextField
          label="Resource Name *"
          name="resource_name"
          value={form.resource_name}
          onChange={handleChange}
        />
        <TextField
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Food, Medical, Clothing, Shelter"
        />
        <TextField
          label="Quantity *"
          name="quantity"
          type="number"
          value={form.quantity}
          onChange={handleChange}
        />
      </FormDialog>

      <ConfirmDelete
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Resource?"
        message={`"${deleteTarget?.resource_name}" will be permanently removed from inventory.`}
      />
    </Box>
  );
}
