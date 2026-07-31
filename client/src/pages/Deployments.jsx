import { useEffect, useState } from "react";
import { Box, Button, TextField, Typography, MenuItem, IconButton, Tooltip } from "@mui/material";
import AddIcon    from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import DataTable     from "../components/DataTable";
import FormDialog    from "../components/FormDialog";
import ConfirmDelete from "../components/ConfirmDelete";
import PageHeader    from "../components/PageHeader";
import { getDeployments, createDeployment, deleteDeployment, getDisasters } from "../services/api";

const empty = { volunteer_name: "", duration_days: "", timestamp_date: "", area: "" };

export default function Deployments() {
  const [rows,      setRows]      = useState([]);
  const [disasters, setDisasters] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [open,      setOpen]      = useState(false);
  const [form,      setForm]      = useState(empty);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,  setDeleting]  = useState(false);

  const load = () => {
    setLoading(true);
    getDeployments()
      .then((r) => setRows(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    getDisasters().then((r) => setDisasters(r.data)).catch(console.error);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleClose  = () => { setOpen(false); setError(""); setForm(empty); };

  const handleSubmit = () => {
    if (!form.volunteer_name) { setError("Volunteer name is required."); return; }
    setSaving(true);
    createDeployment(form)
      .then(() => { handleClose(); load(); })
      .catch((err) => setError(err.response?.data?.error || err.message || "Failed to save."))
      .finally(() => setSaving(false));
  };

  const handleDelete = () => {
    setDeleting(true);
    deleteDeployment(deleteTarget.volunteer_id)
      .then(() => { setDeleteTarget(null); load(); })
      .catch(console.error)
      .finally(() => setDeleting(false));
  };

  const columns = [
    { key: "volunteer_name", label: "Volunteer",       render: (v) => <strong>{v}</strong> },
    { key: "camp_name",      label: "Camp" },
    { key: "location",       label: "Location" },
    { key: "duration_days",  label: "Duration (days)", align: "right" },
    { key: "timestamp_date", label: "Start Date",      render: (v) => v?.slice(0, 10) },
    {
      key: "_actions",
      label: "",
      render: (_, row) => (
        <Tooltip title="Delete">
          <IconButton size="small" color="error" onClick={() => setDeleteTarget(row)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <PageHeader
        title="Deployments"
        subtitle={`${rows.length} volunteer${rows.length !== 1 ? "s" : ""} deployed`}
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            Add Deployment
          </Button>
        }
      />

      <DataTable columns={columns} rows={rows} loading={loading} rowKey="volunteer_id" emptyMsg="No deployments recorded." />

      <FormDialog open={open} onClose={handleClose} onSubmit={handleSubmit} title="Add Deployment" loading={saving} error={error}>
        <TextField label="Volunteer Name *" name="volunteer_name" value={form.volunteer_name} onChange={handleChange} />
        <TextField label="Duration (days)"  name="duration_days"  type="number" value={form.duration_days} onChange={handleChange} />
        <TextField select label="Disaster Area (optional)" name="area" value={form.area} onChange={handleChange}>
          <MenuItem value="">— No area —</MenuItem>
          {disasters.map((d) => (
            <MenuItem key={d.area_id} value={d.area_id}>
              {d.disaster_name} — {d.location} (ID: {d.area_id})
            </MenuItem>
          ))}
        </TextField>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
            Start Date
          </Typography>
          <TextField name="timestamp_date" type="date" value={form.timestamp_date} onChange={handleChange} />
        </Box>
      </FormDialog>

      <ConfirmDelete
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Deployment?"
        message={`"${deleteTarget?.volunteer_name}" will be permanently removed.`}
      />
    </Box>
  );
}
