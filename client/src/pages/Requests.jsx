import { useState } from "react";
import {
  Box, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Stack, Chip, Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PageHeader from "../components/PageHeader";

const headSx = { fontWeight: 700, bgcolor: "#f8fafc", color: "#374151", fontSize: 13 };
const priorityColor = (p) => ({ High: "error", Medium: "warning", Low: "info" }[p] || "default");
const statusColor = (s) => ({ Pending: "warning", Approved: "success", Rejected: "error" }[s] || "default");

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
    setOpen(false); setError("");
  };

  return (
    <Box p={4}>
      <PageHeader
        title="Resource Requests"
        subtitle={`${rows.length} request${rows.length !== 1 ? "s" : ""}`}
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            New Request
          </Button>
        }
      />

      <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {["Shelter / Camp", "Item Requested", "Quantity", "Priority", "Status", "Notes"].map((h) => (
                  <TableCell key={h} sx={headSx}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 5, color: "#9ca3af" }}>No requests found.</TableCell></TableRow>
              ) : rows.map((row) => (
                <TableRow key={row.id} hover sx={{ "&:last-child td": { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 600 }}>{row.shelter}</TableCell>
                  <TableCell>{row.item}</TableCell>
                  <TableCell align="right">{row.quantity}</TableCell>
                  <TableCell><Chip label={row.priority} color={priorityColor(row.priority)} size="small" sx={{ fontWeight: 600 }} /></TableCell>
                  <TableCell><Chip label={row.status} color={statusColor(row.status)} size="small" sx={{ fontWeight: 600 }} /></TableCell>
                  <TableCell>{row.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={open} onClose={() => { setOpen(false); setError(""); }} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>New Resource Request</DialogTitle>
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
          <Button variant="contained" onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
