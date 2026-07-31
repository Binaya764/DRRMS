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
import { getRequests, createRequest, deleteRequest } from "../services/api";

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

const empty = { status: "Pending", priority_level: "Medium" };

export default function Requests() {
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
    getRequests()
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
    setSaving(true);
    createRequest(form)
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
    deleteRequest(deleteTarget.request_id)
      .then(() => {
        setDeleteTarget(null);
        load();
      })
      .catch(console.error)
      .finally(() => setDeleting(false));
  };

  const columns = [
    {
      key: "request_id",
      label: "Request ID",
      render: (v) => <strong>#{v}</strong>,
    },
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

      <FormDialog
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        title="New Request"
        submitLabel="Submit"
        loading={saving}
        error={error}
      >
        <TextField
          label="Priority"
          name="priority_level"
          value={form.priority_level}
          onChange={handleChange}
          placeholder="Low / Medium / High / EMERGENCY"
        />
        <TextField
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          placeholder="Pending / Approved / Completed / Rejected"
        />
      </FormDialog>

      <ConfirmDelete
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Request?"
        message={`Request #${deleteTarget?.request_id} will be permanently removed.`}
      />
    </Box>
  );
}
