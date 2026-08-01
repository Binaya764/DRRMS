import { useEffect, useState } from "react";
import { Box, Chip } from "@mui/material";

import DataTable from "../components/DataTable";
import PageHeader from "../components/PageHeader";
import { getResources } from "../services/api";

const columns = [
  {
    key: "resource_name",
    label: "Resource Name",
    render: (v) => <strong>{v}</strong>,
  },
  { key: "category", label: "Category" },
  { key: "quantity", label: "Quantity", align: "right" },
  {
    key: "quantity",
    label: "Availability",
    render: (v) => (
      <Chip
        label={v > 100 ? "Sufficient" : v > 50 ? "Moderate" : "Low"}
        color={v > 100 ? "success" : v > 50 ? "warning" : "error"}
        size="small"
      />
    ),
  },
];

export default function Resources() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getResources()
      .then((r) => setRows(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Box sx={{ mb: 1 }}>
        <PageHeader
          sx={{ mb: 2 }}
          title="Resources"
          subtitle={`${rows.length} resource${rows.length !== 1 ? "s" : ""} available`}
        />
      </Box>

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        rowKey="resource_id"
        emptyMsg="No resources found."
      />
    </Box>
  );
}
