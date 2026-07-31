import { useEffect, useState } from "react";
import {
  Box, Button, Chip, TextField, Stack, LinearProgress, Typography,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from "@mui/material";
import AddIcon  from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

import DataTable  from "../components/DataTable";
import FormDialog from "../components/FormDialog";
import PageHeader from "../components/PageHeader";
import { getShelters, createShelter, updateShelterPop } from "../services/api";

const statusColor = (s) =>
  ({ active: "success", full: "error", closed: "default" }[s?.toLowerCase()] || "info");

const emptyAdd = { camp_name: "", location: "", capacity: "", contact_number: "", status: "Active" };

export default function Camps() {
  const [rows,     setRows]     = useState([]);
  const [loading,  setLoading]  = useState(true);

  // Add camp dialog
  const [addOpen,   setAddOpen]   = useState(false);
  const [addForm,   setAddForm]   = useState(emptyAdd);
  const [addSaving, setAddSaving] = useState(false);
  const [addError,  setAddError]  = useState("");

  // Edit population dialog
  const [selected,    setSelected]    = useState(null);
  const [population,  setPopulation]  = useState("");
  const [editSaving,  setEditSaving]  = useState(false);
  const [editError,   setEditError]   = useState("");

  const load = () => {
    setLoading(true);
    getShelters()
      .then((r) => setRows(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  // ── Add Camp ─────────────────────────────────────────
  const handleAddClose = () => { setAddOpen(false); setAddError(""); setAddForm(emptyAdd); };

  const handleAddSubmit = () => {
    if (!addForm.camp_name) { setAddError("Camp name is required."); return; }
    setAddSaving(true);
    createShelter(addForm)
      .then(() => { handleAddClose(); load(); })
      .catch((err) => setAddError(err.response?.data?.error || err.message || "Failed to save."))
      .finally(() => setAddSaving(false));
  };

  // ── Update Population ─────────────────────────────────
  const openEdit = (row) => {
    setSelected(row);
    setPopulation(row.current_population ?? "");
    setEditError("");
  };

  const handleEditClose = () => { setSelected(null); setEditError(""); };

  const handleEditSubmit = () => {
    if (population === "" || isNaN(population)) { setEditError("Enter a valid number."); return; }
    setEditSaving(true);
    updateShelterPop(selected.camp_id, { current_population: Number(population) })
      .then(() => { handleEditClose(); load(); })
      .catch((err) => setEditError(err.response?.data?.error || "Failed to update."))
      .finally(() => setEditSaving(false));
  };

  const columns = [
    { key: "camp_name",          label: "Camp Name",  render: (v) => <strong>{v}</strong> },
    { key: "location",           label: "Location" },
    { key: "capacity",           label: "Capacity",   align: "right" },
    { key: "current_population", label: "Population", align: "right" },
    {
      key: "current_population",
      label: "Fill %",
      render: (v, row) => {
        const pct = row.capacity ? Math.min(100, Math.round((v / row.capacity) * 100)) : 0;
        return (
          <Box display="flex" alignItems="center" gap={1.5} sx={{ minWidth: 140 }}>
            <LinearProgress
              variant="determinate"
              value={pct}
              color={pct > 90 ? "error" : pct > 70 ? "warning" : "success"}
              sx={{ flex: 1, height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption" fontWeight={600} sx={{ minWidth: 32 }}>
              {pct}%
            </Typography>
          </Box>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (v) => <Chip label={v || "Active"} color={statusColor(v)} size="small" />,
    },
    {
      key: "_actions",
      label: "",
      render: (_, row) => (
        <Button
          size="small"
          startIcon={<EditIcon fontSize="small" />}
          onClick={() => openEdit(row)}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Update
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <PageHeader
        title="Camps & Shelters"
        subtitle={`${rows.length} camp${rows.length !== 1 ? "s" : ""} registered`}
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddOpen(true)}>
            Add Camp
          </Button>
        }
      />

      <DataTable columns={columns} rows={rows} loading={loading} rowKey="camp_id" emptyMsg="No camps found." />

      {/* Add Camp */}
      <FormDialog
        open={addOpen}
        onClose={handleAddClose}
        onSubmit={handleAddSubmit}
        title="Add Camp"
        loading={addSaving}
        error={addError}
      >
        <TextField label="Camp Name *" name="camp_name" value={addForm.camp_name} onChange={(e) => setAddForm({ ...addForm, [e.target.name]: e.target.value })} />
        <TextField label="Location"     name="location"       value={addForm.location}       onChange={(e) => setAddForm({ ...addForm, [e.target.name]: e.target.value })} />
        <TextField label="Capacity"     name="capacity"       type="number" value={addForm.capacity}  onChange={(e) => setAddForm({ ...addForm, [e.target.name]: e.target.value })} />
        <TextField label="Contact"      name="contact_number" value={addForm.contact_number} onChange={(e) => setAddForm({ ...addForm, [e.target.name]: e.target.value })} />
        <TextField label="Status"       name="status"         value={addForm.status}         onChange={(e) => setAddForm({ ...addForm, [e.target.name]: e.target.value })} placeholder="Active / Full / Closed" />
      </FormDialog>

      {/* Update Population */}
      <Dialog open={!!selected} onClose={handleEditClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Update Population — {selected?.camp_name}
        </DialogTitle>
        <DialogContent>
          <Box mt={1}>
            {editError && (
              <Typography color="error" variant="body2" mb={1}>{editError}</Typography>
            )}
            <TextField
              label="Current Population"
              type="number"
              value={population}
              onChange={(e) => setPopulation(e.target.value)}
              inputProps={{ min: 0, max: selected?.capacity }}
              helperText={`Max capacity: ${selected?.capacity}`}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" onClick={handleEditClose}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSubmit} disabled={editSaving}>
            {editSaving ? "Saving…" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
