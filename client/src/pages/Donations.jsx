import { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import DataTable from "../components/DataTable";
import FormDialog from "../components/FormDialog";
import PageHeader from "../components/PageHeader";
import { getDonations, createDonation } from "../services/api";

const columns = [
  { key: "donation_id", label: "ID", render: (v) => <strong>{v}</strong> },
  { key: "amount", label: "Amount", align: "right" },
  { key: "cash_amount", label: "Cash Amount", align: "right" },
  { key: "currency", label: "Currency" },
  { key: "donation_date", label: "Date", render: (v) => v?.slice(0, 10) },
  { key: "remarks", label: "Remarks" },
];

const empty = {
  amount: "",
  cash_amount: "",
  currency: "NPR",
  donation_date: "",
  remarks: "",
};

export default function Donations() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    getDonations()
      .then((r) => setRows(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleClose = () => {
    setOpen(false);
    setError("");
    setForm(empty);
  };

  const handleSubmit = () => {
    if (!form.amount) {
      setError("Amount is required.");
      return;
    }
    setSaving(true);
    createDonation(form)
      .then(() => {
        handleClose();
        load();
      })
      .catch((err) => {
        const msg =
          err.response?.data?.error || err.message || "Failed to save.";
        setError(msg);
      })
      .finally(() => setSaving(false));
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <PageHeader
        title="Donations"
        subtitle={`${rows.length} donation${rows.length !== 1 ? "s" : ""} recorded`}
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            sx={{ mt: 1, mb: 1 }}
          >
            Add Donation
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        rowKey="donation_id"
        emptyMsg="No donations recorded."
      />

      <FormDialog
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        title="Add Donation"
        loading={saving}
        error={error}
      >
        <TextField
          label="Total Amount *"
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
        />
        <TextField
          label="Cash Amount"
          name="cash_amount"
          type="number"
          value={form.cash_amount}
          onChange={handleChange}
        />
        <TextField
          label="Currency"
          name="currency"
          value={form.currency}
          onChange={handleChange}
          placeholder="NPR, USD, INR"
        />
        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mb: 0.5, display: "block" }}
          >
            Donation Date
          </Typography>
          <TextField
            name="donation_date"
            type="date"
            value={form.donation_date}
            onChange={handleChange}
          />
        </Box>
        <TextField
          label="Remarks"
          name="remarks"
          value={form.remarks}
          onChange={handleChange}
          multiline
          rows={2}
        />
      </FormDialog>
    </Box>
  );
}
