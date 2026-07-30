import { useEffect, useState } from "react";
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, CircularProgress, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import PageHeader from "../components/PageHeader";

const empty = { disaster_name: "", disaster_type: "", location: "", severity: "Medium" };
const severityColor = (s) => ({ Low: "info", Medium: "warning", High: "error", Critical: "error" }[s] || "default");

export default function DisasterAreas() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen]       = useState(false);
  const [form, setForm]       = useState(empty);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");

  const load = () => {
    setLoading(true);
    axios.get("/api/disaster").then(r => setRows(r.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.disaster_name || !form.location) { setError("Name and location are required."); return; }
    setSaving(true);
    axios.post("/api/disaster", form)
      .then(() => { setOpen(false); setForm(empty); setError(""); load(); })
      .catch(err => setError(err.response?.data?.error || "Failed to save."))
      .finally(() => setSaving(false));
  };

  return (
    <Box>
      <PageHeader
        title="Disaster Areas"
        subtitle={`${rows.length} active event${rows.length !== 1 ? "s" : ""}`}
        action={<Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Add Disaster</Button>}
      />

      {loading ? <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box> : (
        <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {["Name", "Type", "Location", "Severity", "Status"].map(h => <TableCell key={h}>{h}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow><TableCell colSpan={5} align="center" sx={{ py: 5, color: "#9ca3af" }}>No disaster records found.</TableCell></TableRow>
                ) : rows.map(row => (
                  <TableRow key={row.area_id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{row.disaster_name}</TableCell>
                    <TableCell>{row.disaster_type}</TableCell>
                    <TableCell>{row.location}</TableCell>
                    <TableCell><Chip label={row.severity} color={severityColor(row.severity)} size="small" /></TableCell>
                    <TableCell><Chip label={row.status || "Active"} color="error" size="small" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Dialog open={open} onClose={() => { setOpen(false); setError(""); }} fullWidth maxWidth="sm">
        <DialogTitle>Add Disaster</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <TextField label="Disaster Name" name="disaster_name" value={form.disaster_name} onChange={handleChange} />
            <TextField label="Type" name="disaster_type" value={form.disaster_type} onChange={handleChange} placeholder="Flood, Earthquake, Fire..." />
            <TextField label="Location" name="location" value={form.location} onChange={handleChange} />
            <TextField label="Severity" name="severity" value={form.severity} onChange={handleChange} placeholder="Low / Medium / High / Critical" />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" onClick={() => { setOpen(false); setError(""); }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
