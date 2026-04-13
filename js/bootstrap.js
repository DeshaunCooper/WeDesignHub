document.addEventListener('DOMContentLoaded', () => {
  const clientStartButtons = Array.from(document.querySelectorAll('[data-wd-client-login], .topnav-cta, .btn-primary'));
  const designerTriggers = Array.from(document.querySelectorAll('[data-wd-designer-login]'));

  async function promptClientLogin() {
    const email = prompt('Enter client email');
    if (!email) return;
    try {
      await WD_CLIENT.load(email.trim());
      if (typeof showPage === 'function') showPage('client-dash');
    } catch (error) {
      console.error(error);
      WD_UTILS.toast('Client dashboard failed to load.');
    }
  }

  async function promptDesignerLogin() {
    const email = prompt('Enter designer email');
    if (!email) return;
    try {
      await WD_DESIGNER.load(email.trim());
      if (typeof showPage === 'function') showPage('designer-dash');
    } catch (error) {
      console.error(error);
      WD_UTILS.toast('Designer dashboard failed to load.');
    }
  }

  clientStartButtons.forEach(button => {
    if (button.dataset.wdBound === 'true') return;
    button.dataset.wdBound = 'true';
    if ((button.textContent || '').toLowerCase().includes('designer')) return;

    button.addEventListener('dblclick', (event) => {
      event.preventDefault();
      promptClientLogin();
    });
  });

  designerTriggers.forEach(button => {
    if (button.dataset.wdBound === 'true') return;
    button.dataset.wdBound = 'true';
    button.addEventListener('click', (event) => {
      event.preventDefault();
      promptDesignerLogin();
    });
  });

  const rememberedRole = WD_STORE.getRole();
  const rememberedUser = WD_STORE.getUser();
  if (rememberedRole === 'client' && rememberedUser?.email) {
    WD_CLIENT.load(rememberedUser.email).catch(console.error);
  }
  if (rememberedRole === 'designer' && rememberedUser?.email) {
    WD_DESIGNER.load(rememberedUser.email).catch(console.error);
  }
});
