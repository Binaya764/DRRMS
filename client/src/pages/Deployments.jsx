import { useState } from "react";
import {
  Box, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Stack, Chip, Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PageHeader from "../components/PageHeader";

const headSx = { fontWeight: 700, bgcolor: "#f8fafc", color: "#374151", fontSize: 13 };
const statusColor = (s) => ({ Active: "success", Completed: "info", Recalled: "warning" }[s] || "default");

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
    setOpen(false); setError("");
  };

  return (
    <Box p={4}>
      <PageHeader
        title="Deployments"
        subtitle={`${rows.length} deployment${rows.length !== 1 ? "s" : ""} active`}
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            Add Deployment
          </Button>
        }
      />

      <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {["Team / Unit", "Location", "Task", "Deployed On", "Status"].map((h) => (
                  <TableCell key={h} sx={headSx}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 5, color: "#9ca3af" }}>No deployments recorded.</TableCell></TableRow>
              ) : rows.map((row) => (
                <TableRow key={row.id} hover sx={{ "&:last-child td": { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 600 }}>{row.team}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>{row.task}</TableCell>
                  <TableCell>{row.deployed_on}</TableCell>
                  <TableCell><Chip label={row.status} color={statusColor(row.status)} size="small" sx={{ fontWeight: 600 }} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={open} onClose={() => { setOpen(false); setError(""); }} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>Add Deployment</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <TextField label="Team / Unit Name" name="team" value={form.team} onChange={handleChange} />
            <TextField label="Deployment Location" name="location" value={form.location} onChange={handleChange} />
            <TextField label="Task / Mission" name="task" value={form.task} onChange={handleChange} multiline rows={2} />
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>Deployed On</Typography>
              <TextField name="deployed_on" type="date" value={form.deployed_on} onChange={handleChange} />
            </Box>
            <TextField label="Status" name="status" value={form.status} onChange={handleChange}
              placeholder="Active / Completed / Recalled" />
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
