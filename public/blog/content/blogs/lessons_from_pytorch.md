---
title: "Lessons learned from contributing to PyTorch"
date: "2025-11-07"
path: "/pytorch_lessons"
desc: "Some lessons i've learned while contributing to PyTorch"
image: "/images/lessons-pytorch-cover.png"
---

PyTorch is the biggest codebase I have ever had to deal with, and the first time I opened it I wasn’t trying to “contribute to core” at all, I was just trying to make a failing test go green. A NumPy upgrade had broken code I relied on, error messages from torch.compile were long, and a downstream library (pyhf) had started pinning dependencies just to keep CI running. Chasing those problems pulled me into parts of PyTorch I’d never expected to touch, and along the way I ended up shipping three upstream fixes and affecting a small change in pyhf itself. This post is a reflection on that journey: what I learned about working inside a huge codebase, the pattern I now use to structure my contributions, and how you can apply the same ideas to your own first OSS PRs. 

## A mental model for working in a huge codebase

As I worked on my contributions, I kept coming back to three essential steps: **Stabilize, Isolate, Generalize**.

- **Stabilize**: Make the environment and failure modes predictable. If your dependencies and tests are shaky, everything built on top will wobble.
- **Isolate**: Shrink a vague symptom down to a minimal, reproducible behaviour, and turn it into a clear, early failure instead of a cryptic one.
- **Generalize**: When you fix something, try to fix the whole *class* of problems, not just the one test that’s failing today.

The rest of this post walks through that loop using three contributions to PyTorch and one related change in the high‑energy‑physics library `pyhf`. Together they show how small, well‑scoped changes in a giant codebase can ripple outward into the wider ecosystem.

### 1. Stabilize: Fixing NumPy 2.0 for PyTorch (and pyhf)

When NumPy 2.0 was released, it introduced a new `numpy.bool_` scalar type. PyTorch’s NumPy interop code tried to interpret these booleans as integers, which blew up with:

> `TypeError: 'numpy.bool' object cannot be interpreted as an integer`

