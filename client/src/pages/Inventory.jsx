import { useState } from "react";
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Stack, Chip,
} from "@mui/material";

export default function Inventory() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ item: "", category: "", quantity: "", unit: "", location: "", expires: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.item || !form.quantity) { setError("Item and quantity are required."); return; }
    setRows([...rows, { ...form, id: Date.now() }]);
    setForm({ item: "", category: "", quantity: "", unit: "", location: "", expires: "" });
    setOpen(false);
    setError("");
  };

  const stockColor = (q) => Number(q) > 10 ? "success" : Number(q) > 0 ? "warning" : "error";
  const stockLabel = (q) => Number(q) > 10 ? "In Stock" : Number(q) > 0 ? "Low" : "Out";

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Inventory</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Add Item</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {["Item", "Category", "Quantity", "Unit", "Storage Location", "Expires", "Stock"].map((c) => (
                <TableCell key={c}>{c}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No inventory items found.</TableCell>
              </TableRow>
            ) : rows.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.item}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell align="right">{row.quantity}</TableCell>
                <TableCell>{row.unit}</TableCell>
                <TableCell>{row.location}</TableCell>
                <TableCell>{row.expires}</TableCell>
                <TableCell>
                  <Chip label={stockLabel(row.quantity)} color={stockColor(row.quantity)} size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => { setOpen(false); setError(""); }} fullWidth maxWidth="sm">
        <DialogTitle>Add Inventory Item</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <TextField label="Item Name" name="item" value={form.item} onChange={handleChange} />
            <TextField label="Category" name="category" value={form.category} onChange={handleChange}
              placeholder="Food, Medicine, Equipment..." />
            <Stack direction="row" spacing={2}>
              <TextField label="Quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} />
              <TextField label="Unit" name="unit" value={form.unit} onChange={handleChange} placeholder="kg, pcs, L" />
            </Stack>
            <TextField label="Storage Location" name="location" value={form.location} onChange={handleChange} />
            <TextField label="Expiry Date" name="expires" type="date" value={form.expires}
              onChange={handleChange} InputLabelProps={{ shrink: true }} />
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
