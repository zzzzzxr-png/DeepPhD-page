# DeepPhD Website Implementation Prompt

This is the working prompt for modifying the website. It is an implementation specification, not an editorial essay.

Editorial constraint (do not drop):

- Reorganize presentation. Do not rewrite science.
- Every scientific sentence must be traceable to the manuscript or SI.
- Do not invent slogans, new claims, fake demos, or unsupported generalization.
- Homepage scientific wording may come from the **Abstract and/or Introduction**.

---

## Source files

- Manuscript: `E:\DeepPhD\DeepPhD_page\DeepPhD-page\1-DeepPhD_Article_v13.docx`
- Supplementary Information: `E:\DeepPhD\DeepPhD_page\DeepPhD-page\2-Supplementary Information_v14.docx`
- Existing site: this repository (`index.html`, `About.md`, `Gallery.md`, `Tutorial.md`, `Datasets.md`, `images/`)

---

## Before modifying the website

Extract a table mapping every webpage section to its manuscript source paragraph, figure, supplementary figure, and video.

Do not start layout or CSS work until that table exists.

---

## When modifying the website

- Keep existing scientific wording unless replacing it with manuscript-derived text.
- Replace dense text blocks with: one sentence; figure/video; expandable details.
- Add interactions only around existing figures/videos.
- Do not generate new scientific claims.
- Do not create fake demos.

---

# DeepPhD Website Layout Specification

## Overall design language

Reference style:

- Nature Methods / Nature Biotechnology project pages
- SAM 2 project page style
- modern CVPR project pages with interactive demonstrations

Design principles:

- large scientific visual first;
- minimal text;
- sentence-based scientific headings;
- expandable details;
- interactive visualization only when supported by existing data.

Avoid:

- dense paragraphs;
- paper PDF style layout;
- repeated figure panels;
- decorative animations.

---

# HOME PAGE LAYOUT

## Overall structure

Use a single-column scrolling layout.

A fixed right-side navigation bar follows scrolling.

Structure:

```
Navbar
Hero
Why physics-informed principle
Physical model validation
Denoising performance
Biological applications
Footer
```

Right navigation:

- Overview
- Physical principle
- Noise modeling
- Denoising
- Applications

The active section should be highlighted while scrolling.

---

## HOME 1 — Hero section

### Layout

Full-width section.

```
Title
Short abstract-derived description
[Paper] [Code] [Tutorial]
Interactive demo
Raw | DeepPhD comparison
```

### Visual

Main visual occupies approximately 70% of viewport height.

Use a Before/After video slider.

```
             DeepPhD
                |
                |
Raw ------------|------------
                |
          draggable divider
```

Implementation:

- two synchronized videos;
- one video clipped by CSS;
- vertical draggable divider.

### Below demo

Small metadata only. Example:

- Two-photon microscopy
- Dendritic spine calcium imaging

Do not add long explanations.

---

## HOME 2 — Physical principle

Scientific purpose: explain why physics is incorporated. Do not explain detailed architecture.

Homepage may use Introduction wording here.

### Layout

Two-column.

```
Text                 Illustration
Scientific           Fluorescence
statement             imaging
                      noise formation
```

### Left

One sentence from Introduction. Example:

Fluorescence photons undergo multiple stages of photoelectric conversion, amplification, readout, and digitization, during which distinct noise sources are accumulated.

### Right

Simplified illustration:

```
Photon detection
↓
Electronic readout
↓
Digital image
↓
MPGN + FPN + RN
```

### Interaction

Hover over MPGN / FPN / RN. Display original terminology only.

---

## HOME 3 — Physical model validation

Purpose: show that the learned physical model corresponds to real noise.

### Layout

Large figure + small explanation.

```
Title
One sentence
[large validation figure]
More information ↓
```

### Visual

Use:

- α / β estimation;
- FPN/RN estimation.

Do not place all validation plots. Select strongest representative examples.

### Interaction

Tabs: MPGN | FPN | RN. Each tab switches existing figure content.

---

## HOME 4 — Denoising performance

Purpose: show final restoration improvement.

### Layout

Comparison-first.

```
Raw        DeepPhD        Reference
quantitative result
More information
```

### Visual

Use:

- representative restoration image;
- SNR curve.

### Interaction

Optional method selector (Raw / DeepPhD / SRDTrans / GT) only if the existing comparison images are available.

---

## HOME 5 — Biological applications

Purpose: show downstream value.

### Layout

Four cards.

```
Biological applications
[Neural activity]
[Structural analysis]
[Segmentation]
[Tracking]
```

### Card design

Each card:

- Image/video thumbnail
- Application title
- One sentence
- View details →

Click opens the corresponding Gallery / Application section.

---

# ABOUT PAGE LAYOUT

Purpose: Methods. More technical than Home.

## About 1 — Framework overview

```
DeepPhD framework
Fig.1c
Caption
```

## About 2 — Detailed workflow

```
Detailed workflow
Supplementary workflow figure
Stage 1
Stage 2
Stage 3
```

## About 3 — Physical noise model

Two-column.

```
Text       Equation / diagram
```

Use MPGN / FPN / RN.

## About 4 — Optimization

Pipeline:

```
Input
↓
Noise modeling
↓
Noise decoupling
↓
Restoration
↓
Output
```

---

# RESULTS PAGE LAYOUT

Purpose: detailed evidence.

## Results 1 — Physical model validation

Does DeepPhD learn the correct noise physics?

```
Figure
Caption
Quantitative validation
```

## Results 2 — Denoising performance

Does physical modeling improve restoration?

```
Benchmark table
↓
Representative images
↓
Quantitative curves
```

## Results 3 — Biological validation

Does improved restoration enable downstream analysis?

```
Raw
↓
DeepPhD
↓
Downstream analysis
↓
Quantitative measurement
```

---

# GALLERY PAGE LAYOUT

Purpose: supplementary videos.

Each video block:

```
Video title
Video player
Representative images
Downstream analysis
Related figure
```

Example:

DeepPhD reveals calcium transients of dendritic spines in the mouse cortex.

[video]

Related analysis: fluorescence traces; structural preservation.

Related figure: Fig. 5.

---

# VIDEO IMPLEMENTATION SPECIFICATION

## Video format

Use MP4 / WebM. Avoid GIF.

## Homepage comparison slider

Required files:

- `raw.mp4`
- `deepphd.mp4`
- `reference.mp4` (optional)

Same width, height, FPS, duration, and crop.

### Web implementation

Container: `position: relative; overflow: hidden`

Layers:

- background: Raw video
- foreground: DeepPhD video
- `clip-path` controlled by slider

Divider: vertical line + draggable handle.

## Gallery videos

Required: `video.mp4`, `poster.png`

Use: autoplay, muted, loop, playsinline, `loading=lazy`.

Do not load all videos simultaneously.

---

# Site map (target)

Home  
About  
Results  
Gallery  
Tutorial  
Code  
Data  
Paper

---

# Final checklist

1. Is every scientific sentence traceable to manuscript/SI?
2. Does the website preserve the original scientific argument?
3. Is every visual supported by existing evidence?
4. Does every interaction represent existing data?
5. Is the style appropriate for a high-level scientific publication project page?
6. Does the section-to-source mapping table exist before implementation?
