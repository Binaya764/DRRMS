import { useEffect, useState } from "react";
import {
  Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, CircularProgress, Chip,
} from "@mui/material";
import axios from "axios";
import PageHeader from "../components/PageHeader";

const headSx = { fontWeight: 700, bgcolor: "#f8fafc", color: "#374151", fontSize: 13 };

export default function Resources() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/resource")
      .then((res) => setRows(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <PageHeader
        title="Resources"
        subtitle={`${rows.length} item${rows.length !== 1 ? "s" : ""} available`}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box>
      ) : (
        <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {["Item Name", "Category", "Qty Available", "Unit", "Status"].map((h, i) => (
                    <TableCell key={h} sx={{ ...headSx, ...(i === 2 ? { textAlign: "right" } : {}) }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 5, color: "#9ca3af" }}>
                      No resources found.
                    </TableCell>
                  </TableRow>
                ) : rows.map((row) => (
                  <TableRow key={row.resource_id} hover sx={{ "&:last-child td": { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 600 }}>{row.item_name}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell align="right">{row.quantity_available}</TableCell>
                    <TableCell>{row.unit}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.quantity_available > 10 ? "In Stock" : "Low"}
                        color={row.quantity_available > 10 ? "success" : "warning"}
                        size="small" sx={{ fontWeight: 600 }}
                      />
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
