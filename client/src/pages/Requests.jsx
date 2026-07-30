import { useEffect, useState } from "react";
import {
  Box, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Stack, Chip, Typography, CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import PageHeader from "../components/PageHeader";

const priorityColor = (p) => ({ High: "error", Medium: "warning", Low: "info", EMERGENCY: "error" }[p] || "default");
const statusColor   = (s) => ({ Pending: "warning", Approved: "success", Completed: "info", Rejected: "error" }[s] || "default");

export default function Requests() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen]       = useState(false);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [form, setForm]       = useState({ status: "Pending", priority_level: "Medium" });

  const load = () => {
    setLoading(true);
    axios.get("/api/requests").then(r => setRows(r.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    setSaving(true);
    axios.post("/api/requests", form)
      .then(() => { setOpen(false); setForm({ status: "Pending", priority_level: "Medium" }); setError(""); load(); })
      .catch(err => setError(err.response?.data?.error || "Failed to save."))
      .finally(() => setSaving(false));
  };

  return (
    <Box>
      <PageHeader title="Resource Requests" subtitle={`${rows.length} request${rows.length !== 1 ? "s" : ""}`}
        action={<Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>New Request</Button>} />

      {loading ? <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box> : (
        <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {["Request ID", "Date", "Priority", "Status"].map(h => <TableCell key={h}>{h}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow><TableCell colSpan={4} align="center" sx={{ py: 5, color: "#9ca3af" }}>No requests found.</TableCell></TableRow>
                ) : rows.map(row => (
                  <TableRow key={row.request_id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{row.request_id}</TableCell>
                    <TableCell>{row.timestamp?.slice(0, 10)}</TableCell>
                    <TableCell><Chip label={row.priority_level} color={priorityColor(row.priority_level)} size="small" /></TableCell>
                    <TableCell><Chip label={row.status} color={statusColor(row.status)} size="small" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Dialog open={open} onClose={() => { setOpen(false); setError(""); }} fullWidth maxWidth="sm">
        <DialogTitle>New Request</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <TextField label="Priority" name="priority_level" value={form.priority_level} onChange={handleChange} placeholder="Low / Medium / High / EMERGENCY" />
            <TextField label="Status" name="status" value={form.status} onChange={handleChange} placeholder="Pending / Approved / Completed / Rejected" />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" onClick={() => { setOpen(false); setError(""); }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={saving}>{saving ? "Saving..." : "Submit"}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
