window.WD_CLIENT = (() => {
  function normalizeDashboard(data) {
    return {
      user: data.user || {},
      project: data.project || {},
      tasks: data.tasks || [],
      messages: data.messages || [],
      files: data.files || []
    };
  }

  function renderOverview(dash) {
    WD_UTILS.setText('#client-overview h1', `Welcome back, ${dash.user.name || 'Client'}`);
    const progress = dash.project.progress ?? 0;
    const stage = dash.project.current_stage || '—';
    const due = WD_UTILS.formatDate(dash.project.due_date);
    WD_UTILS.setText('#client-overview p', `Your project is ${progress}% complete · Next milestone: ${stage} — ${due}`);

    const cardTitle = document.querySelector('#client-overview .dash-card-title');
    if (cardTitle) cardTitle.textContent = `${dash.project.project_name || 'Project'} — ${dash.project.package || 'Package'}`;

    const projectCardBody = document.querySelector('#client-overview .dash-card div[style*="padding:20px"]');
    if (projectCardBody) {
      projectCardBody.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px">
          <div style="padding:14px;border:1px solid #e5e7eb;border-radius:10px;background:#fafafa">
            <div style="font-size:12px;color:#6b7280;margin-bottom:6px">Current Stage</div>
            <div style="font-size:15px;font-weight:600">${WD_UTILS.escapeHTML(dash.project.current_stage || '—')}</div>
          </div>
          <div style="padding:14px;border:1px solid #e5e7eb;border-radius:10px;background:#fafafa">
            <div style="font-size:12px;color:#6b7280;margin-bottom:6px">Due Date</div>
            <div style="font-size:15px;font-weight:600">${WD_UTILS.escapeHTML(WD_UTILS.formatDate(dash.project.due_date))}</div>
          </div>
          <div style="padding:14px;border:1px solid #e5e7eb;border-radius:10px;background:#fafafa">
            <div style="font-size:12px;color:#6b7280;margin-bottom:6px">Progress</div>
            <div style="font-size:15px;font-weight:600">${dash.project.progress ?? 0}%</div>
          </div>
          <div style="padding:14px;border:1px solid #e5e7eb;border-radius:10px;background:#fafafa">
            <div style="font-size:12px;color:#6b7280;margin-bottom:6px">Status</div>
            <div style="font-size:15px;font-weight:600">${WD_UTILS.escapeHTML(dash.project.status || 'Pending')}</div>
          </div>
        </div>
      `;
    }
  }

  function renderProject(dash) {
    const target = document.getElementById('client-project');
    if (!target) return;

    target.innerHTML = `
      <div class="proj-detail">
        <div class="proj-header">
          <div>
            <div class="proj-h1">${WD_UTILS.escapeHTML(dash.project.project_name || 'Project')}</div>
            <div class="proj-meta">${WD_UTILS.escapeHTML(dash.project.package || 'Package')} · ${WD_UTILS.escapeHTML(dash.project.status || 'Pending')}</div>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            ${dash.project.stripe_link ? `<a class="btn-primary" href="${dash.project.stripe_link}" target="_blank" rel="noopener">Pay Now</a>` : ''}
            ${dash.project.calendly_link ? `<a class="btn-secondary" href="${dash.project.calendly_link}" target="_blank" rel="noopener">Book Call</a>` : ''}
          </div>
        </div>

        <div class="stage-bar">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <strong>Project Progress</strong>
            <span>${dash.project.progress ?? 0}%</span>
          </div>
          <div class="prog-track"><div class="prog-fill" style="width:${Number(dash.project.progress || 0)}%"></div></div>
        </div>

        <div class="dash-card">
          <div class="dash-card-header">
            <div class="dash-card-title">Open Tasks</div>
          </div>
          ${dash.tasks.length ? dash.tasks.map(task => `
            <div class="task-item">
              <div class="task-check" style="${task.completed ? 'background:#111;border-color:#111' : ''}"></div>
              <div>
                <div class="task-text">${WD_UTILS.escapeHTML(task.title)}</div>
                <div class="task-meta">${WD_UTILS.escapeHTML(task.priority || 'normal')} priority · due ${WD_UTILS.escapeHTML(WD_UTILS.formatDate(task.due_date))}</div>
              </div>
            </div>
          `).join('') : '<div style="padding:20px;color:#6b7280">No tasks yet.</div>'}
        </div>
      </div>
    `;
  }

  function renderFiles(dash) {
    const target = document.getElementById('client-files');
    if (!target) return;

    target.innerHTML = `
      <div class="dash-content">
        <div class="dash-greeting">
          <h1>Files</h1>
          <p>Everything your project needs, without the scavenger hunt.</p>
        </div>
        <div class="cx-deliveries">
          <div class="cx-del-header">Project Assets</div>
          ${dash.files.length ? dash.files.map(file => `
            <a class="cx-del-row" href="${file.file_url}" target="_blank" rel="noopener" style="text-decoration:none;color:inherit">
              <div class="cx-file-icon">${WD_UTILS.escapeHTML((file.file_type || 'FILE').slice(0, 3).toUpperCase())}</div>
              <div class="cx-file-name">${WD_UTILS.escapeHTML(file.file_name)}</div>
              <div class="cx-file-size">${WD_UTILS.escapeHTML(WD_UTILS.formatDate(file.created_at))}</div>
            </a>
          `).join('') : '<div style="padding:20px;color:#6b7280">No files uploaded yet.</div>'}
        </div>
      </div>
    `;
  }

  function renderMessages(dash) {
    const target = document.getElementById('client-messages');
    if (!target) return;

    target.innerHTML = `
      <div class="dash-content">
        <div class="dash-greeting">
          <h1>Messages</h1>
          <p>Keep the thread clean. Keep the project moving.</p>
        </div>
        <div class="dash-card" style="margin-bottom:16px">
          ${dash.messages.length ? dash.messages.map(msg => `
            <div style="padding:16px 20px;border-bottom:1px solid #f3f4f6">
              <div style="display:flex;justify-content:space-between;gap:10px;margin-bottom:4px">
                <strong>${WD_UTILS.escapeHTML(msg.sender_name || msg.sender_email || 'Unknown')}</strong>
                <span style="color:#9ca3af;font-size:12px">${WD_UTILS.escapeHTML(WD_UTILS.formatDate(msg.created_at))}</span>
              </div>
              <div style="font-size:14px;line-height:1.6;color:#374151">${WD_UTILS.escapeHTML(msg.body || '')}</div>
            </div>
          `).join('') : '<div style="padding:20px;color:#6b7280">No messages yet.</div>'}
        </div>

        <form id="wd-client-message-form" class="dash-card" style="padding:16px 20px">
          <label style="display:block;font-size:13px;font-weight:600;margin-bottom:8px">New Message</label>
          <textarea id="wd-client-message-input" rows="4" style="width:100%;padding:12px;border:1px solid #e5e7eb;border-radius:10px;font:inherit" placeholder="Type your update here..."></textarea>
          <div style="margin-top:12px;display:flex;justify-content:flex-end">
            <button class="btn-primary" type="submit">Send Message</button>
          </div>
        </form>
      </div>
    `;

    const form = document.getElementById('wd-client-message-form');
    form?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const input = document.getElementById('wd-client-message-input');
      const body = input?.value?.trim();
      if (!body) return;

      const user = WD_STORE.getUser();
      const projectId = WD_STORE.getProjectId();

      try {
        await WD_API.sendMessage({
          projectId,
          senderEmail: user?.email,
          senderName: user?.name,
          role: 'client',
          body
        });

        input.value = '';
        await load(user?.email);
      } catch (error) {
        console.error(error);
        WD_UTILS.toast('Message failed to send.');
      }
    });
  }

  async function load(email) {
    const data = await WD_API.getClientDashboard(email);
    const dash = normalizeDashboard(data);
    WD_STATE.clientDashboard = dash;
    WD_STORE.setUser(dash.user);
    WD_STORE.setRole('client');
    WD_STORE.setProjectId(dash.project.project_id);
    renderOverview(dash);
    renderProject(dash);
    renderFiles(dash);
    renderMessages(dash);
    return dash;
  }

  return { load };
})();
