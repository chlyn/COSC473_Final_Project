(function () {
  const buttons = document.querySelectorAll(".topbar-btn");
  const pathLabel = document.getElementById("path-label");

  const apps = {
    ttt: document.getElementById("app-ttt"),
    nanogpt: document.getElementById("app-nanogpt"),
  };

  function setApp(name) {
    Object.entries(apps).forEach(([key, el]) => {
      if (!el) return;
      el.classList.toggle("app-active", key === name);
    });

    buttons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.app === name);
    });

    if (pathLabel) {
      pathLabel.textContent =
        name === "nanogpt" ? "~/nanogpt/" : "~/tictactoe/";
    }
  }

  setApp("ttt");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const appName = btn.dataset.app;
      setApp(appName);
    });
  });
})();
