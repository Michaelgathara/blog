---
title: "Lessons Learned building my own Mini-GPT"
date: "2025-04-29"
path: "/lessons_building_gpts"
desc: "The lessons I learned while building and training my own Mini-GPT"
tags: ["AI", "GPT", "NLP", "PyTorch", "Machine Learning", "DIY"]
---

> **TL;DR**  
> * A four-file codebase (`transformer.py`, `params.py`, `gpt.py`, `inference.py`) is enough for a working GPT clone.  
> * `transformer.py` holds the model, `params.py` the knobs, `gpt.py` the trainer, `inference.py` the text generator.  
> * Streaming **FineWeb-Edu** keeps memory in check; gradient checkpointing and Flash Attention keep GPU use in check.  
> * Cosine warm‑up plus AdamW is a good default; mixed precision is free speed.  
> * The whole run fits on one modern consumer GPU if you accept slow epochs.

## 1. Why I Tried This

I wanted to understand every moving part of a language model instead of treating `transformers` as a black box. Training something *smaller* than GPT‑2 but more modern felt like the right scope for a weekend project and a future blog series.

## 2. The Four Core Files

| file | job |
|------|-----|
| **`transformer.py`** | defines the architecture: embeddings → 24 blocks → LayerNorm → LM head. Each block has Multi‑Head Attention, SwiGLU feed‑forward, residual paths, and optional Flash Attention and gradient checkpointing. |
| **`params.py`** | wraps every hyper‑parameter in `ModelConfig`, including layer count, learning rate, scheduler steps, and flags for Flash Attention and checkpointing. |
| **`gpt.py`** | orchestrates training on a single GPU, builds the data stream, starts the scheduler, saves checkpoints, and writes logs. It also samples text after every eval loop for quick sanity checks. |
| **`inference.py`** | reloads any saved checkpoint and offers a CLI for prompt‑based generation. It unwraps DDP prefixes, compiles the model for speed, and supports temperature and top‑k tuning. |

> **Takeaway**  
> Keeping roles strict and separate made debugging painless. If you add a feature you always know *which* file needs the change.

## 3. Building the Model (`transformer.py`)

1. **Embeddings** – Token and position embeddings are added together up front.
2. **Attention** – Single‑head Flash is used when the GPU supports it; otherwise the code falls back to a masked softmax.
3. **Feed‑Forward** – SwiGLU activation gives a pleasant bump over ReLU with zero extra code.
4. **Gradient Checkpointing** – Enabled via `use_gradient_checkpoint`; it let me fit ~1 B params on a 24 GB card (steps are slower though).
5. **Generate Method** – Included directly so inference needs no external libraries.

## 4. Training Pipeline (`gpt.py`)

### 4.1 Data

FineWeb‑Edu is streamed, so nothing huge sits in RAM. Each text field is tokenized on the fly, chunked into 1 024‑token blocks, and fed forward. The first 1 000 samples become a tiny validation split.

### 4.2 Scheduler

```python
scheduler = CosineWarmupScheduler(
    optimizer,
    warmup_iters=1500,
    max_iters=100000
)
```

It felt smooth enough that I never tuned decay further.

### 4.3 Mixed Precision

`torch.amp.autocast` wraps both forward passes and generation. On my card the gain was about *1.6 ×*.

### 4.4 Checkpoints and Resumes

* logs current train and validation loss
* saves the best model so far if `val_loss` improves
* advances the scheduler correctly when resuming

## 5. Inference (`inference.py`)

```bash
python inference.py checkpoints_1B/best_model.pt \
  --prompt "Explain diffusion models to a high‑school student" \
  --temperature 0.7 --top_k 40
```

The script warns if the tokenizer and checkpoint vocab sizes disagree, then streams output to the console.

## 6. What Tripped Me Up

| pain point | fix |
|------------|-----|
| Pad token id mismatch caused `index out of range`. | Force `tokenizer.pad_token = tokenizer.eos_token`. |
| Installing Flash Attention | uv pip install torch then uv pip install flash-attn --no-build-isolation |
| Validation stream ended mid‑epoch. | Catch `StopIteration`, shrink `max_iters`, exit cleanly. |
| DDP `module.` prefixes broke inference. | Strip them when loading checkpoints on a single GPU. |

## 7. How **You** Can Reproduce This

1. Clone the repo or copy the four files above.  
2. `pip install torch transformers datasets flash-attn==2.*` (if your GPU supports it).  
3. Tweak `params.py` to fit your GPU memory.  
4. Run `python gpt.py` and let the first epoch build the cache.  
5. Watch `training_single_gpu.log` for progress.  
6. Once a checkpoint appears, run `inference.py` as shown.  
7. Tune the prompt and enjoy the samples.

## 8. Ideas for the Next Iteration

* Replace positional embeddings with RoPE for longer context.  
* Swap SwiGLU for Gated SiLU‑MHA.  
* Add LoRA for quick fine‑tuning.  
* Push logs to TensorBoard for nicer charts.

## 9. Closing Thoughts

A weekend with a tight codebase taught me more than weeks of reading papers. Building from scratch demystified schedulers, masking, and sampling. The *small* GPT is already good enough for niche tasks, and scaling up now feels straightforward.

Feel free to fork, tweak, and share your own results—ping me if you improve the recipe!