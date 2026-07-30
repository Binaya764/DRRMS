import { useEffect, useState } from "react";
import {
  Box, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Stack, Chip, Typography, CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import PageHeader from "../components/PageHeader";

const priorityColor = (p) => ({ High: "error", Medium: "warning", Low: "info" }[p] || "default");
const statusColor   = (s) => ({ Pending: "warning", Approved: "success", Rejected: "error" }[s] || "default");

export default function Requests() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen]       = useState(false);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [form, setForm]       = useState({ shelter: "", item: "", quantity: "", priority: "Medium", notes: "" });

  const load = () => {
    setLoading(true);
    axios.get("/api/requests")
      .then(res => setRows(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.shelter || !form.item || !form.quantity) { setError("Shelter, item and quantity are required."); return; }
    setSaving(true);
    axios.post("/api/requests", form)
      .then(() => { setOpen(false); setForm({ shelter: "", item: "", quantity: "", priority: "Medium", notes: "" }); setError(""); load(); })
      .catch(err => setError(err.response?.data?.error || "Failed to save."))
      .finally(() => setSaving(false));
  };

  return (
    <Box>
      <PageHeader
        title="Resource Requests"
        subtitle={`${rows.length} request${rows.length !== 1 ? "s" : ""}`}
        action={<Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>New Request</Button>}
      />

      {loading ? <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box> : (
        <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {["Shelter / Camp", "Item", "Quantity", "Priority", "Status", "Notes"].map(h => (
                    <TableCell key={h}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 5, color: "#9ca3af" }}>No requests found.</TableCell></TableRow>
                ) : rows.map(row => (
                  <TableRow key={row.request_id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{row.shelter}</TableCell>
                    <TableCell>{row.item}</TableCell>
                    <TableCell align="right">{row.quantity}</TableCell>
                    <TableCell><Chip label={row.priority} color={priorityColor(row.priority)} size="small" /></TableCell>
                    <TableCell><Chip label={row.status} color={statusColor(row.status)} size="small" /></TableCell>
                    <TableCell>{row.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Dialog open={open} onClose={() => { setOpen(false); setError(""); }} fullWidth maxWidth="sm">
        <DialogTitle>New Resource Request</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <TextField label="Shelter / Camp Name" name="shelter" value={form.shelter} onChange={handleChange} />
            <TextField label="Item Requested" name="item" value={form.item} onChange={handleChange} />
            <TextField label="Quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} />
            <TextField label="Priority" name="priority" value={form.priority} onChange={handleChange} placeholder="High / Medium / Low" />
            <TextField label="Notes" name="notes" value={form.notes} onChange={handleChange} multiline rows={2} />
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
