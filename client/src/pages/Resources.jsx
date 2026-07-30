import { useEffect, useState } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, CircularProgress, Chip,
} from "@mui/material";
import axios from "axios";

export default function Resources() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/resource").then(r => setRows(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <Box sx={{ height: "70vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>Resources</Typography>
        <Typography color="text.secondary">{rows.length} resource{rows.length !== 1 ? "s" : ""} available</Typography>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {["Resource Name", "Category", "Quantity", "Availability"].map(h => (
                  <TableCell key={h}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow><TableCell colSpan={4} align="center" sx={{ py: 6, color: "text.secondary" }}>No resources found.</TableCell></TableRow>
              ) : rows.map(row => (
                <TableRow key={row.resource_id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{row.resource_name}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell align="right">{row.quantity}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.quantity > 100 ? "Sufficient" : row.quantity > 50 ? "Moderate" : "Low"}
                      color={row.quantity > 100 ? "success" : row.quantity > 50 ? "warning" : "error"}
                      size="small" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
