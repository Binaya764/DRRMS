import { useEffect, useState } from "react";
import { Box, Typography, Button, Chip, TextField, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import DataTable from "../components/DataTable";
import FormDialog from "../components/FormDialog";
import PageHeader from "../components/PageHeader";
import { getDisasters, createDisaster } from "../services/api";

const severityColor = (s) =>
  ({ Low: "info", Medium: "warning", High: "error", Critical: "error" }[s] || "default");

const empty = { disaster_name: "", disaster_type: "", location: "", severity: "Medium" };

const columns = [
  { key: "disaster_name", label: "Disaster Name", render: (v) => <strong>{v}</strong> },
  { key: "disaster_type", label: "Type" },
  { key: "location",      label: "Location" },
  {
    key: "severity",
    label: "Severity",
    render: (v) => <Chip label={v || "Medium"} color={severityColor(v)} size="small" />,
  },
  {
    key: "status",
    label: "Status",
    render: (v) => <Chip label={v || "Active"} color="error" size="small" />,
  },
];

export default function DisasterAreas() {
  const [rows,    setRows]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [open,    setOpen]    = useState(false);
  const [form,    setForm]    = useState(empty);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");

  const load = () => {
    setLoading(true);
    getDisasters()
      .then((r) => setRows(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleClose = () => { setOpen(false); setError(""); setForm(empty); };

  const handleSubmit = () => {
    if (!form.disaster_name || !form.location) {
      setError("Disaster name and location are required.");
      return;
    }
    setSaving(true);
    createDisaster(form)
      .then(() => { handleClose(); load(); })
      .catch((err) => setError(err.response?.data?.error || "Failed to save."))
      .finally(() => setSaving(false));
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <PageHeader
        title="Disaster Areas"
        subtitle={`${rows.length} active event${rows.length !== 1 ? "s" : ""}`}
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
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
        <TextField label="Disaster Name *" name="disaster_name" value={form.disaster_name} onChange={handleChange} />
        <TextField label="Type" name="disaster_type" value={form.disaster_type} onChange={handleChange} placeholder="Flood, Earthquake, Fire…" />
        <TextField label="Location *" name="location" value={form.location} onChange={handleChange} />
        <TextField label="Severity" name="severity" value={form.severity} onChange={handleChange} placeholder="Low / Medium / High / Critical" />
      </FormDialog>
    </Box>
  );
}
