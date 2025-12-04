(function () {
    const btn = document.getElementById("ngpt-generate");
    const input = document.getElementById("ngpt-input");
    const out = document.getElementById("ngpt-output");
    const status = document.getElementById("ngpt-status");
    const feedback = document.getElementById("ngpt-feedback");
    const tempSlider = document.getElementById("ngpt-temp");
    const tempValue = document.getElementById("ngpt-temp-value");
    const tokensInput = document.getElementById("ngpt-tokens");
    const seedInput = document.getElementById("ngpt-seed");

    if (!input || !out || !status || !btn) return;

    const EXPECTED_CMD =
        "py sample.py --out_dir=out-shakespeare-char --device=cpu";

    let isRunning = false;

    if (tempSlider && tempValue) {
        tempValue.textContent = tempSlider.value;
        tempSlider.addEventListener("input", () => {
            tempValue.textContent = tempSlider.value;
        });
    }

    async function runNanoGPT(cmdFromUser) {
        const trimmed = cmdFromUser.trim();

        if (!trimmed) {
        feedback.textContent =
            "Paste the command, then press Enter or click Run.";
        return;
        }

        const temperature = tempSlider ? parseFloat(tempSlider.value) : 0.8;
        const maxTokens = tokensInput
            ? parseInt(tokensInput.value || "500", 10)
            : 500;
        const seed = seedInput ? parseInt(seedInput.value || "1337", 10) : 1337;

        isRunning = true;
        btn.disabled = true;
        btn.textContent = "Running...";

        if (trimmed === EXPECTED_CMD) {
            feedback.textContent = "Executing suggested command with your settings...";
        } 
        else {
            feedback.textContent = "Executing custom command with your settings...";
        }

        status.textContent = "NanoGPT is thinking really hard… please wait!";
        out.textContent = "Generating...";

        try {
            const params = new URLSearchParams({
                temperature: String(temperature),
                max_new_tokens: String(maxTokens),
                seed: String(seed),
            });

            const res = await fetch(
                `http://127.0.0.1:5000/generate?${params.toString()}`
            );
            const data = await res.json();

            out.textContent = data.output;
            status.textContent = "Generation complete :)";
            feedback.textContent = "Command finished";

            document.getElementById("ngpt-meta").innerHTML =
                `temp ≈ ${temperature} &nbsp;|&nbsp; tokens ≈ ${maxTokens} &nbsp;|&nbsp; seed ≈ ${seed}`;

        } catch (err) {
            console.error(err);
            out.textContent =
                "Error calling NanoGPT server. Is serve_nanogpt.py running?";
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
            const cmd = input.value || EXPECTED_CMD;
            runNanoGPT(cmd);
        }
    });

    btn.addEventListener("click", () => {
        if (isRunning) return;
        const cmd = input.value || EXPECTED_CMD;
        runNanoGPT(cmd);
    });

})();
