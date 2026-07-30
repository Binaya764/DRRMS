import { useState } from "react";
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Stack, Chip,
} from "@mui/material";

export default function Deployments() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ team: "", location: "", task: "", deployed_on: "", status: "Active" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.team || !form.location || !form.task) { setError("Team, location and task are required."); return; }
    setRows([...rows, { ...form, id: Date.now() }]);
    setForm({ team: "", location: "", task: "", deployed_on: "", status: "Active" });
    setOpen(false);
    setError("");
  };

  const statusColor = (s) => ({ Active: "success", Completed: "info", Recalled: "warning" }[s] || "default");

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Deployments</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Add Deployment</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {["Team / Unit", "Location", "Task", "Deployed On", "Status"].map((c) => (
                <TableCell key={c}>{c}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">No deployments recorded.</TableCell>
              </TableRow>
            ) : rows.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.team}</TableCell>
                <TableCell>{row.location}</TableCell>
                <TableCell>{row.task}</TableCell>
                <TableCell>{row.deployed_on}</TableCell>
                <TableCell><Chip label={row.status} color={statusColor(row.status)} size="small" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => { setOpen(false); setError(""); }} fullWidth maxWidth="sm">
        <DialogTitle>Add Deployment</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <TextField label="Team / Unit Name" name="team" value={form.team} onChange={handleChange} />
            <TextField label="Deployment Location" name="location" value={form.location} onChange={handleChange} />
            <TextField label="Task / Mission" name="task" value={form.task} onChange={handleChange} multiline rows={2} />
            <TextField label="Deployed On" name="deployed_on" type="date" value={form.deployed_on}
              onChange={handleChange} InputLabelProps={{ shrink: true }} />
            <TextField label="Status" name="status" value={form.status} onChange={handleChange}
              placeholder="Active / Completed / Recalled" />
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
