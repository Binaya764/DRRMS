import { useEffect, useState } from "react";
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, CircularProgress, LinearProgress,
} from "@mui/material";
import axios from "axios";

export default function Camps() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/shelter")
      .then((res) => setRows(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Camps / Shelters</Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell align="right">Capacity</TableCell>
                <TableCell align="right">Occupancy</TableCell>
                <TableCell>Fill %</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">No shelters found.</TableCell>
                </TableRow>
              ) : (
                rows.map((row) => {
                  const pct = row.capacity
                    ? Math.round((row.current_occupancy / row.capacity) * 100)
                    : 0;
                  return (
                    <TableRow key={row.shelter_id} hover>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.location}</TableCell>
                      <TableCell align="right">{row.capacity}</TableCell>
                      <TableCell align="right">{row.current_occupancy}</TableCell>
                      <TableCell sx={{ minWidth: 120 }}>
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
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
