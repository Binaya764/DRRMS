import { useState } from "react";
import {
  Box, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Stack, Chip, Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PageHeader from "../components/PageHeader";

const headSx = { fontWeight: 700, bgcolor: "#f8fafc", color: "#374151", fontSize: 13 };
const statusColor = (s) => ({ Received: "success", Pending: "warning", Rejected: "error" }[s] || "default");

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
    setOpen(false); setError("");
  };

  return (
    <Box>
      <PageHeader
        title="Donations"
        subtitle={`${rows.length} donation${rows.length !== 1 ? "s" : ""} recorded`}
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            Add Donation
          </Button>
        }
      />

      <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {["Donor", "Item", "Quantity", "Unit", "Date", "Status"].map((h) => (
                  <TableCell key={h} sx={headSx}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 5, color: "#9ca3af" }}>No donations recorded.</TableCell></TableRow>
              ) : rows.map((row) => (
                <TableRow key={row.id} hover sx={{ "&:last-child td": { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 600 }}>{row.donor}</TableCell>
                  <TableCell>{row.item}</TableCell>
                  <TableCell align="right">{row.quantity}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell><Chip label={row.status} color={statusColor(row.status)} size="small" sx={{ fontWeight: 600 }} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={open} onClose={() => { setOpen(false); setError(""); }} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>Add Donation</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <TextField label="Donor Name / Organisation" name="donor" value={form.donor} onChange={handleChange} />
            <TextField label="Item" name="item" value={form.item} onChange={handleChange} />
            <Stack direction="row" spacing={2}>
              <TextField label="Quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} />
              <TextField label="Unit" name="unit" value={form.unit} onChange={handleChange} placeholder="kg, pcs, L" />
            </Stack>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>Date Received</Typography>
              <TextField name="date" type="date" value={form.date} onChange={handleChange} />
            </Box>
            <TextField label="Status" name="status" value={form.status} onChange={handleChange}
              placeholder="Received / Pending / Rejected" />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" onClick={() => { setOpen(false); setError(""); }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
