import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";

/**
 * DataTable
 *
 * Props:
 *   columns  — array of { key, label, align?, render? }
 *              render(value, row) → ReactNode  (optional custom cell renderer)
 *   rows     — array of data objects
 *   loading  — boolean
 *   rowKey   — string key used for React key (default "id")
 *   emptyMsg — message shown when rows is empty (default "No records found.")
 */
export default function DataTable({
  columns = [],
  rows = [],
  loading = false,
  rowKey = "id",
  emptyMsg = "No records found.",
}) {
  return (
    <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.key} align={col.align || "left"}>
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                  <Box display="flex" justifyContent="center">
                    <CircularProgress size={28} />
                  </Box>
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{ py: 6, color: "text.secondary" }}
                >
                  {emptyMsg}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row[rowKey]} hover>
                  {columns.map((col) => (
                    <TableCell key={col.key} align={col.align || "left"}>
                      {col.render
                        ? col.render(row[col.key], row)
                        : row[col.key] ?? (
                            <Typography variant="body2" color="text.disabled">
                              —
                            </Typography>
                          )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
