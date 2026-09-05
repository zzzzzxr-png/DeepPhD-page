# Text provenance and edits

Frozen homepage and subpages against **v13 article** (`1-DeepPhD_Article_v13.docx`) and **v13 SI** (`2-Supplementary Information_v13.docx`). Each block uses wording from that section's own position. AI-invented narrative sentences are not added.

## Global rule

- **VERBATIM WORDING** means the scientific wording is copied from v13 or v13 SI. Manuscript reference-number callouts may be omitted; every larger deletion is listed below.
- **EDITED by deletion only** means intermediate sentences were dropped without rewriting or reordering.
- **NEW** / **[网页结构新增]** means structural/navigation copy written for the webpage.

## `index.html`

Home = overview. About = explanation. No shared static figures.

Heading levels: the page title is `h1`. Numbered sections 1–3 are `h2`. Results internals are `h3`. Video 4 / 5 titles are `h4`.

### 1. Background

**[网页结构新增]** heading. Body is v13 Abstract, problem sentences only.

### 2. Physics-informed principle of DeepPhD

v13 Results heading. Same Results subsection only.

- Opening two paragraphs: Fig. 1a sentence + Fig. 1b / reduced-compositions sentence; **EDITED by deletion only**: intermediate detector-physics sentences omitted.
- Complete Main Fig. 1a–f — `images/deepphd_fig1.png`
- Three paragraphs after the figure: two-module + α/β/FPN; image restoration (noise decoupling + signal estimation); *Together, these designs...* + physical-consistency opening. No extra `h3` headings.

### 3. Application and Results

v13 Results. Subheads are the remaining Results headings.

- `Comprehensive evaluation of DeepPhD` — opening (Microsim / Supplementary Fig. 3 sentences omitted) + complete Fig. 2 + two later-subsection summaries (intermediate sentences omitted). No Video 1.
- `Ultrasensitive light-sheet imaging of GABAergic neurons in larval zebrafish` — two Results sentences + Supplementary Video 2.
- `High-fidelity neural recording of freely behaving mice with head-mounted miniaturized microscopy` — two Results sentences + Supplementary Video 3.
- `Enhancing photon-limited multiphoton imaging with DeepPhD` — PMT distinction sentences + Supplementary Video 4 / 5 titles (SI).

Footer sub-page sentence — webpage navigation.

## `About.md`

- Opening links — `Code | Paper`.
- Background — v13 Introduction, paragraph 1. No figure.
- Noise model — v13 Introduction, paragraph 2 only. No Methods formula summary. No Fig. 1.
- `Detailed workflow of DeepPhD` — SI Supplementary Figure 1 title. One Methods sentence (*DeepPhD consists of a physical modeling module...*). Figure: `images/deepphd_detailed_workflow.png`. Then the three SI caption panel headings and their panel text (panel a omits the red-arrow sentence).
- Results — Main Fig. 3 / 4 / 5 titles and figures (existing Gallery files). Body sentences from the matching Results subsections.
- Gallery sentence — webpage navigation.

## `Gallery.md`

Numbered entries. Titles are v13 SI / Supplementary Video original titles. Captions are collapsed behind `more information >>`. Captions keep experimental aim and core result; *P* values, statistical tests, `N=`, and detailed acquisition parameters are omitted.

1. Supplementary Video 1 title + video + Supplementary Fig. 4 + caption
2. Supplementary Video 2 title + video + Main Fig. 3 + Fig. 3 caption (**EDITED by deletion only**: panels c–d statistical sentences omitted)
3. Supplementary Fig. 7 title + figure + caption
4. Supplementary Fig. 8 title + figure + caption
5. Supplementary Fig. 9 title + figure + caption (**EDITED by deletion only**: 2990-frame acquisition sentence omitted)
6. Supplementary Video 3 title + video + Main Fig. 4 + Fig. 4 caption (**EDITED by deletion only**: panels g–h and `N=` on panel f omitted)
7. Supplementary Fig. 10 title + figure + caption (**EDITED by deletion only**: pixel-size / frame-rate / Supplementary Table 2 / `N=6000` omitted)
8. Supplementary Video 4 title + video
9. Supplementary Video 5 title + video + Main Fig. 5 + Fig. 5 caption (**EDITED by deletion only**: panels e, f, h statistical sentences omitted)
10. Supplementary Fig. 11 title + figure + caption

## `Tutorial.md`

Follows the public repository [cabooster/DeepPhD](https://github.com/cabooster/DeepPhD) (`master`, commit dated 2026-09-02). Installation, data format, `--noise_model` table, training, and inference commands are from the repository README. Output folder names (`plots`, `FPN`, `RN`) are from `utils/inference_io.py`. Shell quoting of `'fpn|rn|mpgn'` is added so the `|` is not interpreted as a pipe.

- Software environment opening paragraph — v13 Methods, Software (unchanged).
- Remaining installation / CLI content — repository README and CLI parsers (`DeepPhD_train.py`, `DeepPhD_inference.py`, `utils/arg_parser.py`).
- GUI — manuscript Code availability mentions a GUI at this Tutorial URL; the currently released repository ships CLI entry points only. No invented GUI workflow.

## `Datasets.md`

- Data availability — v13 Data availability (microscopy recordings on Zenodo `14580256`; neuroethological source data on Zenodo `14586426`). UDMT *All behavioral recordings used in this study...* is not used.
- Code availability — v13 Code availability.
- Citation — `PAPER_CITATION_PLACEHOLDER`.
