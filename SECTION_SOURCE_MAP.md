# Webpage section → manuscript / SI map

Sources: `1-DeepPhD_Article_v13.docx`, `2-Supplementary Information_v14.docx`.
Scientific sentences on the site must stay inside these cells. Layout may change; claims may not.

Frozen Home / Gallery (2026-09-05).

| Page | Webpage section | Scientific wording | Main figure | SI figure | Video | Existing file | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Home | Hero title | SI / manuscript title: Physics-informed self-supervised denoising for fluorescence imaging | — | — | — | — | in manuscript |
| Home | Hero sentence | Abstract: Here we present DeepPhD… | — | — | — | — | in manuscript |
| Home | Demo HeLa | SI Video 1 title / Fig. 2 experiment | Fig. 2 | — | SI Video 1 | `videos/demo/hela/*` | **mp4 missing**; YouTube `yNKy02yx4HU` |
| Home | Demo Zebrafish | SI Video 2 / Fig. 3 | Fig. 3 | — | SI Video 2 | `videos/demo/zebrafish/*` | **mp4 missing**; YouTube `9wG65MiFMAs` |
| Home | Demo Mouse | SI Video 3 / Fig. 4 | Fig. 4 | — | SI Video 3 | `videos/demo/mouse/*` | **mp4 missing**; YouTube `Yn_954OcvZI` |
| Home | Demo Spines | SI Video 4 / Fig. 5a | Fig. 5a | — | SI Video 4 | `videos/demo/spines/*` | **mp4 missing**; YouTube `1bM43gqU6ik` |
| Home | Demo Neutrophils | SI Video 5 / Fig. 5d | Fig. 5d | — | SI Video 5 | `videos/demo/neutrophils/*` | **mp4 missing**; YouTube `Sqv64TThzUo` |
| Home | Physics-informed principle | Fig. 1 physical process only; no pipeline text | Fig. 1a | — | — | `deepphd_principle.png` | Fig. 1a crop pending |
| Home | Synthetic volumetric imaging data | Fig. 2 caption panel a | Fig. 2 | Supp. Fig. 4 | SI Video 1 | `deepphd_evaluation.png` | files present |
| Home | Experimental fluorescence imaging | Results sentences for Fig. 3–5 | Fig. 3; Fig. 4; Fig. 5 | — | — | gallery Fig. 3–5 | files present |
| Home | Biological applications cards | Figure / video experiment titles only | Fig. 3–5 | — | SI Video 2–5 | gallery Fig. 3–5 | files present |
| About | Framework overview | Results: two trainable modules (Fig. 1c) | Fig. 1c | Supp. Fig. 1 | — | `deepphd_principle.png` (a–c) | Fig. 1c not cropped |
| About | Detailed workflow `#pipeline` | Methods + SI Fig. 1 caption a–c | — | Supp. Fig. 1 | — | `deepphd_detailed_workflow.png` | **missing** |
| About | Physical noise model | Introduction paragraph 2; Methods noise formulation | Fig. 1b | — | — | — | in manuscript |
| About | Optimization | Methods / SI Fig. 1a | — | Supp. Fig. 1a | — | — | in manuscript |
| Results | Physical model validation / Denoising / Biological validation | Results Fig. 1d–f; Fig. 2–5 | Fig. 1–5 | Supp. Fig. 8; 4; 10 | SI Video 1–5 | existing PNGs | files present |
| Gallery | Zebrafish / Mouse / Spines / Neutrophils / HeLa | SI Video titles; downstream labels from Results / Methods | — | — | SI Video 1–5 | YouTube embeds | no page-level figures |
| Tutorial | Installation / Training / Inference | Repository README; Methods Software | — | — | — | — | operational |
| Datasets | Data / Code availability | Manuscript Data / Code availability | — | — | — | Zenodo 14580256; 14586426 | in manuscript |

## Mapping rules

- Home Demo biological scenes jump to Home Applications, not Gallery. HeLa jumps to Gallery.
- Gallery is video + downstream only. No full-page figures.
- Hover / UI labels use manuscript terms only.
- Raw \| DeepPhD slider is shown only after paired `raw_web.mp4` / `deepphd_web.mp4` exist.
