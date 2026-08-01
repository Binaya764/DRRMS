import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

/**
 * ConfirmDelete
 *
 * Props:
 *   open       — boolean
 *   onClose    — () => void  (cancel)
 *   onConfirm  — () => void  (proceed with delete)
 *   title      — string  (default "Delete record?")
 *   message    — string  (default "This action cannot be undone.")
 *   loading    — boolean
 */
export default function ConfirmDelete({
  open,
  onClose,
  onConfirm,
  title = "Delete record?",
  message = "This action cannot be undone.",
  loading = false,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
        <WarningAmberIcon color="error" />
        {title}
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button variant="outlined" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" color="error" onClick={onConfirm} disabled={loading}>
          {loading ? "Deleting…" : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
