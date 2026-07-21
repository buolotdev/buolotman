const API_BASE = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : "http://127.0.0.1:8000/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("access_token");
  } catch {
    return null;
  }
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("refresh_token");
  } catch {
    return null;
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  try {
    const res = await fetch(`${API_BASE}/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    localStorage.setItem("access_token", data.access);
    return data.access;
  } catch {
    return null;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const publicRequest = (options as any)?.public === true;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Removed mock responses as backend is now fully functional

  if (token && !publicRequest) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const opts = { ...options };
  delete (opts as any).public;

  let res;
  try {
    res = await fetch(`${API_BASE}${endpoint}`, { ...opts, headers });
  } catch (err) {
    throw new Error("Backend is offline. Please start the backend server.");
  }

  if (res.status === 401 && token) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || error.error || JSON.stringify(error));
  }

  if (res.status === 204) return {} as T;
  return res.json();
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ access: string; refresh: string; role: string; username: string; email: string }>(
      "/auth/login/",
      { method: "POST", body: JSON.stringify({ username: email, password }), public: true } as any
    ),

  registerClient: (data: Record<string, string>) =>
    request<{ message: string }>("/auth/register/client/", {
      method: "POST",
      body: JSON.stringify(data),
      public: true,
    } as any),

  registerTechnician: (data: Record<string, string>) =>
    request<{ message: string }>("/auth/register/technician/", {
      method: "POST",
      body: JSON.stringify(data),
      public: true,
    } as any),

  registerCompany: (data: Record<string, string>) =>
    request<{ message: string }>("/auth/register/company/", {
      method: "POST",
      body: JSON.stringify(data),
      public: true,
    } as any),

  requestPhoneOtp: (data: { phone: string; email?: string; purpose?: string }) =>
    request<{ message: string; challenge_id: number; expires_at: string }>("/auth/otp/request/", {
      method: "POST",
      body: JSON.stringify(data),
      public: true,
    } as any),

  verifyPhoneOtp: (data: { challenge_id: number; code: string }) =>
    request<{ message: string; verified: boolean; purpose: string }>("/auth/otp/verify/", {
      method: "POST",
      body: JSON.stringify(data),
      public: true,
    } as any),


  uploadServiceMedia: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return fetch(`${API_BASE}/uploads/service_media/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
      },
      body: form,
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Upload failed" }));
        throw new Error(err.detail || err.error || JSON.stringify(err));
      }
      return res.json() as Promise<{
        file_url: string;
        file_name: string;
        media_type: "image" | "video" | "document";
        content_type: string;
        key: string;
        size: number;
      }>;
    });
  },

  // User
  getMe: () => request<any>("/auth/me/"),
  updateMe: (data: Record<string, any>) =>
    request<any>("/auth/me/", { method: "PATCH", body: JSON.stringify(data) }),
  getUserProfile: (id: number) => request<any>(`/auth/users/${id}/`),
  listUsers: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<any[]>(`/auth/users/${qs}`);
  },

  // Tasks
  getTasks: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<any>(`/tasks/${qs}`);
  },
  getMyTasks: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<any>(`/tasks/my/${qs}`);
  },
  createTask: (data: Record<string, any>) =>
    request<any>("/tasks/create/", { method: "POST", body: JSON.stringify(data) }),
  getTask: (id: number) => request<any>(`/tasks/${id}/`),
  updateTask: (id: number, data: Record<string, any>) =>
    request<any>(`/tasks/${id}/`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteTask: (id: number) =>
    request<void>(`/tasks/${id}/`, { method: "DELETE" }),

  // Bids
  getTaskBids: (taskId: number) => request<any>(`/tasks/${taskId}/bids/`),
  submitBid: (taskId: number, data: Record<string, any>) =>
    request<any>(`/tasks/${taskId}/bids/`, { method: "POST", body: JSON.stringify(data) }),
  getBid: (bidId: number) => request<any>(`/tasks/bids/${bidId}/`),
  updateBid: (bidId: number, data: Record<string, any>) =>
    request<any>(`/tasks/bids/${bidId}/`, { method: "PATCH", body: JSON.stringify(data) }),
  acceptBid: (bidId: number) =>
    request<any>(`/tasks/bids/${bidId}/`, { method: "PATCH", body: JSON.stringify({ status: "accepted" }) }),
  rejectBid: (bidId: number) =>
    request<any>(`/tasks/bids/${bidId}/`, { method: "PATCH", body: JSON.stringify({ status: "rejected" }) }),
  withdrawBid: (bidId: number) =>
    request<any>(`/tasks/bids/${bidId}/withdraw/`, { method: "POST" }),
  getMyBids: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<any>(`/tasks/bids/my/${qs}`);
  },

  // Task actions
  publishTask: (taskId: number) =>
    request<any>(`/tasks/${taskId}/publish/`, { method: "POST" }),
  completeTask: (taskId: number) =>
    request<any>(`/tasks/${taskId}/complete/`, { method: "POST" }),
  cancelTask: (taskId: number) =>
    request<any>(`/tasks/${taskId}/cancel/`, { method: "POST" }),

  // Questions
  getTaskQuestions: (taskId: number) => request<any>(`/tasks/${taskId}/questions/`),
  askQuestion: (taskId: number, data: Record<string, string>) =>
    request<any>(`/tasks/${taskId}/questions/`, { method: "POST", body: JSON.stringify(data) }),

  // Categories & Skills
  getCategories: () => request<any[]>("/tasks/categories/"),
  createCategory: (data: Record<string, any>) =>
    request<any>("/tasks/categories/", { method: "POST", body: JSON.stringify(data) }),
  updateCategory: (id: number, data: Record<string, any>) =>
    request<any>(`/tasks/categories/${id}/`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteCategory: (id: number) =>
    request<void>(`/tasks/categories/${id}/`, { method: "DELETE" }),
  getSkills: (category?: string) => {
    const qs = category ? `?category=${category}` : "";
    return request<any[]>(`/tasks/skills/${qs}`);
  },

  // Inquiries
  submitInquiry: (data: Record<string, string>) =>
    request<any>("/tasks/inquiry/", { method: "POST", body: JSON.stringify(data), public: true } as any),
  submitContact: (data: Record<string, string>) =>
    request<any>("/tasks/inquiry/", { method: "POST", body: JSON.stringify({ ...data, inquiry_type: 'general' }), public: true } as any),

  // Wallet
  getWallet: () => request<any>("/wallet/"),
  withdraw: (data: Record<string, any>) =>
    request<any>("/wallet/withdraw/", { method: "POST", body: JSON.stringify(data) }),
  depositEscrow: (data: { task_id: number; bid_id: number; amount: number }) =>
    request<any>("/wallet/deposit/", { method: "POST", body: JSON.stringify(data) }),
  releaseEscrow: (taskId: number) =>
    request<any>(`/wallet/release-escrow/${taskId}/`, { method: "POST" }),
  getTransactions: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<any>(`/wallet/transactions/${qs}`);
  },
  getAdminTransactions: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<any>(`/wallet/admin/transactions/${qs}`);
  },

  // Conversations
  getConversations: () => request<any[]>("/conversations/"),
  getConversation: (id: number) => request<any>(`/conversations/${id}/`),
  sendMessage: (conversationId: number, data: string | Record<string, any>) =>
    request<any>(`/conversations/${conversationId}/messages/`, {
      method: "POST",
      body: JSON.stringify(typeof data === "string" ? { text: data } : data),
    }),
  uploadMessageAttachment: (conversationId: number, file: File) => {
    const form = new FormData();
    form.append("file", file);
    return fetch(`${API_BASE}/conversations/${conversationId}/attachments/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
      },
      body: form,
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Upload failed" }));
        throw new Error(err.detail || err.error || JSON.stringify(err));
      }
      return res.json();
    });
  },
  createConversation: (participantId: number, taskId?: number) =>
    request<any>("/conversations/create/", {
      method: "POST",
      body: JSON.stringify({ participant_id: participantId, task_id: taskId }),
    }),

  // Saved Professionals
  getSavedPros: () => request<any[]>("/auth/saved-pros/"),
  savePro: (id: number) =>
    request<any>("/auth/saved-pros/", { method: "POST", body: JSON.stringify({ professional_id: id }) }),
  unsavePro: (id: number) =>
    request<void>(`/auth/saved-pros/${id}/`, { method: "DELETE" }),

  // Company
  listCompanies: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<any[]>(`/company/${qs}`);
  },
  getCompanyProfile: () => request<any>("/company/profile/"),
  updateCompanyProfile: (data: Record<string, any>) =>
    request<any>("/company/profile/", { method: "PATCH", body: JSON.stringify(data) }),
  getCompanyProjects: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<any>(`/company/projects/${qs}`);
  },
  createCompanyProject: (data: Record<string, any>) =>
    request<any>("/company/projects/", { method: "POST", body: JSON.stringify(data) }),
  getCompanyServices: () => request<any[]>("/company/services/"),
  createCompanyService: (data: Record<string, any>) =>
    request<any>("/company/services/", { method: "POST", body: JSON.stringify(data) }),
  uploadCompanyServiceImage: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return fetch(`${API_BASE}/uploads/company_service/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
      },
      body: form,
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Upload failed" }));
        throw new Error(err.detail || err.error || JSON.stringify(err));
      }
      return res.json();
    });
  },
  deleteCompanyService: (id: number) =>
    request<any>(`/company/services/${id}/`, { method: "DELETE" }),
  getCompanyCertifications: () => request<any[]>("/company/certifications/"),
  createCompanyCertification: (data: Record<string, string>) =>
    request<any>("/company/certifications/", { method: "POST", body: JSON.stringify(data) }),
  addCompanyReview: (companyId: number, data: { rating: number; text?: string; service?: string }) =>
    request<any>(`/company/${companyId}/reviews/`, { method: "POST", body: JSON.stringify(data) }),

  // Technician services
  getTechnicianServices: () => request<any[]>("/auth/technician-services/"),
  getTechnicianService: (serviceId: number) => request<any>(`/auth/technician-services/${serviceId}/`),
  createTechnicianService: (data: Record<string, any>) =>
    request<any>("/auth/technician-services/", { method: "POST", body: JSON.stringify(data) }),
  updateTechnicianService: (serviceId: number, data: Record<string, any>) =>
    request<any>(`/auth/technician-services/${serviceId}/`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteTechnicianService: (serviceId: number) =>
    request<void>(`/auth/technician-services/${serviceId}/`, { method: "DELETE" }),

  // Technician Documents
  getTechnicianDocuments: () => request<any[]>("/auth/technician-documents/"),
  createTechnicianDocument: (data: Record<string, any>) =>
    request<any>("/auth/technician-documents/", { method: "POST", body: JSON.stringify(data) }),
  deleteTechnicianDocument: (documentId: number) =>
    request<void>(`/auth/technician-documents/${documentId}/`, { method: "DELETE" }),

  // Admin
  adminListUsers: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<any[]>(`/auth/admin/users/${qs}`);
  },
  adminListTasks: () => request<any[]>("/auth/admin/tasks/"),
  adminVerifyUser: (userId: number) =>
    request<any>(`/auth/admin/users/${userId}/verify/`, { method: "POST" }),
  adminSuspendUser: (userId: number, action: "suspend" | "unsuspend" = "suspend") =>
    request<any>(`/auth/admin/users/${userId}/suspend/`, { method: "POST", body: JSON.stringify({ action }) }),

  // Governance
  getNotifications: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<any[]>(`/governance/notifications/${qs}`);
  },
  markNotificationRead: (notificationId: number) =>
    request<any>(`/governance/notifications/${notificationId}/read/`, { method: "POST" }),
  getDisputes: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<any[]>(`/governance/disputes/${qs}`);
  },
  createDispute: (data: Record<string, any>) =>
    request<any>("/governance/disputes/create/", { method: "POST", body: JSON.stringify(data) }),
  getDispute: (disputeId: number) =>
    request<any>(`/governance/disputes/${disputeId}/`),
  updateDispute: (disputeId: number, data: { status: string; resolution?: string }) =>
    request<any>(`/governance/disputes/${disputeId}/`, { method: "PATCH", body: JSON.stringify(data) }),
  getDisputeEvidence: (disputeId: number) =>
    request<any[]>(`/governance/disputes/${disputeId}/evidence/`),
  addDisputeEvidence: (disputeId: number, data: Record<string, any>) =>
    request<any>(`/governance/disputes/${disputeId}/evidence/`, { method: "POST", body: JSON.stringify(data) }),
  getAuditLogs: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<any>(`/governance/audit-logs/${qs}`);
  },
  getPlatformSettings: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<any[]>(`/governance/platform-settings/${qs}`);
  },
  createPlatformSetting: (data: Record<string, any>) =>
    request<any>("/governance/platform-settings/", { method: "POST", body: JSON.stringify(data) }),
  updatePlatformSetting: (data: Record<string, any>) =>
    request<any>("/governance/platform-settings/", { method: "PATCH", body: JSON.stringify(data) }),

  // CMS Pages
  getCmsPages: () => request<any[]>("/governance/pages/"),
  createCmsPage: (data: Record<string, any>) =>
    request<any>("/governance/pages/", { method: "POST", body: JSON.stringify(data) }),
  updateCmsPage: (pageId: number, data: Record<string, any>) =>
    request<any>(`/governance/pages/${pageId}/`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteCmsPage: (pageId: number) =>
    request<void>(`/governance/pages/${pageId}/`, { method: "DELETE" }),
  getPublicPages: () => request<any[]>("/governance/public-pages/", { public: true } as any),
  getPublicPage: (slug: string) => request<any>(`/governance/public-pages/${slug}/`, { public: true } as any),

  // Portfolio
  getPortfolio: () => request<any[]>("/auth/portfolio/"),
  addPortfolioItem: (data: Record<string, any>) =>
    request<any>("/auth/portfolio/", { method: "POST", body: JSON.stringify(data) }),
  deletePortfolioItem: (itemId: number) =>
    request<void>(`/auth/portfolio/${itemId}/`, { method: "DELETE" }),

  // Profile
  updateProfile: (data: Record<string, any>) =>
    request<any>("/auth/me/", { method: "PATCH", body: JSON.stringify(data) }),

  // Search
  search: (params: Record<string, string>) => {
    const qs = new URLSearchParams(params).toString();
    return request<any>(`/search/?${qs}`);
  },

  // Uploads
  uploadAvatar: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return fetch(`${API_BASE}/uploads/avatar/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
      },
      body: form,
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Upload failed" }));
        throw new Error(err.detail || JSON.stringify(err));
      }
      return res.json();
    });
  },
  uploadBanner: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return fetch(`${API_BASE}/uploads/banner/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
      },
      body: form,
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Upload failed" }));
        throw new Error(err.detail || JSON.stringify(err));
      }
      return res.json();
    });
  },
  uploadPortfolioImage: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return fetch(`${API_BASE}/uploads/portfolio/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
      },
      body: form,
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Upload failed" }));
        throw new Error(err.detail || JSON.stringify(err));
      }
      return res.json();
    });
  },
  uploadTechnicianDocument: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return fetch(`${API_BASE}/uploads/document/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
      },
      body: form,
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Upload failed" }));
        throw new Error(err.detail || JSON.stringify(err));
      }
      return res.json();
    });
  },
  uploadTaskAttachment: (taskId: number, file: File) => {
    const form = new FormData();
    form.append("file", file);
    return fetch(`${API_BASE}/uploads/task/${taskId}/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
      },
      body: form,
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Upload failed" }));
        throw new Error(err.detail || JSON.stringify(err));
      }
      return res.json();
    });
  },
};
