import { useEffect, useState } from "react";
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, CircularProgress, Chip,
} from "@mui/material";
import axios from "axios";

export default function Resources() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/resource")
      .then((res) => setRows(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Resources</Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Item Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Qty Available</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">No resources found.</TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.resource_id} hover>
                    <TableCell>{row.item_name}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell align="right">{row.quantity_available}</TableCell>
                    <TableCell>{row.unit}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.quantity_available > 10 ? "In Stock" : "Low"}
                        color={row.quantity_available > 10 ? "success" : "warning"}
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
