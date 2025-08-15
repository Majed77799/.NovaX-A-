(function() {
  function $(id) { return document.getElementById(id); }

  function openModal() {
    const modal = $("settingsModal");
    if (modal) {
      modal.classList.remove("hidden");
      modal.setAttribute("aria-hidden", "false");
    }
  }

  function closeModal() {
    const modal = $("settingsModal");
    if (modal) {
      modal.classList.add("hidden");
      modal.setAttribute("aria-hidden", "true");
    }
  }

  function setStatus(text, isError) {
    const el = $("feedbackStatus");
    if (!el) return;
    el.textContent = text || "";
    el.style.color = isError ? "#ffb4b4" : "#b9c2e6";
  }

  function disableForm(disabled) {
    const submit = $("feedbackSubmit");
    const email = $("feedbackEmail");
    const message = $("feedbackMessage");
    if (submit) submit.disabled = disabled;
    if (email) email.disabled = disabled;
    if (message) message.disabled = disabled;
  }

  document.addEventListener("DOMContentLoaded", function() {
    const openBtn = $("settingsButton");
    const closeBtn = $("closeSettings");
    const cancelBtn = $("cancelFeedback");
    const modal = $("settingsModal");

    if (openBtn) openBtn.addEventListener("click", openModal);
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

    if (modal) {
      modal.addEventListener("click", function(e) {
        if (e.target === modal) {
          closeModal();
        }
      });
      document.addEventListener("keydown", function(e) {
        if (e.key === "Escape") closeModal();
      });
    }

    const form = $("feedbackForm");
    if (form) {
      form.addEventListener("submit", async function(e) {
        e.preventDefault();
        setStatus("Sending...", false);
        disableForm(true);
        try {
          const email = $("feedbackEmail")?.value || "";
          const message = $("feedbackMessage")?.value || "";

          const res = await fetch("/api/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, message })
          });

          const data = await res.json().catch(() => ({}));
          if (!res.ok || !data.ok) {
            throw new Error(data.error || "Failed to send feedback");
          }

          setStatus("Thanks for your feedback!", false);
          form.reset();
          setTimeout(closeModal, 800);
        } catch (err) {
          setStatus(err.message || "Something went wrong", true);
        } finally {
          disableForm(false);
        }
      });
    }
  });
})();