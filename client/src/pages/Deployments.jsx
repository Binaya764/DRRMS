import { useEffect, useState } from "react";
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Stack, CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

export default function Deployments() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen]       = useState(false);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [form, setForm]       = useState({ volunteer_name: "", duration_days: "", timestamp_date: "", area: "" });

  const load = () => {
    setLoading(true);
    axios.get("/api/deployments").then(r => setRows(r.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.volunteer_name) { setError("Volunteer name is required."); return; }
    setSaving(true);
    axios.post("/api/deployments", form)
      .then(() => { setOpen(false); setForm({ volunteer_name: "", duration_days: "", timestamp_date: "", area: "" }); setError(""); load(); })
      .catch(err => setError(err.response?.data?.error || "Failed to save."))
      .finally(() => setSaving(false));
  };

  if (loading) return (
    <Box sx={{ height: "70vh", display: "flex", justifyContent: "center", alignItems: "center" }}><CircularProgress /></Box>
  );

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>Deployments</Typography>
          <Typography color="text.secondary">{rows.length} volunteer{rows.length !== 1 ? "s" : ""} deployed</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Add Deployment</Button>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {["Volunteer", "Camp", "Location", "Duration (days)", "Start Date"].map(h => <TableCell key={h}>{h}</TableCell>)}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 6, color: "text.secondary" }}>No deployments recorded.</TableCell></TableRow>
              ) : rows.map(row => (
                <TableRow key={row.volunteer_id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{row.volunteer_name}</TableCell>
                  <TableCell>{row.camp_name}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell align="right">{row.duration_days}</TableCell>
                  <TableCell>{row.timestamp_date?.slice(0, 10)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={open} onClose={() => { setOpen(false); setError(""); }} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>Add Deployment</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <TextField label="Volunteer Name" name="volunteer_name" value={form.volunteer_name} onChange={handleChange} />
            <TextField label="Duration (days)" name="duration_days" type="number" value={form.duration_days} onChange={handleChange} />
            <TextField label="Area ID" name="area" type="number" value={form.area} onChange={handleChange} helperText="Area ID from Disaster Areas" />
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>Start Date</Typography>
              <TextField name="timestamp_date" type="date" value={form.timestamp_date} onChange={handleChange} />
            </Box>
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
