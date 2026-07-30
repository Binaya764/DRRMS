import { useEffect, useState } from "react";
import {
  Box, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Stack, Typography, CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import PageHeader from "../components/PageHeader";

export default function Victims() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen]       = useState(false);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [form, setForm]       = useState({ victim_name: "", full_name: "", age: "", gender: "", phone_number: "", camp_id: "" });

  const load = () => {
    setLoading(true);
    axios.get("/api/victims").then(r => setRows(r.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.victim_name) { setError("Victim name is required."); return; }
    setSaving(true);
    axios.post("/api/victims", form)
      .then(() => { setOpen(false); setForm({ victim_name: "", full_name: "", age: "", gender: "", phone_number: "", camp_id: "" }); setError(""); load(); })
      .catch(err => setError(err.response?.data?.error || "Failed to save."))
      .finally(() => setSaving(false));
  };

  return (
    <Box>
      <PageHeader title="Victims" subtitle={`${rows.length} record${rows.length !== 1 ? "s" : ""}`}
        action={<Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Add Victim</Button>} />

      {loading ? <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box> : (
        <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {["Name", "Full Name", "Age", "Gender", "Phone", "Camp ID"].map(h => <TableCell key={h}>{h}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 5, color: "#9ca3af" }}>No victims recorded.</TableCell></TableRow>
                ) : rows.map(row => (
                  <TableRow key={row.victim_id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{row.victim_name}</TableCell>
                    <TableCell>{row.full_name}</TableCell>
                    <TableCell>{row.age}</TableCell>
                    <TableCell>{row.gender}</TableCell>
                    <TableCell>{row.phone_number}</TableCell>
                    <TableCell>{row.camp_id}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Dialog open={open} onClose={() => { setOpen(false); setError(""); }} fullWidth maxWidth="sm">
        <DialogTitle>Add Victim</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <TextField label="Short Name" name="victim_name" value={form.victim_name} onChange={handleChange} />
            <TextField label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} />
            <Stack direction="row" spacing={2}>
              <TextField label="Age" name="age" type="number" value={form.age} onChange={handleChange} />
              <TextField label="Gender" name="gender" value={form.gender} onChange={handleChange} placeholder="Male / Female / Other" />
            </Stack>
            <TextField label="Phone Number" name="phone_number" value={form.phone_number} onChange={handleChange} />
            <TextField label="Camp ID (if assigned)" name="camp_id" type="number" value={form.camp_id} onChange={handleChange} />
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