This wasn’t just a theoretical bug. PyTorch’s own NumPy tests started failing (tracked in [issue #157973](https://github.com/pytorch/pytorch/issues/157973)), and any downstream project that used NumPy scalars with the PyTorch backend saw the same error. One of those projects was `pyhf`, a statistical modelling library used in high‑energy physics. Its maintainers ended up pinning `numpy<2.0` in the “PyTorch” extra and referencing the PyTorch issue in the commit message, just to keep CI green.

In [PR #158036](https://github.com/pytorch/pytorch/pull/158036) I fixed the root cause inside PyTorch’s Python C API. The change is small but very targeted: when PyTorch sees a NumPy scalar, it now checks explicitly if it’s a `numpy.bool_` (via `torch::utils::is_numpy_bool`) and, if so, calls `PyObject_IsTrue` to get its truth value instead of treating it as an integer. The accompanying tests exercise this path directly, so future refactors won’t silently re‑break it.

This is the **Stabilize** step in action:

- **Stabilize the foundation**: before touching any fancy compiler features, make sure basic tensor construction from NumPy doesn’t explode on new releases.
- **Remember the ecosystem**: a one‑line C‑API fix in PyTorch unlocks the possibility for downstream projects like `pyhf` to eventually remove their `numpy<2.0` pin and test against modern NumPy.
- **Write tests that mirror real failures**: the tests in the PR look a lot like the original failing cases from the NumPy interop suite, which keeps the fix anchored to actual user behaviour.

### 2. Isolate: Turning `ndarray.astype(object)` into a clear error

The other class of failures I kept hitting weren’t about versions, they were about mysterious compiler errors. If you called `torch.compile` on code that used `ndarray.astype("O")` or `astype(object)`, Dynamo would try to trace it and eventually die deep inside fake tensor propagation with something like:

> `torch.dynamo.exc.TorchRuntimeError: Dynamo failed to run FX node with fake tensors: ... got TypeError("data type 'O' not understood")`

This is technically “correct” since PyTorch can’t compile dynamic Python objects, but from a user’s perspective it’s terrible: there’s no clear statement that object‑dtype arrays are unsupported, and the error looks like a random internal failure.

In [PR #157810](https://github.com/pytorch/pytorch/pull/157810) I added a small but opinionated guardrail inside Dynamo’s NumPy handling. When `NumpyNdarrayVariable.call_method` sees `.astype("O")` or `.astype(object)`, it now immediately raises `torch._dynamo.exc.Unsupported` with an explicit explanation that object‑dtype NumPy arrays are not supported by `torch.compile`. A new test, `test_ndarray_astype_object_graph_break`, asserts that this error is raised both when compiling and when calling `astype` directly. During review, this even turned up a stale `xfail`: once the behaviour was fixed, a previously “expected to fail” test started passing and the `xfail` could be removed.

This is the **Isolate** step in practice:

- **Fail fast, at the right layer**: don’t let unsupported patterns wander into the compiler backend; stop them at the boundary with a clear `Unsupported` error.
- **Turn vague stack traces into concrete contracts**: by naming `ndarray.astype(object)` as unsupported, we give users something they can actually act on.
- **Use tests to document boundaries**: the new graph‑break test (and the removed `xfail`) make it obvious to future contributors that this pattern should never silently “work” again.

### 3. Generalize: Making `F.one_hot` work with transforms

The third category of issues I ran into was more subtle. `torch.func.jacfwd` would fail when it encountered `torch.nn.functional.one_hot` inside `torch.compile(dynamic=True)`, often only once dynamic shapes and fake tensors were involved. The existing vmap rule for `one_hot` expanded the operation into a pattern that allocated a zeros tensor and then scattered indices into it, which confused shape inference and did not play well with dynamic tracing.

In [PR #160837](https://github.com/pytorch/pytorch/pull/160837) I rewrote this behaviour in terms of a purely functional comparison. Instead of building a zeros tensor and scattering, the vmap rule now constructs class labels with `arange(num_classes)` and compares each index against that range with an expression like `eq(self.unsqueeze(-1), arange(num_classes)).to(kLong)`. This avoids the problematic scatter step entirely and gives Dynamo a simple, elementwise view of the operation that is easier to reason about under dynamic shapes. The change also updates the C++ batch rules and extends tests for dynamic tracing, JIT, and eager execution.

This is the **Generalize** step. Rather than patching one failing test, the goal is to design `F.one_hot` so that it behaves predictably across the whole transform ecosystem: `vmap`, `jacfwd`, `torch.compile(dynamic=True)`, and friends. Thinking this way turns a local bug fix into a broader improvement in how the library composes.

## Reflections on working inside PyTorch

Working inside PyTorch did not feel glamorous most of the time. It felt like reading unfamiliar subsystems until my brain couldn't take it anymnore, running the same failing test again and again as per usual with tests, and slowly building a mental map of where things lived. What helped most was treating every review comment and CI failure as a clue, not a verdict. One important lesson is that the maintainers were not asking for perfection. They were asking for clarity, good tests, and changes that fit the design of the project.

Another essential point to keep in mind is the importance of communication. After submitting your pull request, making the effort to communicate your intentions and decisions clearly can make a big difference in how the review process goes. For example, my very first pull request attracted more than forty comments from PyTorch maintainers. At first, it felt overwhelming, but actively engaging with their feedback asking clarifying questions, explaining my thought process, and being open to suggestions really helped move the discussion forward. Good communication also means being willing to revise your changes, to explain the reasoning behind what you have done, and to acknowledge misunderstandings or mistakes as they come up. Building this kind of open dialogue not only improves your code but also builds trust with reviewers and maintainers, making collaboration much more productive and enjoyable. I learned a lot from the comments left on my first PR and subsequent PRs received significantly less comments. 

Looking back, a few themes stand out:

- **You do not need to understand everything to fix something**: each PR touched a small part of the codebase. Over time the small understanding start to connect to form a bigger picture.
- **Tests are your compass**: if you can write a failing test that captures the bug, you always know when you are making progress.
- **Review is collaboration, not judgment**: every suggestion from a maintainer made the change more robust and more in line with the rest of PyTorch.

## How you can do it too if you're just starting out

If you want to contribute to a large project like PyTorch, you do not need to wait until you feel like an expert. You can start from the same place I did, with a real bug that affects you and a desire to make it go away in a principled way.

- **Pick a concrete problem**: look for an error in your own workflow, a failing test in a downstream project, or an issue labelled as a bug with a minimal reproduction. Dependency problems and confusing error messages are often good entry points because the scope is naturally narrow.
- **Stabilize your setup**: reproduce the problem in a clean environment, and capture the exact versions and commands that trigger it. This gives you a stable base and makes it easy for maintainers to follow your steps.
- **Isolate the behavior**: reduce the failure to the smallest script or test you can. If the problem is an unsupported feature, think about where the boundary should be and what error message would help a future user most.
- **Generalize the fix**: once the minimal case passes, ask how this code interacts with the rest of the system. For PyTorch that might mean trying eager mode, `torch.compile`, `vmap`, or different backends. Add tests that cover those cases so the improvement sticks.
- **Communicate clearly**: in your pull request description, explain the problem, the change, and why it is safe. Link to any issues or downstream breakages it addresses. Respond to review comments with context and be willing to revise.

The core idea is simple. Stabilize what you can see. Isolate the behavior you want to change. Generalize the fix so that it helps more than one user. This loop scales from tiny bug fixes to significant features, and it is a good way to navigate any codebase that feels larger than you are.

### Contributions

(Listed in order of completion)
- [PR #157810: feat(dynamo): raise UnsupportedError for ndarray.astype(object)](https://github.com/pytorch/pytorch/pull/157810)
- [PR #158036: #IS157973/numpy version issue](https://github.com/pytorch/pytorch/pull/158036)
- [PR #160837: feat(dynamo): make F.one_hot work with jacfwd + torch.compile(dynamic=True)](https://github.com/pytorch/pytorch/pull/160837)

Impact (pyhf PR by Matthew)
- [PR #2592 fix: Add temporary upper bounds on NumPy and SciPy to pass tests](https://github.com/scikit-hep/pyhf/commit/500e8e4e27c9695663929f83223d8835d31884f4)