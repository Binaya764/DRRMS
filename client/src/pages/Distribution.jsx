import { useState } from "react";
import {
  Box, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Stack, Chip, Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PageHeader from "../components/PageHeader";

const headSx = { fontWeight: 700, bgcolor: "#f8fafc", color: "#374151", fontSize: 13 };

export default function Distribution() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ shelter: "", item: "", quantity: "", unit: "", date: "", distributed_by: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.shelter || !form.item || !form.quantity) { setError("Shelter, item and quantity are required."); return; }
    setRows([...rows, { ...form, id: Date.now() }]);
    setForm({ shelter: "", item: "", quantity: "", unit: "", date: "", distributed_by: "" });
    setOpen(false); setError("");
  };

  return (
    <Box>
      <PageHeader
        title="Distribution"
        subtitle={`${rows.length} record${rows.length !== 1 ? "s" : ""}`}
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            Record Distribution
          </Button>
        }
      />

      <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {["Shelter / Camp", "Item", "Quantity", "Unit", "Date", "Distributed By", "Status"].map((h) => (
                  <TableCell key={h} sx={headSx}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 5, color: "#9ca3af" }}>No distribution records found.</TableCell></TableRow>
              ) : rows.map((row) => (
                <TableRow key={row.id} hover sx={{ "&:last-child td": { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 600 }}>{row.shelter}</TableCell>
                  <TableCell>{row.item}</TableCell>
                  <TableCell align="right">{row.quantity}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.distributed_by}</TableCell>
                  <TableCell><Chip label="Distributed" color="success" size="small" sx={{ fontWeight: 600 }} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={open} onClose={() => { setOpen(false); setError(""); }} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>Record Distribution</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <TextField label="Shelter / Camp" name="shelter" value={form.shelter} onChange={handleChange} />
            <TextField label="Item" name="item" value={form.item} onChange={handleChange} />
            <Stack direction="row" spacing={2}>
              <TextField label="Quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} />
              <TextField label="Unit" name="unit" value={form.unit} onChange={handleChange} placeholder="kg, pcs, L" />
            </Stack>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>Date</Typography>
              <TextField name="date" type="date" value={form.date} onChange={handleChange} />
            </Box>
            <TextField label="Distributed By" name="distributed_by" value={form.distributed_by} onChange={handleChange} />
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
