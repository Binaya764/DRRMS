import { useState } from "react";
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Stack, Chip,
} from "@mui/material";

export default function Donations() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ donor: "", item: "", quantity: "", unit: "", date: "", status: "Received" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.donor || !form.item || !form.quantity) { setError("Donor, item and quantity are required."); return; }
    setRows([...rows, { ...form, id: Date.now() }]);
    setForm({ donor: "", item: "", quantity: "", unit: "", date: "", status: "Received" });
    setOpen(false);
    setError("");
  };

  const statusColor = (s) => ({ Received: "success", Pending: "warning", Rejected: "error" }[s] || "default");

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Donations</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Add Donation</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {["Donor", "Item", "Quantity", "Unit", "Date", "Status"].map((c) => (
                <TableCell key={c}>{c}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No donations recorded.</TableCell>
              </TableRow>
            ) : rows.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.donor}</TableCell>
                <TableCell>{row.item}</TableCell>
                <TableCell align="right">{row.quantity}</TableCell>
                <TableCell>{row.unit}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell><Chip label={row.status} color={statusColor(row.status)} size="small" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => { setOpen(false); setError(""); }} fullWidth maxWidth="sm">
        <DialogTitle>Add Donation</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <TextField label="Donor Name / Organisation" name="donor" value={form.donor} onChange={handleChange} />
            <TextField label="Item" name="item" value={form.item} onChange={handleChange} />
            <Stack direction="row" spacing={2}>
              <TextField label="Quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} />
              <TextField label="Unit" name="unit" value={form.unit} onChange={handleChange} placeholder="kg, pcs, L" />
            </Stack>
            <TextField label="Date Received" name="date" type="date" value={form.date}
              onChange={handleChange} InputLabelProps={{ shrink: true }} />
            <TextField label="Status" name="status" value={form.status} onChange={handleChange}
              placeholder="Received / Pending / Rejected" />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => { setOpen(false); setError(""); }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
