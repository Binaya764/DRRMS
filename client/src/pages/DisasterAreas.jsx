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
import { getDisasters, createDisaster, deleteDisaster } from "../services/api";

const severityColor = (s) =>
  ({ Low: "info", Medium: "warning", High: "error", Critical: "error" })[s] ||
  "default";

const empty = {
  disaster_name: "",
  disaster_type: "",
  location: "",
  severity: "Medium",
};

export default function DisasterAreas() {
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
    getDisasters()
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
    if (!form.disaster_name || !form.location) {
      setError("Disaster name and location are required.");
      return;
    }
    setSaving(true);
    createDisaster(form)
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
    deleteDisaster(deleteTarget.area_id)
      .then(() => {
        setDeleteTarget(null);
        load();
      })
      .catch((err) => console.error(err))
      .finally(() => setDeleting(false));
  };

  const columns = [
    {
      key: "disaster_name",
      label: "Disaster Name",
      render: (v) => <strong>{v}</strong>,
    },
    { key: "disaster_type", label: "Type" },
    { key: "location", label: "Location" },
    {
      key: "severity",
      label: "Severity",
      render: (v) => (
        <Chip label={v || "Medium"} color={severityColor(v)} size="small" />
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (v) => <Chip label={v || "Active"} color="error" size="small" />,
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
        title="Disaster Areas"
        subtitle={`${rows.length} active event${rows.length !== 1 ? "s" : ""}`}
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            sx={{ mb: 1, mt: 1 }}
          >
            Add Disaster
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        rowKey="area_id"
        emptyMsg="No disaster records found."
      />

      <FormDialog
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        title="Add Disaster"
        loading={saving}
        error={error}
      >
        <TextField
          label="Disaster Name *"
          name="disaster_name"
          value={form.disaster_name}
          onChange={handleChange}
        />
        <TextField
          label="Type"
          name="disaster_type"
          value={form.disaster_type}
          onChange={handleChange}
          placeholder="Flood, Earthquake, Fire…"
        />
        <TextField
          label="Location *"
          name="location"
          value={form.location}
          onChange={handleChange}
        />
        <TextField
          label="Severity"
          name="severity"
          value={form.severity}
          onChange={handleChange}
          placeholder="Low / Medium / High / Critical"
        />
      </FormDialog>

      <ConfirmDelete
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Disaster Area?"
        message={`"${deleteTarget?.disaster_name}" will be permanently removed.`}
      />
    </Box>
  );
}
