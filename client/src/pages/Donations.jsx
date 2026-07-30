import { useEffect, useState } from "react";
import {
  Box, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Stack, Typography, CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import PageHeader from "../components/PageHeader";

export default function Donations() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen]       = useState(false);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [form, setForm]       = useState({ amount: "", cash_amount: "", currency: "NPR", donation_date: "", remarks: "" });

  const load = () => {
    setLoading(true);
    axios.get("/api/donations").then(r => setRows(r.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.amount) { setError("Amount is required."); return; }
    setSaving(true);
    axios.post("/api/donations", form)
      .then(() => { setOpen(false); setForm({ amount: "", cash_amount: "", currency: "NPR", donation_date: "", remarks: "" }); setError(""); load(); })
      .catch(err => setError(err.response?.data?.error || "Failed to save."))
      .finally(() => setSaving(false));
  };

  return (
    <Box>
      <PageHeader title="Donations" subtitle={`${rows.length} donation${rows.length !== 1 ? "s" : ""} recorded`}
        action={<Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Add Donation</Button>} />

      {loading ? <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box> : (
        <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {["ID", "Amount", "Cash Amount", "Currency", "Date", "Remarks"].map(h => <TableCell key={h}>{h}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 5, color: "#9ca3af" }}>No donations recorded.</TableCell></TableRow>
                ) : rows.map(row => (
                  <TableRow key={row.donation_id} hover>
                    <TableCell>{row.donation_id}</TableCell>
                    <TableCell align="right">{row.amount}</TableCell>
                    <TableCell align="right">{row.cash_amount}</TableCell>
                    <TableCell>{row.currency}</TableCell>
                    <TableCell>{row.donation_date?.slice(0, 10)}</TableCell>
                    <TableCell>{row.remarks}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Dialog open={open} onClose={() => { setOpen(false); setError(""); }} fullWidth maxWidth="sm">
        <DialogTitle>Add Donation</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <TextField label="Total Amount" name="amount" type="number" value={form.amount} onChange={handleChange} />
            <TextField label="Cash Amount" name="cash_amount" type="number" value={form.cash_amount} onChange={handleChange} />
            <TextField label="Currency" name="currency" value={form.currency} onChange={handleChange} placeholder="NPR, USD, INR" />
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>Donation Date</Typography>
              <TextField name="donation_date" type="date" value={form.donation_date} onChange={handleChange} />
            </Box>
            <TextField label="Remarks" name="remarks" value={form.remarks} onChange={handleChange} multiline rows={2} />
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
