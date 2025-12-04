(function () {
  const btn = document.getElementById("ngpt-generate");
  const input = document.getElementById("ngpt-input");
  const out = document.getElementById("ngpt-output");
  const status = document.getElementById("ngpt-status");
  const feedback = document.getElementById("ngpt-feedback");

  if (!input || !out || !status || !btn) return;

  const EXPECTED_CMD =
    "py sample.py --out_dir=out-shakespeare-char --device=cpu";

  let isRunning = false;

  async function runNanoGPT(cmd) {
    const trimmed = cmd.trim();

    if (!trimmed) {
      feedback.textContent = "Paste the command, then press Enter or click Run.";
      return;
    }

    isRunning = true;
    btn.disabled = true;
    btn.textContent = "Running...";

    if (trimmed === EXPECTED_CMD) {
      feedback.textContent = "Executing suggested command...";
    } else {
      feedback.textContent = `Executing custom command: ${trimmed}`;
    }

    status.textContent = `NanoGPT is thinking really hard… please wait!`;
    out.textContent = "Generating...";

    try {
      const res = await fetch("http://127.0.0.1:5000/generate");
      const data = await res.json();

      out.textContent = data.output;
      status.textContent = "Generation complete :)";
      feedback.textContent = "Command finished";
    } catch (err) {
      out.textContent = "Error calling NanoGPT server. Is serve_nanogpt.py running?";
      status.textContent = "Generation failed :(";
      feedback.textContent = "Command failed!!!";
    }

    isRunning = false;
    btn.disabled = false;
    btn.textContent = "Reset";
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (isRunning) return;
      runNanoGPT(input.value);
    }
  });

  btn.addEventListener("click", () => {
    if (isRunning) return;

    const cmd = input.value || EXPECTED_CMD;
    runNanoGPT(cmd);
  });
})();
