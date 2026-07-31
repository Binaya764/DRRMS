import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
} from "@mui/material";

/**
 * FormDialog
 *
 * Props:
 *   open        — boolean
 *   onClose     — () => void
 *   onSubmit    — () => void
 *   title       — string
 *   submitLabel — string  (default "Save")
 *   loading     — boolean (disables submit while saving)
 *   error       — string  (shown in red at top of form)
 *   children    — form fields
 *   maxWidth    — MUI Dialog maxWidth (default "sm")
 */
export default function FormDialog({
  open,
  onClose,
  onSubmit,
  title,
  submitLabel = "Save",
  loading = false,
  error = "",
  children,
  maxWidth = "sm",
}) {
  const handleClose = () => {
    if (!loading) onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth={maxWidth}>
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>{title}</DialogTitle>

      <DialogContent sx={{ pt: 40 }}>
        <Stack spacing={2}>
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          {children}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button variant="outlined" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>

        <Button variant="contained" onClick={onSubmit} disabled={loading}>
          {loading ? "Saving…" : submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
