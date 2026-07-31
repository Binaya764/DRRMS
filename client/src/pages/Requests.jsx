import { useEffect, useState } from "react";
import { Box, Button, Chip, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import DataTable  from "../components/DataTable";
import FormDialog from "../components/FormDialog";
import PageHeader from "../components/PageHeader";
import { getRequests, createRequest } from "../services/api";

const priorityColor = (p) =>
  ({ High: "error", Medium: "warning", Low: "info", EMERGENCY: "error" }[p] || "default");
const statusColor = (s) =>
  ({ Pending: "warning", Approved: "success", Completed: "info", Rejected: "error" }[s] || "default");

const columns = [
  { key: "request_id",    label: "Request ID",  render: (v) => <strong>#{v}</strong> },
  { key: "timestamp",     label: "Date",        render: (v) => v?.slice(0, 10) },
  { key: "priority_level",label: "Priority",    render: (v) => <Chip label={v} color={priorityColor(v)} size="small" /> },
  { key: "status",        label: "Status",      render: (v) => <Chip label={v} color={statusColor(v)}   size="small" /> },
];

const empty = { status: "Pending", priority_level: "Medium" };

export default function Requests() {
  const [rows,    setRows]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [open,    setOpen]    = useState(false);
  const [form,    setForm]    = useState(empty);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");

  const load = () => {
    setLoading(true);
    getRequests()
      .then((r) => setRows(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleClose  = () => { setOpen(false); setError(""); setForm(empty); };

  const handleSubmit = () => {
    setSaving(true);
    createRequest(form)
      .then(() => { handleClose(); load(); })
      .catch((err) => {
        const msg = err.response?.data?.error || err.message || "Failed to save.";
        setError(msg);
      })
      .finally(() => setSaving(false));
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <PageHeader
        title="Resource Requests"
        subtitle={`${rows.length} request${rows.length !== 1 ? "s" : ""}`}
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            New Request
          </Button>
        }
      />

      <DataTable columns={columns} rows={rows} loading={loading} rowKey="request_id" emptyMsg="No requests found." />

      <FormDialog
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        title="New Request"
        submitLabel="Submit"
        loading={saving}
        error={error}
      >
        <TextField label="Priority" name="priority_level" value={form.priority_level} onChange={handleChange} placeholder="Low / Medium / High / EMERGENCY" />
        <TextField label="Status"   name="status"         value={form.status}         onChange={handleChange} placeholder="Pending / Approved / Completed / Rejected" />
      </FormDialog>
    </Box>
  );
}
