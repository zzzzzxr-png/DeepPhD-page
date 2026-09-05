---
layout: page
title: Results
---

## Physical model validation

Does DeepPhD learn the correct noise physics?

<p>
We illustrated the physical consistency of the proposed framework in a proof-of-concept experiment by visualizing the noise components learned by DeepPhD. Consistent with theoretical expectations, FPN and RN can be accurately estimated at the pixel level (Fig. 1d).
</p>

<img src="../images/deepphd_physical_consistency.png"
     class="section-figure"
     alt="Physical consistency of DeepPhD">

<p>
Extensive numerical experiments show that the system gain (α) and the Gaussian variance (β) can be accurately estimated over a wide range of values. Across a wide range of noise intensities, DeepPhD can learn the exact patterns of FPN and RN, thereby removing these two noise components with small residuals.
</p>

<img src="../images/deepphd_fpn_validation.png"
     class="section-figure"
     alt="Verifying the FPN pattern learned by DeepPhD">

<details class="caption-more">
<summary>More information</summary>
<p>
The multi-frame average projection of the raw image stack is compared with the FPN pattern estimated by DeepPhD, alongside a representative raw frame and the corresponding denoised frame (Supplementary Fig. 8).
</p>
</details>

## Denoising performance

Does physical modeling improve restoration?

<p>
Among these methods, DeepPhD achieves the most accurate restoration without smoothing structures or leaving residual noise. In contrast, DeepPhD achieves the highest and most stable output SNR across all noise configurations.
</p>

<img src="../images/deepphd_evaluation.png"
     class="section-figure"
     alt="Comprehensive evaluation of DeepPhD">

<img src="../images/gallery_supp_fig4_hela_comparison.png"
     class="section-figure"
     alt="Comparing different denoising methods on synthetic volumetric imaging data of HeLa cells">

<img src="../images/deepphd_pmt_validation.png"
     class="section-figure"
     alt="Denoising performance on data that only contain MPGN">

<details class="caption-more">
<summary>More information</summary>
<p>
Two-photon calcium imaging data simulated with NAOMi were degraded with MPGN only, with FPN and RN excluded to match the reduced noise composition of multiphoton microscopy (Supplementary Fig. 10).
</p>
</details>

## Biological validation
{: #biological-validation}

Does improved restoration enable downstream analysis?

### DeepPhD enhanced light-sheet microscope reveals GABAergic neuronal population in larval zebrafish

<img src="../images/gallery_fig3_lightsheet.png"
     class="section-figure"
     alt="DeepPhD enhanced light-sheet microscope reveals GABAergic neuronal population in larval zebrafish">

<p>
Although the raw images are heavily contaminated by both random and structured noise, DeepPhD can still eliminate all noise components and restore underlying fluorescence signals. GABAergic neurons in the brain and spinal cord can be clearly reconstructed in 3D after denoising.
</p>

### DeepPhD facilitates high-sensitivity neural imaging of freely behaving mice with a head-mounted miniaturized microscope

<img src="../images/gallery_fig4_freely_behaving_mice.png"
     class="section-figure"
     alt="DeepPhD facilitates high-sensitivity neural imaging of freely behaving mice with a head-mounted miniaturized microscope">

<p>
Although only a limited number of neurons are visible in the raw data due to severe noise, calcium transients from many neurons reemerge after denoising. The results show that DeepPhD facilitates more accurate neuron extraction and substantially reduces false-positive pixels in the segmentation mask.
</p>

### DeepPhD enables high-sensitivity two-photon imaging of cellular dynamics in vivo

<img src="../images/gallery_fig5_twophoton.png"
     class="section-figure"
     alt="DeepPhD enables high-sensitivity two-photon imaging of cellular dynamics in vivo">

<p>
After denoising, DeepPhD restores dendritic continuity and enables reliable identification of individual postsynaptic spines. Trained solely on the low-SNR raw data, DeepPhD can learn to restore the exact morphological structures and migration dynamics of all neutrophils in the FOV. DeepPhD further enhances neutrophil tracking to obtain more continuous migration trajectories.
</p>

More demo images and videos are demonstrated in [Gallery]({{ site.baseurl }}/Gallery/).
