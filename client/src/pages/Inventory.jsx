import { useEffect, useState } from "react";
import {
  Box, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Stack, Chip, Typography, CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import PageHeader from "../components/PageHeader";

const stockColor = (q) => Number(q) > 10 ? "success" : Number(q) > 0 ? "warning" : "error";
const stockLabel = (q) => Number(q) > 10 ? "In Stock" : Number(q) > 0 ? "Low" : "Out of Stock";

export default function Inventory() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen]       = useState(false);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [form, setForm]       = useState({ item: "", category: "", quantity: "", unit: "", location: "", expires: "" });

  const load = () => {
    setLoading(true);
    axios.get("/api/inventory")
      .then(res => setRows(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.item || !form.quantity) { setError("Item and quantity are required."); return; }
    setSaving(true);
    axios.post("/api/inventory", form)
      .then(() => { setOpen(false); setForm({ item: "", category: "", quantity: "", unit: "", location: "", expires: "" }); setError(""); load(); })
      .catch(err => setError(err.response?.data?.error || "Failed to save."))
      .finally(() => setSaving(false));
  };

  return (
    <Box>
      <PageHeader
        title="Inventory"
        subtitle={`${rows.length} item${rows.length !== 1 ? "s" : ""} tracked`}
        action={<Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Add Item</Button>}
      />

      {loading ? <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box> : (
        <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {["Item", "Category", "Quantity", "Unit", "Storage Location", "Expires", "Stock"].map(h => (
                    <TableCell key={h}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow><TableCell colSpan={7} align="center" sx={{ py: 5, color: "#9ca3af" }}>No inventory items found.</TableCell></TableRow>
                ) : rows.map(row => (
                  <TableRow key={row.inventory_id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{row.item}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell align="right">{row.quantity}</TableCell>
                    <TableCell>{row.unit}</TableCell>
                    <TableCell>{row.storage_location}</TableCell>
                    <TableCell>{row.expiry_date?.slice(0, 10)}</TableCell>
                    <TableCell><Chip label={stockLabel(row.quantity)} color={stockColor(row.quantity)} size="small" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Dialog open={open} onClose={() => { setOpen(false); setError(""); }} fullWidth maxWidth="sm">
        <DialogTitle>Add Inventory Item</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <TextField label="Item Name" name="item" value={form.item} onChange={handleChange} />
            <TextField label="Category" name="category" value={form.category} onChange={handleChange} placeholder="Food, Medicine, Equipment..." />
            <Stack direction="row" spacing={2}>
              <TextField label="Quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} />
              <TextField label="Unit" name="unit" value={form.unit} onChange={handleChange} placeholder="kg, pcs, L" />
            </Stack>
            <TextField label="Storage Location" name="location" value={form.location} onChange={handleChange} />
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>Expiry Date</Typography>
              <TextField name="expires" type="date" value={form.expires} onChange={handleChange} />
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
