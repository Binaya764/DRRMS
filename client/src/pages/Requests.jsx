import { useState } from "react";
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Stack, Chip,
} from "@mui/material";

export default function Requests() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ shelter: "", item: "", quantity: "", priority: "Medium", notes: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.shelter || !form.item || !form.quantity) { setError("Shelter, item and quantity are required."); return; }
    setRows([...rows, { ...form, id: Date.now(), status: "Pending" }]);
    setForm({ shelter: "", item: "", quantity: "", priority: "Medium", notes: "" });
    setOpen(false);
    setError("");
  };

  const priorityColor = (p) => ({ High: "error", Medium: "warning", Low: "info" }[p] || "default");
  const statusColor = (s) => ({ Pending: "warning", Approved: "success", Rejected: "error" }[s] || "default");

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Resource Requests</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>New Request</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {["Shelter / Camp", "Item Requested", "Quantity", "Priority", "Status", "Notes"].map((c) => (
                <TableCell key={c}>{c}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No requests found.</TableCell>
              </TableRow>
            ) : rows.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.shelter}</TableCell>
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

      <Dialog open={open} onClose={() => { setOpen(false); setError(""); }} fullWidth maxWidth="sm">
        <DialogTitle>New Resource Request</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <TextField label="Shelter / Camp Name" name="shelter" value={form.shelter} onChange={handleChange} />
            <TextField label="Item Requested" name="item" value={form.item} onChange={handleChange} />
            <TextField label="Quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} />
            <TextField label="Priority" name="priority" value={form.priority} onChange={handleChange}
              placeholder="High / Medium / Low" />
            <TextField label="Notes" name="notes" value={form.notes} onChange={handleChange}
              multiline rows={2} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => { setOpen(false); setError(""); }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
