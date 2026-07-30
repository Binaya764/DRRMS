import { useEffect, useState } from "react";
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, CircularProgress, Chip,
} from "@mui/material";
import axios from "axios";

export default function DisasterAreas() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    axios
      .get("/api/disaster")
      .then((res) => setRows(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Disaster Areas</Typography>
        {/* Add Disaster button — wire to FormDialog when ready */}
        <Button variant="contained" disabled>Add Disaster</Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">No records found.</TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.event_id} hover>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.location}</TableCell>
                    <TableCell>{row.start_date?.slice(0, 10)}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status || "Active"}
                        color="error"
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
