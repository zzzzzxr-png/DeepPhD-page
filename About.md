---
layout: page
title: About
---

<nav class="section-nav" data-section-nav aria-label="Page sections">
  <a href="#framework-overview">Framework overview</a>
  <a href="#pipeline">Detailed workflow</a>
  <a href="#physical-noise-model">Physical noise model</a>
  <a href="#optimization">Optimization</a>
  <a href="#citation">Citation</a>
</nav>

<p class="page-toplinks"><a href="https://github.com/cabooster/DeepPhD">Code</a> | <a href="PAPER_URL_PLACEHOLDER">Paper</a></p>
<!-- PAPER_URL_PLACEHOLDER: replace with the final paper URL after publication. -->

## Framework overview

<!-- SOURCE: v13 Results, Fig. 1c. Method, not Home principle. -->
DeepPhD comprises two trainable modules for physical modeling and image restoration (Fig. 1c and Supplementary Fig. 1).

<img src="../images/deepphd_fig1_c.png"
     class="section-figure"
     alt="DeepPhD pipeline: image restoration and physical modeling">

<details class="caption-more">
<summary>More information</summary>
<p>
The physical modeling module learns to estimate noise parameters, including the system gain α, the Gaussian noise variance β, and the FPN pattern. For image restoration, we designed a two-stage scheme composed of noise decoupling and signal estimation.
</p>
</details>

## Detailed workflow
{: #pipeline}

<!-- SOURCE: v13 Methods, Physical modeling module. SI Supplementary Figure 1 title. -->
DeepPhD consists of a physical modeling module and an image restoration module (Supplementary Fig. 1).

<img src="../images/deepphd_detailed_workflow.png"
     class="section-figure"
     alt="Detailed workflow of DeepPhD">

### Joint optimization of image restoration and physical modeling

The raw image stack is partitioned into two interleaved sub-stacks for mutual supervision. In image restoration, noise decoupling and signal estimation are performed on the paired sub-stacks, and the resulting residuals are used for physical modeling. The reconstruction network is updated during image restoration, whereas the FPN map and MPGN parameters α and β are updated during physical modeling; all are otherwise held fixed. RN has no trainable parameters and is recalculated at each forward pass.

### Image restoration procedure

After FPN removal, the reconstruction network produces a pseudo-clean reference. Together with α and β, the pseudo-clean reference determines the MPGN scale used for RN estimation. After RN removal, the reconstruction network is reapplied to produce the final denoised images.

### Physical modeling of residuals

RN correction is first performed, after which the residuals are processed by a normalizing flow through FPN translation and MPGN normalization, progressively transforming the latent distribution into a standard Gaussian distribution. MPGN parameters α and β denote the system gain and Gaussian variance, respectively.

## Physical noise model

<div class="home-split">
<div>
<p>
From biological specimens to digital images, fluorescence photons undergo multiple stages of photoelectric conversion, amplification, readout, and digitization, during which distinct noise sources are accumulated. Since noise from different sources has different physical properties and statistical models, noise components in fluorescence imaging exhibit pronounced heterogeneity.
</p>
<p>
Specifically, the quantum stochasticity of light gives rise to shot noise, imposing intrinsic Poissonian randomness on photon counting. Thermally induced charge carriers and random fluctuations in the peripheral circuitry lead to Gaussian-distributed dark noise and readout noise. Moreover, pixel-wise and row-wise nonuniformities in sensor gain and offset produce fixed-pattern noise (FPN) and row noise (RN) with spatiotemporal correlations.
</p>
</div>
<div>
<p>
The overall noise model for fluorescence imaging can be formulated as an additive combination of mixed Poisson-Gaussian noise (MPGN), FPN, and RN. MPGN describes stochastic photon and electronic fluctuations. FPN and RN represent structured offsets caused by sensor nonuniformity with spatial and temporal correlations. For PMT-based detection, FPN and RN are constrained to zero, reducing the noise model to MPGN.
</p>
</div>
</div>

## Optimization

<!-- SOURCE: v13 Results and SI Fig. 1 caption. Labels only. -->
<ol class="opt-pipe">
  <li>Input</li>
  <li class="arrow">↓</li>
  <li>Noise modeling</li>
  <li class="arrow">↓</li>
  <li>Noise decoupling</li>
  <li class="arrow">↓</li>
  <li>Restoration</li>
  <li class="arrow">↓</li>
  <li>Output</li>
</ol>

<p>
We found that by sharing parameters within a joint optimization framework, using adjacent frames as supervision can also enable unbiased training of the two modules. Noise parameters estimated by the physical modeling module are passed to the image restoration module in real time to guide noise decoupling and signal estimation.
</p>

## Citation

PAPER_CITATION_PLACEHOLDER
