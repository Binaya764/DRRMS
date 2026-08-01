import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Stack,
  MenuItem,
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
  getVictims,
  createVictim,
  deleteVictim,
  getShelters,
} from "../services/api";

const empty = {
  victim_name: "",
  full_name: "",
  age: "",
  gender: "",
  phone_number: "",
  camp_id: "",
};

export default function Victims() {
  const [rows, setRows] = useState([]);
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    getVictims()
      .then((r) => setRows(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    getShelters()
      .then((r) => setCamps(r.data))
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
    if (!form.victim_name) {
      setError("Victim name is required.");
      return;
    }
    setSaving(true);
    createVictim(form)
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
    deleteVictim(deleteTarget.victim_id)
      .then(() => {
        setDeleteTarget(null);
        load();
      })
      .catch(console.error)
      .finally(() => setDeleting(false));
  };

  const columns = [
    {
      key: "victim_name",
      label: "Short Name",
      render: (v) => <strong>{v}</strong>,
    },
    { key: "full_name", label: "Full Name" },
    { key: "age", label: "Age", align: "right" },
    { key: "gender", label: "Gender" },
    { key: "phone_number", label: "Phone" },
    { key: "camp_id", label: "Camp ID", align: "right" },
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
        title="Victims"
        subtitle={`${rows.length} record${rows.length !== 1 ? "s" : ""}`}
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            sx={{ mb: 1, mt: 1 }}
          >
            Add Victim
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        rowKey="victim_id"
        emptyMsg="No victims recorded."
      />

      <FormDialog
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        title="Add Victim"
        loading={saving}
        error={error}
      >
        <TextField
          label="Short Name *"
          name="victim_name"
          value={form.victim_name}
          onChange={handleChange}
        />
        <TextField
          label="Full Name"
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
        />
        <Stack direction="row" spacing={2}>
          <TextField
            label="Age"
            name="age"
            type="number"
            value={form.age}
            onChange={handleChange}
          />
          <TextField
            label="Gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            placeholder="Male / Female / Other"
          />
        </Stack>
        <TextField
          label="Phone Number"
          name="phone_number"
          value={form.phone_number}
          onChange={handleChange}
        />
        <TextField
          select
          label="Assign to Camp (optional)"
          name="camp_id"
          value={form.camp_id}
          onChange={handleChange}
        >
          <MenuItem value="">— No camp —</MenuItem>
          {camps.map((c) => (
            <MenuItem key={c.camp_id} value={c.camp_id}>
              {c.camp_name} (ID: {c.camp_id})
            </MenuItem>
          ))}
        </TextField>
      </FormDialog>

      <ConfirmDelete
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Victim?"
        message={`"${deleteTarget?.victim_name}" will be permanently removed.`}
      />
    </Box>
  );
}
