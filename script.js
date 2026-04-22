const dockButtons = Array.from(document.querySelectorAll('.dock-item'));
const trackedSections = Array.from(document.querySelectorAll('main section[id]'));
const dockToggleButton = document.querySelector('.dock-toggle');
const dockBackdrop = document.querySelector('.dock-backdrop');

function closeMobileDock() {
  document.body.classList.remove('dock-open');
  if (dockToggleButton) {
    dockToggleButton.setAttribute('aria-expanded', 'false');
  }
}

function toggleMobileDock() {
  const isOpen = document.body.classList.toggle('dock-open');
  if (dockToggleButton) {
    dockToggleButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }
}

function setActiveButton(targetId) {
  for (const button of dockButtons) {
    const isActive = button.dataset.target === targetId;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-current', isActive ? 'true' : 'false');
  }
}

for (const button of dockButtons) {
  button.addEventListener('click', () => {
    const targetId = button.dataset.target;
    const section = document.getElementById(targetId);
    if (!section) return;

    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveButton(targetId);
    closeMobileDock();
  });
}

if (dockToggleButton) {
  dockToggleButton.addEventListener('click', toggleMobileDock);
}

if (dockBackdrop) {
  dockBackdrop.addEventListener('click', closeMobileDock);
}

window.addEventListener('resize', () => {
  if (window.innerWidth > 820) {
    closeMobileDock();
  }
});

const revealObserver = new IntersectionObserver(
  entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('in');
    }
  },
  { threshold: 0.2 }
);

for (const section of document.querySelectorAll('.reveal')) {
  revealObserver.observe(section);
}

let scrollTicking = false;

function pickActiveSection() {
  if (!trackedSections.length) return;

  if (window.scrollY <= 24) {
    setActiveButton('hero');
    return;
  }

  // Use a stable anchor point around the upper-middle viewport to avoid skipping.
  const anchorY = window.innerHeight * 0.34;
  let bestSection = trackedSections[0];
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const section of trackedSections) {
    const rect = section.getBoundingClientRect();
    const distance = Math.abs(rect.top - anchorY);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestSection = section;
    }
  }

  setActiveButton(bestSection.id);
}

function requestActiveSectionUpdate() {
  if (scrollTicking) return;
  scrollTicking = true;
  window.requestAnimationFrame(() => {
    pickActiveSection();
    scrollTicking = false;
  });
}

window.addEventListener('scroll', requestActiveSectionUpdate, { passive: true });
window.addEventListener('resize', requestActiveSectionUpdate);

pickActiveSection();

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name    = document.getElementById('contact-name').value.trim();
    const email   = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body    = encodeURIComponent(`From: ${name} <${email}>\n\n${message}`);
    window.location.href = `mailto:mcruz85@asu.edu?subject=${subject}&body=${body}`;
  });
}
