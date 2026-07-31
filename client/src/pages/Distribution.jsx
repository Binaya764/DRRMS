import { useEffect, useState } from "react";
import { Box, Button, TextField, MenuItem, IconButton, Tooltip } from "@mui/material";
import AddIcon    from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import DataTable     from "../components/DataTable";
import FormDialog    from "../components/FormDialog";
import ConfirmDelete from "../components/ConfirmDelete";
import PageHeader    from "../components/PageHeader";
import {
  getDistributions, createDistribution, deleteDistribution,
  getResources, getShelters, getVictims,
} from "../services/api";

const empty = { victim_id: "", resource_id: "", camp_id: "", quantity_given: "", deployment_by: "" };

export default function Distribution() {
  const [rows,      setRows]      = useState([]);
  const [resources, setResources] = useState([]);
  const [camps,     setCamps]     = useState([]);
  const [victims,   setVictims]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [open,      setOpen]      = useState(false);
  const [form,      setForm]      = useState(empty);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,  setDeleting]  = useState(false);

  const load = () => {
    setLoading(true);
    getDistributions()
      .then((r) => setRows(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    getResources().then((r) => setResources(r.data)).catch(console.error);
    getShelters().then((r)  => setCamps(r.data)).catch(console.error);
    getVictims().then((r)   => setVictims(r.data)).catch(console.error);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleClose  = () => { setOpen(false); setError(""); setForm(empty); };

  const handleSubmit = () => {
    if (!form.resource_id || !form.quantity_given) {
      setError("Resource and quantity are required.");
      return;
    }
    setSaving(true);
    createDistribution(form)
      .then(() => { handleClose(); load(); })
      .catch((err) => setError(err.response?.data?.error || err.message || "Failed to save."))
      .finally(() => setSaving(false));
  };

  const handleDelete = () => {
    setDeleting(true);
    deleteDistribution(deleteTarget.deployment_id)
      .then(() => { setDeleteTarget(null); load(); })
      .catch(console.error)
      .finally(() => setDeleting(false));
  };

  const columns = [
    { key: "deployment_id",  label: "ID",          render: (v) => <strong>{v}</strong> },
    { key: "resource_id",    label: "Resource ID",  align: "right" },
    { key: "camp_id",        label: "Camp ID",      align: "right" },
    { key: "victim_id",      label: "Victim ID",    align: "right" },
    { key: "quantity_given", label: "Qty Given",    align: "right" },
    { key: "deployment_by",  label: "By" },
    { key: "deployment_at",  label: "Date",         render: (v) => v?.slice(0, 10) },
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
        title="Distribution"
        subtitle={`${rows.length} record${rows.length !== 1 ? "s" : ""}`}
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            Record Distribution
          </Button>
        }
      />

      <DataTable columns={columns} rows={rows} loading={loading} rowKey="deployment_id" emptyMsg="No distribution records found." />

      <FormDialog open={open} onClose={handleClose} onSubmit={handleSubmit} title="Record Distribution" loading={saving} error={error}>
        <TextField select label="Resource *" name="resource_id" value={form.resource_id} onChange={handleChange}>
          <MenuItem value="">— Select resource —</MenuItem>
          {resources.map((r) => (
            <MenuItem key={r.resource_id} value={r.resource_id}>
              {r.resource_name} (qty: {r.quantity})
            </MenuItem>
          ))}
        </TextField>
        <TextField label="Quantity Given *" name="quantity_given" type="number" value={form.quantity_given} onChange={handleChange} />
        <TextField select label="Camp (optional)" name="camp_id" value={form.camp_id} onChange={handleChange}>
          <MenuItem value="">— No camp —</MenuItem>
          {camps.map((c) => (
            <MenuItem key={c.camp_id} value={c.camp_id}>
              {c.camp_name} (ID: {c.camp_id})
            </MenuItem>
          ))}
        </TextField>
        <TextField select label="Victim (optional)" name="victim_id" value={form.victim_id} onChange={handleChange}>
          <MenuItem value="">— No victim —</MenuItem>
          {victims.map((v) => (
            <MenuItem key={v.victim_id} value={v.victim_id}>
              {v.victim_name} — {v.full_name} (ID: {v.victim_id})
            </MenuItem>
          ))}
        </TextField>
        <TextField label="Deployed By" name="deployment_by" value={form.deployment_by} onChange={handleChange} />
      </FormDialog>

      <ConfirmDelete
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Distribution Record?"
        message={`Distribution #${deleteTarget?.deployment_id} will be permanently removed.`}
      />
    </Box>
  );
}
