import { useState } from "react";
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Stack, Chip,
} from "@mui/material";

export default function Distribution() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ shelter: "", item: "", quantity: "", unit: "", date: "", distributed_by: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.shelter || !form.item || !form.quantity) { setError("Shelter, item and quantity are required."); return; }
    setRows([...rows, { ...form, id: Date.now(), status: "Distributed" }]);
    setForm({ shelter: "", item: "", quantity: "", unit: "", date: "", distributed_by: "" });
    setOpen(false);
    setError("");
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Distribution</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Record Distribution</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {["Shelter / Camp", "Item", "Quantity", "Unit", "Date", "Distributed By", "Status"].map((c) => (
                <TableCell key={c}>{c}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No distribution records found.</TableCell>
              </TableRow>
            ) : rows.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.shelter}</TableCell>
                <TableCell>{row.item}</TableCell>
                <TableCell align="right">{row.quantity}</TableCell>
                <TableCell>{row.unit}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.distributed_by}</TableCell>
                <TableCell><Chip label={row.status} color="success" size="small" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => { setOpen(false); setError(""); }} fullWidth maxWidth="sm">
        <DialogTitle>Record Distribution</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <TextField label="Shelter / Camp" name="shelter" value={form.shelter} onChange={handleChange} />
            <TextField label="Item" name="item" value={form.item} onChange={handleChange} />
            <Stack direction="row" spacing={2}>
              <TextField label="Quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} />
              <TextField label="Unit" name="unit" value={form.unit} onChange={handleChange} placeholder="kg, pcs, L" />
            </Stack>
            <TextField label="Date" name="date" type="date" value={form.date}
              onChange={handleChange} InputLabelProps={{ shrink: true }} />
            <TextField label="Distributed By" name="distributed_by" value={form.distributed_by} onChange={handleChange} />
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
