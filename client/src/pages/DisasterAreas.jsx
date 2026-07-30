import { useEffect, useState } from "react";
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, CircularProgress, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import PageHeader from "../components/PageHeader";

const empty = { name: "", type: "", location: "", start_date: "" };

const headSx = { fontWeight: 700, bgcolor: "#f8fafc", color: "#374151", fontSize: 13 };

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
      setError("All fields are required."); return;
    }
    setSaving(true);
    axios.post("/api/disaster", form)
      .then(() => { setOpen(false); setForm(empty); setError(""); load(); })
      .catch((err) => setError(err.response?.data?.error || "Failed to save."))
      .finally(() => setSaving(false));
  };

  return (
    <Box>
      <PageHeader
        title="Disaster Areas"
        subtitle={`${rows.length} active event${rows.length !== 1 ? "s" : ""}`}
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            Add Disaster
          </Button>
        }
      />

      {loading ? (
        <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box>
      ) : (
        <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {["Name", "Type", "Location", "Start Date", "Status"].map((h) => (
                    <TableCell key={h} sx={headSx}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 5, color: "#9ca3af" }}>
                      No disaster records found.
                    </TableCell>
                  </TableRow>
                ) : rows.map((row) => (
                  <TableRow key={row.event_id} hover sx={{ "&:last-child td": { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 600 }}>{row.name}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.location}</TableCell>
                    <TableCell>{row.start_date?.slice(0, 10)}</TableCell>
                    <TableCell>
                      <Chip label={row.status || "Active"} color="error" size="small"
                        sx={{ fontWeight: 600 }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Dialog open={open} onClose={() => { setOpen(false); setError(""); }} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>Add Disaster</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <TextField label="Name" name="name" value={form.name} onChange={handleChange} />
            <TextField label="Type" name="type" value={form.type} onChange={handleChange}
              placeholder="e.g. Flood, Earthquake" />
            <TextField label="Location" name="location" value={form.location} onChange={handleChange} />
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>Start Date</Typography>
              <TextField name="start_date" type="date" value={form.start_date} onChange={handleChange} />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" onClick={() => { setOpen(false); setError(""); }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
