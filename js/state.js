window.WD_STATE = {
  currentUser: null,
  currentRole: null,
  currentProjectId: null,
  clientDashboard: null,
  designerDashboard: null
};

window.WD_STORE = {
  setUser(user) {
    WD_STATE.currentUser = user;
    sessionStorage.setItem('wd_user', JSON.stringify(user));
  },
  getUser() {
    if (WD_STATE.currentUser) return WD_STATE.currentUser;
    const raw = sessionStorage.getItem('wd_user');
    if (!raw) return null;
    try {
      WD_STATE.currentUser = JSON.parse(raw);
      return WD_STATE.currentUser;
    } catch {
      return null;
    }
  },
  setRole(role) {
    WD_STATE.currentRole = role;
    sessionStorage.setItem('wd_role', role);
  },
  getRole() {
    if (WD_STATE.currentRole) return WD_STATE.currentRole;
    const raw = sessionStorage.getItem('wd_role');
    if (!raw) return null;
    WD_STATE.currentRole = raw;
    return raw;
  },
  setProjectId(projectId) {
    WD_STATE.currentProjectId = projectId;
    sessionStorage.setItem('wd_project_id', projectId || '');
  },
  getProjectId() {
    if (WD_STATE.currentProjectId) return WD_STATE.currentProjectId;
    const raw = sessionStorage.getItem('wd_project_id');
    WD_STATE.currentProjectId = raw || null;
    return WD_STATE.currentProjectId;
  },
  reset() {
    WD_STATE.currentUser = null;
    WD_STATE.currentRole = null;
    WD_STATE.currentProjectId = null;
    WD_STATE.clientDashboard = null;
    WD_STATE.designerDashboard = null;
    sessionStorage.removeItem('wd_user');
    sessionStorage.removeItem('wd_role');
    sessionStorage.removeItem('wd_project_id');
  }
};
