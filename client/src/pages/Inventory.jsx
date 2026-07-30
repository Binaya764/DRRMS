import { useEffect, useState } from "react";
import {
  Box, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Stack, Chip, Typography, CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import PageHeader from "../components/PageHeader";

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

  return (
    <Box>
      <PageHeader title="Inventory" subtitle={`${rows.length} resource${rows.length !== 1 ? "s" : ""} tracked`}
        action={<Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Add Resource</Button>} />

      {loading ? <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box> : (
        <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {["Resource Name", "Category", "Quantity", "Availability"].map(h => <TableCell key={h}>{h}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow><TableCell colSpan={4} align="center" sx={{ py: 5, color: "#9ca3af" }}>No inventory items found.</TableCell></TableRow>
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
      )}

      <Dialog open={open} onClose={() => { setOpen(false); setError(""); }} fullWidth maxWidth="sm">
        <DialogTitle>Add Resource</DialogTitle>
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
