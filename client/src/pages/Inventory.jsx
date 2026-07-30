import { useEffect, useState } from "react";
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Stack, Chip, CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

const stockColor = (q) => Number(q) > 100 ? "success" : Number(q) > 50 ? "warning" : "error";
const stockLabel = (q) => Number(q) > 100 ? "Sufficient" : Number(q) > 50 ? "Moderate" : "Low";

export default function Inventory() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen]       = useState(false);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [form, setForm]       = useState({ resource_name: "", category: "", quantity: "" });

  const load = () => {
    setLoading(true);
    axios.get("/api/inventory").then(r => setRows(r.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.resource_name || !form.quantity) { setError("Resource name and quantity are required."); return; }
    setSaving(true);
    axios.post("/api/inventory", form)
      .then(() => { setOpen(false); setForm({ resource_name: "", category: "", quantity: "" }); setError(""); load(); })
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
          <Typography variant="h4" fontWeight={700}>Inventory</Typography>
          <Typography color="text.secondary">{rows.length} resource{rows.length !== 1 ? "s" : ""} tracked</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Add Resource</Button>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {["Resource Name", "Category", "Quantity", "Availability"].map(h => <TableCell key={h}>{h}</TableCell>)}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow><TableCell colSpan={4} align="center" sx={{ py: 6, color: "text.secondary" }}>No inventory items found.</TableCell></TableRow>
              ) : rows.map(row => (
                <TableRow key={row.resource_id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{row.resource_name}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell align="right">{row.quantity}</TableCell>
                  <TableCell><Chip label={stockLabel(row.quantity)} color={stockColor(row.quantity)} size="small" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={open} onClose={() => { setOpen(false); setError(""); }} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>Add Resource</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <TextField label="Resource Name" name="resource_name" value={form.resource_name} onChange={handleChange} />
            <TextField label="Category" name="category" value={form.category} onChange={handleChange} placeholder="Food, Medical, Clothing, Shelter" />
            <TextField label="Quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} />
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
