import { useState } from "react";
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Stack, Chip,
} from "@mui/material";

const COLUMNS = ["Name", "Age", "Gender", "Location", "Status", "Contact"];

export default function Victims() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", age: "", gender: "", location: "", status: "Displaced", contact: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.name || !form.location) { setError("Name and location are required."); return; }
    setRows([...rows, { ...form, id: Date.now() }]);
    setForm({ name: "", age: "", gender: "", location: "", status: "Displaced", contact: "" });
    setOpen(false);
    setError("");
  };

  const statusColor = (s) => ({ Displaced: "warning", Rescued: "success", Missing: "error" }[s] || "default");

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Victims</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Add Victim</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {COLUMNS.map((c) => <TableCell key={c}>{c}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No victims recorded.</TableCell>
              </TableRow>
            ) : rows.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.age}</TableCell>
                <TableCell>{row.gender}</TableCell>
                <TableCell>{row.location}</TableCell>
                <TableCell><Chip label={row.status} color={statusColor(row.status)} size="small" /></TableCell>
                <TableCell>{row.contact}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => { setOpen(false); setError(""); }} fullWidth maxWidth="sm">
        <DialogTitle>Add Victim</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <TextField label="Full Name" name="name" value={form.name} onChange={handleChange} />
            <Stack direction="row" spacing={2}>
              <TextField label="Age" name="age" type="number" value={form.age} onChange={handleChange} />
              <TextField label="Gender" name="gender" value={form.gender} onChange={handleChange} placeholder="Male / Female / Other" />
            </Stack>
            <TextField label="Last Known Location" name="location" value={form.location} onChange={handleChange} />
            <TextField label="Status" name="status" value={form.status} onChange={handleChange}
              placeholder="Displaced / Rescued / Missing" />
            <TextField label="Contact Number" name="contact" value={form.contact} onChange={handleChange} />
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
