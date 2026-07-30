import { useState } from "react";
import {
  Box, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Stack, Chip, Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PageHeader from "../components/PageHeader";

const headSx = { fontWeight: 700, bgcolor: "#f8fafc", color: "#374151", fontSize: 13 };
const statusColor = (s) => ({ Displaced: "warning", Rescued: "success", Missing: "error" }[s] || "default");

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
    setOpen(false); setError("");
  };

  return (
    <Box>
      <PageHeader
        title="Victims"
        subtitle={`${rows.length} record${rows.length !== 1 ? "s" : ""}`}
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            Add Victim
          </Button>
        }
      />

      <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {["Name", "Age", "Gender", "Location", "Status", "Contact"].map((h) => (
                  <TableCell key={h} sx={headSx}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 5, color: "#9ca3af" }}>No victims recorded.</TableCell></TableRow>
              ) : rows.map((row) => (
                <TableRow key={row.id} hover sx={{ "&:last-child td": { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 600 }}>{row.name}</TableCell>
                  <TableCell>{row.age}</TableCell>
                  <TableCell>{row.gender}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell><Chip label={row.status} color={statusColor(row.status)} size="small" sx={{ fontWeight: 600 }} /></TableCell>
                  <TableCell>{row.contact}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={open} onClose={() => { setOpen(false); setError(""); }} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>Add Victim</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <TextField label="Full Name" name="name" value={form.name} onChange={handleChange} />
            <Stack direction="row" spacing={2}>
              <TextField label="Age" name="age" type="number" value={form.age} onChange={handleChange} />
              <TextField label="Gender" name="gender" value={form.gender} onChange={handleChange} placeholder="Male / Female / Other" />
            </Stack>
            <TextField label="Last Known Location" name="location" value={form.location} onChange={handleChange} />
            <TextField label="Status" name="status" value={form.status} onChange={handleChange} placeholder="Displaced / Rescued / Missing" />
            <TextField label="Contact Number" name="contact" value={form.contact} onChange={handleChange} />
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
