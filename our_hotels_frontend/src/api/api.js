// src/api/api.js
import axios from "axios";

/**
 * Prefer configuring base URL via env; falls back to localhost.
 * In CRA/Vite, set REACT_APP_API_BASE_URL="https://your-api"
 */
const BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:1805/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // withCredentials: true, // enable if you use cookies/sessions
});

/** Attach bearer token from localStorage on every request */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/** Optional: normalize API errors to a readable message */
function normalizeError(err) {
  if (err?.response?.data?.message) return new Error(err.response.data.message);
  if (err?.response?.data?.error) return new Error(err.response.data.error);
  if (err?.message) return new Error(err.message);
  return new Error("Network error");
}

/* ================= AUTH ================= */

/**
 * @param {{email:string, password:string}} data
 * @returns {{token:string, role:string, userId:string|number, email:string}}
 */
export async function login(data) {
  try {
    const res = await api.post("/auth/login", data);
    const d = res.data || {};
    // Normalize possible shapes
    const payload = d.data || d;

    return {
      token: payload.token,
      role: payload.role,
      userId: payload.userId,
      email: payload.email || data.email,
    };
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function register(data) {
  try {
    const res = await api.post("/auth/register", data);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

/** Get user profile by ID (token added via interceptor) */
export async function getUserProfile(userId) {
  try {
    const res = await api.get(`/users/${userId}`);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

/* ================= BOOKINGS ================= */

export async function createBooking(data) {
  try {
    const res = await api.post("/bookings", data);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function getUserBookings(userId) {
  try {
    const res = await api.get(`/bookings/user/${userId}`);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function cancelBooking(bookingId) {
  try {
    await api.delete(`/bookings/${bookingId}`);
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function getAllBookings() {
  try {
    const res = await api.get("/bookings/admin/all");
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

/* ================= HOTELS & ROOMS ================= */

/**
 * Use axios params instead of string concatenation.
 */
export async function searchHotels(location, priceMin, priceMax, roomType) {
  try {
    const params = {};
    if (location) params.location = location;
    if (priceMin) params.priceMin = priceMin;
    if (priceMax) params.priceMax = priceMax;
    if (roomType) params.roomType = roomType;

    const res = await api.get("/hotels/search", { params });
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function getHotel(id) {
  try {
    const res = await api.get(`/hotels/${id}`);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function getRooms(hotelId) {
  try {
    const res = await api.get(`/hotels/${hotelId}/rooms`);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

/** Admin hotel/room APIs */
export async function addHotel(data) {
  try {
    const res = await api.post("/hotels", data);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function updateHotel(id, data) {
  try {
    const res = await api.put(`/hotels/${id}`, data);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function deleteHotel(id) {
  try {
    await api.delete(`/hotels/${id}`);
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function addRoom(data) {
  try {
    const res = await api.post("/admin/rooms", data);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function updateRoom(id, data) {
  try {
    const res = await api.put(`/admin/rooms/${id}`, data);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function deleteRoom(id) {
  try {
    await api.delete(`/admin/rooms/${id}`);
  } catch (err) {
    throw normalizeError(err);
  }
}

/* ================= USERS (Admin only) ================= */

export async function getUsers() {
  try {
    const res = await api.get("/admin/users");
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function updateUser(id, data) {
  try {
    const res = await api.put(`/admin/users/${id}`, data);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function deleteUser(id) {
  try {
    await api.delete(`/admin/users/${id}`);
  } catch (err) {
    throw normalizeError(err);
  }
}

/* ================= REPORTS (Admin only) ================= */

export async function getRevenueReport(startDate, endDate) {
  try {
    const res = await api.get("/admin/reports/revenue", {
      params: { startDate, endDate },
    });
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function getOccupancyReport(startDate, endDate) {
  try {
    const res = await api.get("/admin/reports/occupancy", {
      params: { startDate, endDate },
    });
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

/* ================= PAYMENTS ================= */

export async function processPayment(data) {
  try {
    const res = await api.post("/payments", data);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function getPayment(bookingId) {
  try {
    const res = await api.get(`/payments/${bookingId}`);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

/* ================= CONTACT ================= */

export async function sendContactForm(data) {
  try {
    const res = await api.post("/contact", data);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

/** Optional: export the axios instance for advanced usage */
export { api };
