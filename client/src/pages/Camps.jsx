import { useEffect, useState } from "react";
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, CircularProgress, LinearProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

const statusColor = (s) => ({ active: "success", full: "error", closed: "default" }[s?.toLowerCase()] || "info");

export default function Camps() {
  const [rows, setRows]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [population, setPopulation] = useState("");
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");

  // Add camp state
  const [addOpen, setAddOpen]   = useState(false);
  const [addForm, setAddForm]   = useState({ camp_name: "", location: "", capacity: "", contact_number: "", status: "Active" });
  const [addError, setAddError] = useState("");
  const [addSaving, setAddSaving] = useState(false);

  const load = () => {
    setLoading(true);
    axios.get("/api/shelter").then(r => setRows(r.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openEdit = (row) => { setSelected(row); setPopulation(row.current_population ?? ""); setError(""); };

  const handleUpdate = () => {
    if (population === "" || isNaN(population)) { setError("Enter a valid number."); return; }
    setSaving(true);
    axios.post(`/api/shelter/${selected.camp_id}`, { current_population: Number(population) })
      .then(() => { setSelected(null); load(); })
      .catch(err => setError(err.response?.data?.error || "Failed to update."))
      .finally(() => setSaving(false));
  };

  const handleAddCamp = () => {
    if (!addForm.camp_name) { setAddError("Camp name is required."); return; }
    setAddSaving(true);
    axios.post("/api/shelter", addForm)
      .then(() => { setAddOpen(false); setAddForm({ camp_name: "", location: "", capacity: "", contact_number: "", status: "Active" }); setAddError(""); load(); })
      .catch(err => setAddError(err.response?.data?.error || "Failed to save."))
      .finally(() => setAddSaving(false));
  };

  if (loading) return (
    <Box sx={{ height: "70vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>Camps & Shelters</Typography>
          <Typography color="text.secondary">{rows.length} camp{rows.length !== 1 ? "s" : ""} registered</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddOpen(true)}>Add Camp</Button>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {["Camp Name", "Location", "Capacity", "Population", "Fill %", "Status", ""].map((h, i) => (
                  <TableCell key={i}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6, color: "text.secondary" }}>No camps found.</TableCell></TableRow>
              ) : rows.map(row => {
                const pct = row.capacity ? Math.min(100, Math.round((row.current_population / row.capacity) * 100)) : 0;
                return (
                  <TableRow key={row.camp_id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{row.camp_name}</TableCell>
                    <TableCell>{row.location}</TableCell>
                    <TableCell align="right">{row.capacity}</TableCell>
                    <TableCell align="right">{row.current_population}</TableCell>
                    <TableCell sx={{ minWidth: 150 }}>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <LinearProgress variant="determinate" value={pct}
                          color={pct > 90 ? "error" : pct > 70 ? "warning" : "success"}
                          sx={{ flex: 1, height: 8, borderRadius: 4 }} />
                        <Typography variant="caption" fontWeight={600} sx={{ minWidth: 32 }}>{pct}%</Typography>
                      </Box>
                    </TableCell>
                    <TableCell><Chip label={row.status || "Active"} color={statusColor(row.status)} size="small" /></TableCell>
                    <TableCell>
                      <Button size="small" startIcon={<EditIcon fontSize="small" />}
                        onClick={() => openEdit(row)} variant="outlined" sx={{ borderRadius: 2 }}>
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add Camp Dialog */}
      <Dialog open={addOpen} onClose={() => { setAddOpen(false); setAddError(""); }} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>Add Camp</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {addError && <Typography color="error" variant="body2">{addError}</Typography>}
            <TextField label="Camp Name" name="camp_name" value={addForm.camp_name} onChange={e => setAddForm({ ...addForm, [e.target.name]: e.target.value })} />
            <TextField label="Location" name="location" value={addForm.location} onChange={e => setAddForm({ ...addForm, [e.target.name]: e.target.value })} />
            <TextField label="Capacity" name="capacity" type="number" value={addForm.capacity} onChange={e => setAddForm({ ...addForm, [e.target.name]: e.target.value })} />
            <TextField label="Contact Number" name="contact_number" value={addForm.contact_number} onChange={e => setAddForm({ ...addForm, [e.target.name]: e.target.value })} />
            <TextField label="Status" name="status" value={addForm.status} onChange={e => setAddForm({ ...addForm, [e.target.name]: e.target.value })} placeholder="Active / Full / Closed" />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" onClick={() => { setAddOpen(false); setAddError(""); }}>Cancel</Button>
          <Button variant="contained" onClick={handleAddCamp} disabled={addSaving}>{addSaving ? "Saving..." : "Save"}</Button>
        </DialogActions>
      </Dialog>

      {/* Update Population Dialog */}
      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Update Population — {selected?.camp_name}</DialogTitle>
        <DialogContent>
          <Box mt={1}>
            {error && <Typography color="error" variant="body2" mb={1}>{error}</Typography>}
            <TextField label="Current Population" type="number" value={population}
              onChange={e => setPopulation(e.target.value)}
              inputProps={{ min: 0, max: selected?.capacity }}
              helperText={`Max capacity: ${selected?.capacity}`} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" onClick={() => setSelected(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
