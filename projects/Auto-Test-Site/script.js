document.addEventListener('DOMContentLoaded', function() {
  // Smooth scrolling for internal anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').substring(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Simple form handling (demo only)
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      if (name && email && message) {
        alert(`Thank you, ${name}! Your message has been received.`);
        form.reset();
      } else {
        alert('Please fill in all fields.');
      }
    });
  }
});
