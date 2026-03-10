import api from "./axios.config.js";

const getRoles = async () => {
  try {
    const response = await api.get("/roles");
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching roles:", error.response?.data || error.message);
    throw error;
  }
};

const getGroupedPermissions = async () => {
  try {
    const response = await api.get("/permissions");
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching permissions:", error.response?.data || error.message);
    throw error;
  }
};

const getRoleWithPermissions = async (roleId) => {
  try {
    const response = await api.get(`/roles/${roleId}/permissions`);
    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching permissions for role ${roleId}:`, error.response?.data || error.message);
    throw error;
  }
};

// Cập nhật Role Permissions theo đặc tả: PUT /api/v1/roles/{roleId}/permissions
// Payload: ["CODE1", "CODE2", ...]
const updateRolePermissions = async (roleId, permissionCodes) => {
  try {
    const response = await api.put(`/roles/${roleId}/permissions`, permissionCodes);
    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error updating permissions for role ${roleId}:`, error.response?.data || error.message);
    throw error;
  }
};

export const roleService = {
  getRoles,
  getGroupedPermissions,
  getRoleWithPermissions,
  updateRolePermissions
};
