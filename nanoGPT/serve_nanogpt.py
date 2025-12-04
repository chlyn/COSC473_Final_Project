# serve_nanogpt.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import subprocess
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


@app.get("/generate")
def generate_text(
    temperature: float = 0.8,
    max_new_tokens: int = 500,
    seed: int = 1337,
):
    """
    Runs NanoGPT sample.py and returns its raw text output.
    Parameters come from the UI (temperature, max_new_tokens, seed).
    """

    cmd = [
        "py",
        "sample.py",
        "--out_dir=out-shakespeare-char",
        "--device=cpu",
        f"--temperature={temperature}",
        f"--max_new_tokens={max_new_tokens}",
        f"--seed={seed}",
    ]

    result = subprocess.check_output(
        cmd,
        text=True,
        cwd=BASE_DIR,
    )
    return {"output": result}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=5000)
