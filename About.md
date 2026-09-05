---
layout: page
title: About DeepPhD
---

<nav class="section-nav" data-section-nav aria-label="Page sections">
  <a href="#physical-origins">Physical origins of noise</a>
  <a href="#principle">Physics-informed denoising</a>
  <a href="{{ site.baseurl }}/#results">Results</a>
</nav>

<p class="page-toplinks"><a href="https://github.com/cabooster/DeepPhD">Code</a> | <a href="PAPER_URL_PLACEHOLDER">Paper</a></p>
<!-- PAPER_URL_PLACEHOLDER: replace with the final paper URL after publication. -->

## Physical origins of fluorescence imaging noise
{: #physical-origins}

<!-- WEB HEADING: not a manuscript subheading; frames Fig.1a/b (photoelectric conversion → heterogeneous noise). -->
<!-- SOURCE: manuscript Introduction. -->
Despite technical diversity, all imaging modalities are fundamentally limited by noise, which is an unavoidable challenge in photon-limited observation.

From biological specimens to digital images, fluorescence photons undergo multiple stages of photoelectric conversion, amplification, readout, and digitization, during which distinct noise sources are accumulated.

Since noise from different sources has different physical properties and statistical models, noise components in fluorescence imaging exhibit pronounced heterogeneity.

<img src="../images/DeepPhD_figs_v4-page-about.png"
     class="section-figure"
     alt="Physical imaging process and heterogeneous noise components in fluorescence microscopy">

However, these data-driven methods do not incorporate explicit noise modeling, which leads to two intrinsic deficiencies.

First, they can only handle noise components that conform to the conservative assumptions of zero mean and pixel independence.

More importantly, they are suspected of producing artifacts that compromise the scientific veracity of the results.

Thus, embedding physical mechanisms into deep neural networks to enable explicit modeling of complex noise components is expected to address these deficiencies and drive substantial advances in the performance, reliability, and generalizability of fluorescence image denoising.

## Physics-informed self-supervised denoising
{: #principle}

<!-- WEB HEADING: from Abstract core phrasing (physics-informed self-supervised denoising), not a manuscript subheading. -->
<!-- SOURCE: manuscript Introduction. Innovation bullets are verbatim contribution sentences. -->
Here we present DeepPhD, a self-supervised framework that incorporates explicit physical modeling for high-performance, interpretable fluorescence image denoising.

- DeepPhD is grounded in a comprehensive physical dissection of image degradation, directly linking noise-formation mechanisms to computational noise removal.
- We designed a normalizing flow backbone that learns two reciprocal transformations to implement explicit noise modeling and parameter estimation.
- By combining the flow-based noise model with a denoising network, DeepPhD can accurately decompose and remove complex noise components.

<img src="../images/deepphd_detailed_workflow.png"
     class="section-figure"
     alt="DeepPhD framework: physics-informed image restoration and physical modeling">

The entire framework is trained in a self-supervised manner through parameter sharing and joint optimization.

<div class="about-cta">
{% include arrow-link.html href="/#results" text="View Results" %}
</div>
