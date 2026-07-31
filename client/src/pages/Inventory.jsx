import { useEffect, useState } from "react";
import { Box, Button, Chip, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import DataTable from "../components/DataTable";
import FormDialog from "../components/FormDialog";
import PageHeader from "../components/PageHeader";
import { getInventory, createInventory } from "../services/api";

const stockColor = (q) =>
  Number(q) > 100 ? "success" : Number(q) > 50 ? "warning" : "error";
const stockLabel = (q) =>
  Number(q) > 100 ? "Sufficient" : Number(q) > 50 ? "Moderate" : "Low";

const empty = { resource_name: "", category: "", quantity: "" };

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
];

export default function Inventory() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
      .catch((err) => {
        const msg =
          err.response?.data?.error || err.message || "Failed to save.";
        setError(msg);
      })
      .finally(() => setSaving(false));
  };

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
            sx={{ mt: 1, mb: 1 }}
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
    </Box>
  );
}
