window.WD_API = (() => {
  const getBase = () => {
    const base = window.WD_CONFIG?.API_BASE_URL;
    if (!base || base.includes('REPLACE_WITH_YOUR_DEPLOYMENT')) {
      throw new Error('WD_CONFIG.API_BASE_URL is not configured.');
    }
    return base;
  };

  const get = async (action, params = {}) => {
    const url = new URL(getBase());
    url.searchParams.set('action', action);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, value);
      }
    });

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!res.ok) {
      throw new Error(`GET ${action} failed with status ${res.status}`);
    }

    const data = await res.json();
    if (data.ok === false) {
      throw new Error(data.error || `GET ${action} failed`);
    }

    return data;
  };

  const post = async (action, payload = {}) => {
    const res = await fetch(getBase(), {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, ...payload })
    });

    if (!res.ok) {
      throw new Error(`POST ${action} failed with status ${res.status}`);
    }

    const data = await res.json();
    if (data.ok === false) {
      throw new Error(data.error || `POST ${action} failed`);
    }

    return data;
  };

  return {
    getClientDashboard(email) {
      return get('getClientDashboard', { email });
    },
    getDesignerDashboard(email) {
      return get('getDesignerDashboard', { email });
    },
    getProject(projectId) {
      return get('getProject', { projectId });
    },
    getTasks(projectId) {
      return get('getTasks', { projectId });
    },
    getMessages(projectId) {
      return get('getMessages', { projectId });
    },
    getFiles(projectId) {
      return get('getFiles', { projectId });
    },
    sendMessage(payload) {
      return post('sendMessage', payload);
    },
    updateTask(payload) {
      return post('updateTask', payload);
    },
    updateProjectStatus(payload) {
      return post('updateProjectStatus', payload);
    },
    createProject(payload) {
      return post('createProject', payload);
    },
    loginByEmail(email) {
      return get('loginByEmail', { email });
    }
  };
})();
