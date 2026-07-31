import { useEffect, useState } from "react";
import { Box, Button, TextField, Typography, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import DataTable from "../components/DataTable";
import FormDialog from "../components/FormDialog";
import PageHeader from "../components/PageHeader";
import {
  getDeployments,
  createDeployment,
  getDisasters,
} from "../services/api";

const columns = [
  {
    key: "volunteer_name",
    label: "Volunteer",
    render: (v) => <strong>{v}</strong>,
  },
  { key: "camp_name", label: "Camp" },
  { key: "location", label: "Location" },
  { key: "duration_days", label: "Duration (days)", align: "right" },
  {
    key: "timestamp_date",
    label: "Start Date",
    render: (v) => v?.slice(0, 10),
  },
];

const empty = {
  volunteer_name: "",
  duration_days: "",
  timestamp_date: "",
  area: "",
};

export default function Deployments() {
  const [rows, setRows] = useState([]);
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    getDeployments()
      .then((r) => setRows(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    getDisasters()
      .then((r) => setDisasters(r.data))
      .catch(console.error);
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleClose = () => {
    setOpen(false);
    setError("");
    setForm(empty);
  };

  const handleSubmit = () => {
    if (!form.volunteer_name) {
      setError("Volunteer name is required.");
      return;
    }
    setSaving(true);
    createDeployment(form)
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
        title="Deployments"
        subtitle={`${rows.length} volunteer${rows.length !== 1 ? "s" : ""} deployed`}
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            sx={{ mt: 1, mb: 1 }}
          >
            Add Deployment
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        rowKey="volunteer_id"
        emptyMsg="No deployments recorded."
      />

      <FormDialog
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        title="Add Deployment"
        loading={saving}
        error={error}
      >
        <TextField
          label="Volunteer Name *"
          name="volunteer_name"
          value={form.volunteer_name}
          onChange={handleChange}
        />
        <TextField
          label="Duration (days)"
          name="duration_days"
          type="number"
          value={form.duration_days}
          onChange={handleChange}
        />

        <TextField
          select
          label="Disaster Area (optional)"
          name="area"
          value={form.area}
          onChange={handleChange}
        >
          <MenuItem value="">— No area —</MenuItem>
          {disasters.map((d) => (
            <MenuItem key={d.area_id} value={d.area_id}>
              {d.disaster_name} — {d.location} (ID: {d.area_id})
            </MenuItem>
          ))}
        </TextField>

        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mb: 0.5, display: "block" }}
          >
            Start Date
          </Typography>
          <TextField
            name="timestamp_date"
            type="date"
            value={form.timestamp_date}
            onChange={handleChange}
          />
        </Box>
      </FormDialog>
    </Box>
  );
}
