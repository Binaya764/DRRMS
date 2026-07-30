import { useEffect, useState } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, CircularProgress, LinearProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button,
} from "@mui/material";
import axios from "axios";

export default function Camps() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [occupancy, setOccupancy] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    axios.get("/api/shelter")
      .then((res) => setRows(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openEdit = (row) => {
    setSelected(row);
    setOccupancy(row.current_occupancy ?? "");
    setError("");
  };

  const handleUpdate = () => {
    if (occupancy === "" || isNaN(occupancy)) {
      setError("Enter a valid number.");
      return;
    }
    setSaving(true);
    axios.post(`/api/shelter/${selected.shelter_id}`, { current_occupancy: Number(occupancy) })
      .then(() => { setSelected(null); load(); })
      .catch((err) => setError(err.response?.data?.error || "Failed to update."))
      .finally(() => setSaving(false));
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Camps / Shelters</Typography>

      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell align="right">Capacity</TableCell>
                <TableCell align="right">Occupancy</TableCell>
                <TableCell>Fill %</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">No shelters found.</TableCell>
                </TableRow>
              ) : rows.map((row) => {
                const pct = row.capacity
                  ? Math.min(100, Math.round((row.current_occupancy / row.capacity) * 100))
                  : 0;
                return (
                  <TableRow key={row.shelter_id} hover>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.location}</TableCell>
                    <TableCell align="right">{row.capacity}</TableCell>
                    <TableCell align="right">{row.current_occupancy}</TableCell>
                    <TableCell sx={{ minWidth: 130 }}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <LinearProgress
                          variant="determinate"
                          value={pct}
                          color={pct > 90 ? "error" : pct > 70 ? "warning" : "success"}
                          sx={{ flex: 1, height: 8, borderRadius: 4 }}
                        />
                        <Typography variant="caption">{pct}%</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => openEdit(row)}>Update</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Update occupancy dialog */}
      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Update Occupancy — {selected?.name}</DialogTitle>
        <DialogContent>
          <Box mt={1}>
            {error && <Typography color="error" variant="body2" mb={1}>{error}</Typography>}
            <TextField
              label="Current Occupancy"
              type="number"
              value={occupancy}
              onChange={(e) => setOccupancy(e.target.value)}
              inputProps={{ min: 0, max: selected?.capacity }}
              helperText={`Capacity: ${selected?.capacity}`}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setSelected(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
