import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

export const fetchEmails = async () => {
  const res = await axios.get(`${API_BASE}/emails/`);
  return res.data;
};

export const summarizeEmail = async (id) => {
  const res = await axios.post(`${API_BASE}/emails/${id}/summarize`);
  return res.data;
};

export const draftReply = async (id) => {
  const res = await axios.post(`${API_BASE}/emails/${id}/draft-reply`);
  return res.data;
};

export const classifyEmail = async (id) => {
  const res = await axios.post(`${API_BASE}/emails/${id}/classify`);
  return res.data;
};
