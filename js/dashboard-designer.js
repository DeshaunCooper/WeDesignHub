window.WD_DESIGNER = (() => {
  function renderTopBar(email) {
    const avatar = document.querySelector('#page-designer-dash .dash-avatar');
    const name = document.querySelector('#page-designer-dash .dash-user-name');
    const role = document.querySelector('#page-designer-dash .dash-user-role');

    if (avatar) avatar.textContent = WD_UTILS.initials(email);
    if (name) name.textContent = email;
    if (role) role.textContent = 'Designer';
  }

  function renderDashboard(data) {
    const root = document.getElementById('designer-dashboard');
    if (!root) return;

    const projects = data.projects || [];
    const tasks = data.tasks || [];
    const openTasks = tasks.filter(t => !t.completed).length;
    const activeProjects = projects.filter(p => (p.status || '').toLowerCase() !== 'complete').length;

    root.innerHTML = `
      <div class="dash-content">
        <div class="dash-greeting">
          <h1>Designer Dashboard</h1>
          <p>Keep projects moving. Kill bottlenecks fast.</p>
        </div>

        <div class="stat-row">
          <div class="stat-card">
            <div class="stat-label">Projects</div>
            <div class="stat-val">${projects.length}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Active</div>
            <div class="stat-val">${activeProjects}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Open Tasks</div>
            <div class="stat-val">${openTasks}</div>
          </div>
        </div>

        <div class="dash-two-col">
          <div class="dash-card">
            <div class="dash-card-header">
              <div class="dash-card-title">Projects</div>
            </div>
            ${projects.length ? projects.map(project => `
              <div class="proj-row">
                <div style="flex:1">
                  <div class="proj-name">${WD_UTILS.escapeHTML(project.project_name)}</div>
                  <div class="proj-sub">${WD_UTILS.escapeHTML(project.client_name || project.client_email || '')} · ${WD_UTILS.escapeHTML(project.status || 'Pending')}</div>
                </div>
                <div class="proj-prog">
                  <div class="prog-track"><div class="prog-fill" style="width:${Number(project.progress || 0)}%"></div></div>
                  <div class="prog-pct">${Number(project.progress || 0)}%</div>
                </div>
              </div>
            `).join('') : '<div style="padding:20px;color:#6b7280">No projects yet.</div>'}
          </div>

          <div class="dash-card">
            <div class="dash-card-header">
              <div class="dash-card-title">Recent Tasks</div>
            </div>
            ${tasks.slice(0, 8).length ? tasks.slice(0, 8).map(task => `
              <div class="task-item">
                <button class="task-check wd-task-toggle" data-task-id="${WD_UTILS.escapeHTML(task.task_id)}" style="${task.completed ? 'background:#111;border-color:#111' : ''}"></button>
                <div>
                  <div class="task-text">${WD_UTILS.escapeHTML(task.title)}</div>
                  <div class="task-meta">${WD_UTILS.escapeHTML(task.project_name || '')} · ${WD_UTILS.escapeHTML(task.priority || 'normal')}</div>
                </div>
              </div>
            `).join('') : '<div style="padding:20px;color:#6b7280">No tasks yet.</div>'}
          </div>
        </div>
      </div>
    `;

    root.querySelectorAll('.wd-task-toggle').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          await WD_API.updateTask({
            taskId: btn.dataset.taskId,
            completed: btn.style.backgroundColor !== 'rgb(17, 17, 17)'
          });
          const user = WD_STORE.getUser();
          await load(user?.email);
        } catch (error) {
          console.error(error);
          WD_UTILS.toast('Task update failed.');
        }
      });
    });
  }

  function renderProjects(data) {
    const root = document.getElementById('designer-projects');
    if (!root) return;

    const projects = data.projects || [];
    root.innerHTML = `
      <div class="dash-content">
        <div class="dash-greeting">
          <h1>Projects</h1>
          <p>Update status, move stages, keep the machine fed.</p>
        </div>

        ${projects.map(project => `
          <div class="dash-card" style="margin-bottom:16px">
            <div class="dash-card-header">
              <div class="dash-card-title">${WD_UTILS.escapeHTML(project.project_name)}</div>
              <span>${WD_UTILS.escapeHTML(project.status || 'Pending')}</span>
            </div>
            <div style="padding:16px 20px">
              <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px">
                <input data-field="status" data-project-id="${WD_UTILS.escapeHTML(project.project_id)}" value="${WD_UTILS.escapeHTML(project.status || '')}" placeholder="Status" style="padding:10px;border:1px solid #e5e7eb;border-radius:8px">
                <input data-field="progress" data-project-id="${WD_UTILS.escapeHTML(project.project_id)}" value="${WD_UTILS.escapeHTML(project.progress || 0)}" placeholder="Progress" style="padding:10px;border:1px solid #e5e7eb;border-radius:8px">
                <input data-field="currentStage" data-project-id="${WD_UTILS.escapeHTML(project.project_id)}" value="${WD_UTILS.escapeHTML(project.current_stage || '')}" placeholder="Current Stage" style="padding:10px;border:1px solid #e5e7eb;border-radius:8px">
                <button class="btn-primary wd-project-save" data-project-id="${WD_UTILS.escapeHTML(project.project_id)}">Save</button>
              </div>
              <div style="margin-top:12px;color:#6b7280;font-size:13px">${WD_UTILS.escapeHTML(project.client_name || project.client_email || '')}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    root.querySelectorAll('.wd-project-save').forEach(button => {
      button.addEventListener('click', async () => {
        const projectId = button.dataset.projectId;
        const status = root.querySelector(`[data-field="status"][data-project-id="${projectId}"]`)?.value;
        const progress = root.querySelector(`[data-field="progress"][data-project-id="${projectId}"]`)?.value;
        const currentStage = root.querySelector(`[data-field="currentStage"][data-project-id="${projectId}"]`)?.value;

        try {
          await WD_API.updateProjectStatus({
            projectId,
            status,
            progress,
            currentStage
          });
          const user = WD_STORE.getUser();
          await load(user?.email);
        } catch (error) {
          console.error(error);
          WD_UTILS.toast('Project update failed.');
        }
      });
    });
  }

  function renderTasks(data) {
    const root = document.getElementById('designer-tasks');
    if (!root) return;

    const tasks = data.tasks || [];
    root.innerHTML = `
      <div class="dash-content">
        <div class="dash-greeting">
          <h1>Tasks</h1>
          <p>The work queue. No mystery. No excuses.</p>
        </div>

        <div class="dash-card">
          ${tasks.length ? tasks.map(task => `
            <div class="task-item">
              <button class="task-check wd-task-toggle" data-task-id="${WD_UTILS.escapeHTML(task.task_id)}" style="${task.completed ? 'background:#111;border-color:#111' : ''}"></button>
              <div>
                <div class="task-text">${WD_UTILS.escapeHTML(task.title)}</div>
                <div class="task-meta">${WD_UTILS.escapeHTML(task.project_name || '')} · ${WD_UTILS.escapeHTML(task.priority || 'normal')} · due ${WD_UTILS.escapeHTML(WD_UTILS.formatDate(task.due_date))}</div>
              </div>
            </div>
          `).join('') : '<div style="padding:20px;color:#6b7280">No tasks yet.</div>'}
        </div>
      </div>
    `;

    root.querySelectorAll('.wd-task-toggle').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          await WD_API.updateTask({
            taskId: btn.dataset.taskId,
            completed: btn.style.backgroundColor !== 'rgb(17, 17, 17)'
          });
          const user = WD_STORE.getUser();
          await load(user?.email);
        } catch (error) {
          console.error(error);
          WD_UTILS.toast('Task update failed.');
        }
      });
    });
  }

  async function load(email) {
    const data = await WD_API.getDesignerDashboard(email);
    WD_STATE.designerDashboard = data;
    WD_STORE.setUser({ email, name: email });
    WD_STORE.setRole('designer');
    renderTopBar(email);
    renderDashboard(data);
    renderProjects(data);
    renderTasks(data);
    return data;
  }

  return { load };
})();
