---
title: "How Platforms Know if An Image/Video is AI-Made"
date: "2025-10-04"
path: "/by_ai_or_human"
desc: "How platforms know if an image or video is made by AI, Cryptographic Provenance"
---

# Introduction
Platforms are increasingly adopting cryptographic provenance systems to verify if media was physically captured by a camera or generated artificially. At the core of this is <strong>public-key cryptography</strong> at the image sensor level, cameras are equipped with secure chips holding private keys to digitally sign photos as they are taken. For example, Leica's latest cameras implement the <i>Coalition for Content Provenance and Authenticity (C2PA)</i> standard: each photo from a [Leica M11-P](https://leica-camera.com/en-US/press/new-leica-m11-p) includes a <strong>forgery-proof digital signature</strong> documenting the camera model, manufacturer, and a hash of the image content. This signature is stored in metadata to form part of a <strong>[C2PA manifest](https://spec.c2pa.org/specifications/specifications/2.2/specs/C2PA_Specification.html)<strong> (which is basically a signed JSON) that is stuck with the file and allows anyone to verify if the image has been altered. Verification tools can check the signature against the camera's public certificate to confirm the photo's origin and detect any post-capture edits. 

