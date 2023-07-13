import axios from "axios";

const apiClient = axios.create({
  baseURL: `http://localhost:8080/api`,
  //   headers: {
  //     Accept: "application/json",
  //     "Access-Control-Allow-Origin": "*",
  //     "Content-Type": "application/json",
  //   },
  //   headers: {
  //     'x-auth-token':
  //       typeof window !== 'undefined' && localStorage.getItem('x-auth-token'),
  //   },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("x-auth-token");
    if (token) {
      config.headers["token"] = `${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Auth Services
 * */

export const authenticate = async () => {
  const response = await apiClient.get("/auth");
  return response;
};
export const getConversations = async () => {
  const response = await apiClient.get("/conversations");
  return response;
};
export const getConversation = async (id) => {
  const response = await apiClient.get(`/conversation/${id}`);
  return response;
};

export const upload = async (body) => {
  const response = await apiClient.post(`/upload`, { ...body });
  return response;
};

export const login = async (data) => {
  const response = await apiClient.post("/users/login", {
    ...data,
  });
  return response;
};
export const addEmail = async (data) => {
  const response = await apiClient.post("/email", {
    ...data,
  });
  return response;
};

export const verifyUsername = async (username) => {
  const response = await apiClient.get(`/users/verify-username/${username}`);
  return response;
};
