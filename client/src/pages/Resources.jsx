import { useEffect, useState } from "react";
import {
  Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, CircularProgress, Chip,
} from "@mui/material";
import axios from "axios";
import PageHeader from "../components/PageHeader";

export default function Resources() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/resource").then(r => setRows(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <PageHeader title="Resources" subtitle={`${rows.length} item${rows.length !== 1 ? "s" : ""} available`} />

      {loading ? <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box> : (
        <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {["Resource Name", "Category", "Quantity", "Status"].map(h => <TableCell key={h}>{h}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow><TableCell colSpan={4} align="center" sx={{ py: 5, color: "#9ca3af" }}>No resources found.</TableCell></TableRow>
                ) : rows.map(row => (
                  <TableRow key={row.resource_id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{row.resource_name}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell align="right">{row.quantity}</TableCell>
                    <TableCell>
                      <Chip label={row.quantity > 100 ? "Sufficient" : row.quantity > 50 ? "Moderate" : "Low"}
                        color={row.quantity > 100 ? "success" : row.quantity > 50 ? "warning" : "error"} size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}
