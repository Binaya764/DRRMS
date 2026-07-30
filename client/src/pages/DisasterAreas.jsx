import { useEffect, useState } from "react";
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, CircularProgress, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack,
} from "@mui/material";
import axios from "axios";

const empty = { name: "", type: "", location: "", start_date: "" };

export default function DisasterAreas() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    axios.get("/api/disaster")
      .then((res) => setRows(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.name || !form.type || !form.location || !form.start_date) {
      setError("All fields are required.");
      return;
    }
    setSaving(true);
    axios.post("/api/disaster", form)
      .then(() => { setOpen(false); setForm(empty); setError(""); load(); })
      .catch((err) => setError(err.response?.data?.error || "Failed to save."))
      .finally(() => setSaving(false));
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Disaster Areas</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Add Disaster</Button>
      </Box>

      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">No records found.</TableCell>
                </TableRow>
              ) : rows.map((row) => (
                <TableRow key={row.event_id} hover>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>{row.start_date?.slice(0, 10)}</TableCell>
                  <TableCell>
                    <Chip label={row.status || "Active"} color="error" size="small" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add Disaster Dialog */}
      <Dialog open={open} onClose={() => { setOpen(false); setError(""); }} fullWidth maxWidth="sm">
        <DialogTitle>Add Disaster</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <TextField label="Name" name="name" value={form.name} onChange={handleChange} />
            <TextField label="Type" name="type" value={form.type} onChange={handleChange}
              placeholder="e.g. Flood, Earthquake" />
            <TextField label="Location" name="location" value={form.location} onChange={handleChange} />
            <TextField label="Start Date" name="start_date" type="date" value={form.start_date}
              onChange={handleChange} InputLabelProps={{ shrink: true }} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => { setOpen(false); setError(""); }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
