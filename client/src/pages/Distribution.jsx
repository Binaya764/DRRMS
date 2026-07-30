import { useEffect, useState } from "react";
import {
  Box, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Stack, Typography, CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import PageHeader from "../components/PageHeader";

export default function Distribution() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen]       = useState(false);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [form, setForm]       = useState({ victim_id: "", resource_id: "", camp_id: "", quantity_given: "", deployment_by: "" });

  const load = () => {
    setLoading(true);
    axios.get("/api/distributions").then(r => setRows(r.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.resource_id || !form.quantity_given) { setError("Resource ID and quantity are required."); return; }
    setSaving(true);
    axios.post("/api/distributions", form)
      .then(() => { setOpen(false); setForm({ victim_id: "", resource_id: "", camp_id: "", quantity_given: "", deployment_by: "" }); setError(""); load(); })
      .catch(err => setError(err.response?.data?.error || "Failed to save."))
      .finally(() => setSaving(false));
  };

  return (
    <Box>
      <PageHeader title="Distribution" subtitle={`${rows.length} record${rows.length !== 1 ? "s" : ""}`}
        action={<Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Record Distribution</Button>} />

      {loading ? <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box> : (
        <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {["ID", "Victim ID", "Resource ID", "Camp ID", "Qty Given", "By", "Date"].map(h => <TableCell key={h}>{h}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow><TableCell colSpan={7} align="center" sx={{ py: 5, color: "#9ca3af" }}>No distribution records found.</TableCell></TableRow>
                ) : rows.map(row => (
                  <TableRow key={row.deployment_id} hover>
                    <TableCell>{row.deployment_id}</TableCell>
                    <TableCell>{row.victim_id}</TableCell>
                    <TableCell>{row.resource_id}</TableCell>
                    <TableCell>{row.camp_id}</TableCell>
                    <TableCell align="right">{row.quantity_given}</TableCell>
                    <TableCell>{row.deployment_by}</TableCell>
                    <TableCell>{row.deployment_at?.slice(0, 10)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Dialog open={open} onClose={() => { setOpen(false); setError(""); }} fullWidth maxWidth="sm">
        <DialogTitle>Record Distribution</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <TextField label="Resource ID" name="resource_id" type="number" value={form.resource_id} onChange={handleChange} />
            <TextField label="Quantity Given" name="quantity_given" type="number" value={form.quantity_given} onChange={handleChange} />
            <TextField label="Camp ID (optional)" name="camp_id" type="number" value={form.camp_id} onChange={handleChange} />
            <TextField label="Victim ID (optional)" name="victim_id" type="number" value={form.victim_id} onChange={handleChange} />
            <TextField label="Deployed By" name="deployment_by" value={form.deployment_by} onChange={handleChange} />
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
