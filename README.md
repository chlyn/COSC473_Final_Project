# COSC47 Final Project  

Tic-Tac-Toe Adversarial Search & NanoGPT Text Generation

---

## 📌 Project Overview

This project explores two distinct areas of artificial intelligence:

1. **Part II – Exercise 4: Alpha-Beta Programming (Tic-Tac-Toe)**
   - Implements Minimax to evaluate all legal game states.
   - Optimizes search through Alpha-Beta pruning to eliminate irrelevant branches.
   - Produces a fully optimal Tic-Tac-Toe bot that does not lose under perfect play.

2. **Part V – Exercise 5: NanoGPT Text Generation**
   - Runs a locally hosted GPT model using NanoGPT (Tiny Shakespeare dataset).
   - Generates text from the pre-trained checkpoint.
   - Allows sampling variation through temperature, max token count, and seed.

Demo
---

## 🧠 Part II – Exercise 4: Alpha-Beta Programming (Tic-Tac-Toe)

### **Problem Requirement**
Implement a complete Tic-Tac-Toe engine using Minimax, then optimize it using Alpha-Beta pruning.  
The exercise specifies:

- Correct board state representation
- Legal child state generation
- Accurate detection of win, loss, draw
- Minimax value return: `-1`, `0`, or `1`
- Alpha-Beta pruning to remove branches that cannot affect optimal choice

### **Methods Used**
- Board encoded as 9-cell array
- Winning lines stored in predefined index sets
- Recursive Minimax search explores full decision tree
- Alpha-Beta stores upper/lower bounds to prune
- Move ordering used: center → corners → edges

### **Results**
- Bot never loses under optimal strategy
- Alpha-Beta reduces search dramatically  
  Example log:
minimaxNodes = 59705
alphaBetaNodes = 1702
pruned = 58003+

- Same output quality, far fewer expansions

### **Visualization**
- Left panel: human vs AI game board
- Right panel: Minimax/Alpha-Beta evaluation cards for each legal move
- Bottom console: real node count comparison for pruning vs non-pruning


## 📝 Part V – Exercise 5: NanoGPT Text Generation

### **Problem Requirement**
Run the pre-trained Tiny Shakespeare GPT model locally and generate text samples (≥100 characters).

The assignment requires:

- Cloning the NanoGPT repository
- Running provided inference script
- Producing original Shakespeare-style output

### 🎛 Sampling Parameters

| Parameter       | Description                                                                 |
|-----------------|-----------------------------------------------------------------------------|
| temperature     | Controls randomness: low values → predictable output, high values → varied style |
| max_new_tokens  | Determines total generated output length                                    |
| seed            | Keeps output consistent if the same settings are reused                     |

Sampling inputs (temperature, max token count, seed) are submitted before running generation. The resulting output is displayed in a text window along with the selected parameters, allowing direct comparison between different sampling configurations and their stylistic effects on Shakespeare-style text generation.
