import axios from "axios";

// All API calls go through this service layer.
// Vite proxies /api → http://localhost:3000

// Global response interceptor — logs every error to the console so
// the real DB / network message is always visible during development.
axios.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error(
      "[API Error]",
      err.config?.method?.toUpperCase(),
      err.config?.url,
      "→",
      err.response?.status,
      err.response?.data ?? err.message
    );
    return Promise.reject(err);
  }
);

// ── Disasters ────────────────────────────────────────────
export const getDisasters   = ()       => axios.get("/api/disaster");
export const createDisaster = (data)   => axios.post("/api/disaster", data);

// ── Shelters / Camps ─────────────────────────────────────
export const getShelters        = ()         => axios.get("/api/shelter");
export const createShelter      = (data)     => axios.post("/api/shelter", data);
export const updateShelterPop   = (id, data) => axios.put(`/api/shelter/${id}`, data);

// ── Victims ───────────────────────────────────────────────
export const getVictims   = ()     => axios.get("/api/victims");
export const createVictim = (data) => axios.post("/api/victims", data);

// ── Resources (available stock only) ─────────────────────
export const getResources = () => axios.get("/api/resource");

// ── Inventory (all stock) ────────────────────────────────
export const getInventory   = ()     => axios.get("/api/inventory");
export const createInventory = (data) => axios.post("/api/inventory", data);

// ── Requests ─────────────────────────────────────────────
export const getRequests   = ()     => axios.get("/api/requests");
export const createRequest = (data) => axios.post("/api/requests", data);

// ── Donations ─────────────────────────────────────────────
export const getDonations   = ()     => axios.get("/api/donations");
export const createDonation = (data) => axios.post("/api/donations", data);

// ── Distributions ─────────────────────────────────────────
export const getDistributions   = ()     => axios.get("/api/distributions");
export const createDistribution = (data) => axios.post("/api/distributions", data);

// ── Deployments ───────────────────────────────────────────
export const getDeployments   = ()     => axios.get("/api/deployments");
export const createDeployment = (data) => axios.post("/api/deployments", data);

// ── Allocation (transactional resource dispatch) ──────────
export const createAllocation = (data) => axios.post("/api/allocation", data);
