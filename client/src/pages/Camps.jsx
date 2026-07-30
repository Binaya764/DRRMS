import { useEffect, useState } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, CircularProgress, LinearProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import PageHeader from "../components/PageHeader";

const headSx = { fontWeight: 700, bgcolor: "#f8fafc", color: "#374151", fontSize: 13 };

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

  const openEdit = (row) => { setSelected(row); setOccupancy(row.current_occupancy ?? ""); setError(""); };

  const handleUpdate = () => {
    if (occupancy === "" || isNaN(occupancy)) { setError("Enter a valid number."); return; }
    setSaving(true);
    axios.post(`/api/shelter/${selected.shelter_id}`, { current_occupancy: Number(occupancy) })
      .then(() => { setSelected(null); load(); })
      .catch((err) => setError(err.response?.data?.error || "Failed to update."))
      .finally(() => setSaving(false));
  };

  return (
    <Box p={4}>
      <PageHeader
        title="Camps / Shelters"
        subtitle={`${rows.length} shelter${rows.length !== 1 ? "s" : ""} registered`}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box>
      ) : (
        <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {["Name", "Location", "Capacity", "Occupancy", "Fill %", ""].map((h, i) => (
                    <TableCell key={i} sx={{ ...headSx, ...(i >= 2 && i <= 3 ? { textAlign: "right" } : {}) }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 5, color: "#9ca3af" }}>
                      No shelters found.
                    </TableCell>
                  </TableRow>
                ) : rows.map((row) => {
                  const pct = row.capacity
                    ? Math.min(100, Math.round((row.current_occupancy / row.capacity) * 100)) : 0;
                  return (
                    <TableRow key={row.shelter_id} hover sx={{ "&:last-child td": { border: 0 } }}>
                      <TableCell sx={{ fontWeight: 600 }}>{row.name}</TableCell>
                      <TableCell>{row.location}</TableCell>
                      <TableCell align="right">{row.capacity}</TableCell>
                      <TableCell align="right">{row.current_occupancy}</TableCell>
                      <TableCell sx={{ minWidth: 150 }}>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <LinearProgress
                            variant="determinate" value={pct}
                            color={pct > 90 ? "error" : pct > 70 ? "warning" : "success"}
                            sx={{ flex: 1, height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="caption" fontWeight={600} sx={{ minWidth: 32 }}>
                            {pct}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Button size="small" startIcon={<EditIcon fontSize="small" />}
                          onClick={() => openEdit(row)} variant="outlined" sx={{ borderRadius: 2 }}>
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Update Occupancy — {selected?.name}</DialogTitle>
        <DialogContent>
          <Box mt={1}>
            {error && <Typography color="error" variant="body2" mb={1}>{error}</Typography>}
            <TextField label="Current Occupancy" type="number" value={occupancy}
              onChange={(e) => setOccupancy(e.target.value)}
              inputProps={{ min: 0, max: selected?.capacity }}
              helperText={`Max capacity: ${selected?.capacity}`} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" onClick={() => setSelected(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
