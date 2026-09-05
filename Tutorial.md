---
layout: page
title: Tutorial
---

<nav class="section-nav" data-section-nav aria-label="Page sections">
  <a href="#software-environment">Software environment</a>
  <a href="#installation">Installation</a>
  <a href="#data-format">Data format</a>
  <a href="#noise-model">Noise model</a>
  <a href="#training">Training</a>
  <a href="#inference">Inference</a>
</nav>

<p class="page-toplinks"><a href="https://github.com/cabooster/DeepPhD">Code</a> | <a href="{{ site.baseurl }}/Datasets/">Datasets</a></p>

## Software environment

<!-- VERBATIM: v13 Methods, Software. -->
The results reported in this paper were obtained using DeepPhD (version 1.1.1). The software environment includes Python 3.10, PyTorch 2.8.0, and CUDA 12.9. A step-by-step tutorial is available at https://cabooster.github.io/DeepPhD/Tutorial/. All relevant pretrained models are listed on the tutorial page. The core dependencies include TorchVision (version 0.23.0), Torchaudio (version 2.8.0), NumPy (version 2.2.6), SciPy (version 1.15.3), scikit-image (version 0.25.2), OpenCV-Python (version 4.12.0.88), pandas (version 2.3.3), Matplotlib (version 3.10.7), ImageIO (version 2.37.0), Pillow (version 11.3.0), einops (version 0.8.1), timm (version 1.0.20), FrEIA (version 0.2), TensorBoard (version 2.20.0), MMEngine (version 0.10.7).

The public repository currently specifies:

- Linux (recommended)
- Python **3.10**
- NVIDIA GPU with CUDA **12.x**
- A recent **PyTorch** build compatible with your GPU (select the matching CUDA wheel on [pytorch.org](https://pytorch.org/get-started/locally/))

Pinned remaining packages are listed in [`requirements.txt`](https://github.com/cabooster/DeepPhD/blob/master/requirements.txt) (install PyTorch first): `numpy==1.26.4`, `scipy==1.11.4`, `scikit-image==0.22.0`, `tifffile==2024.8.30`, `imageio==2.34.2`, `pillow==10.4.0`, `tqdm==4.66.5`.

## Installation

```bash
git clone https://github.com/cabooster/DeepPhD.git
cd DeepPhD
conda create -n deepphd python=3.10 -y
conda activate deepphd
```

Install PyTorch first, matched to your CUDA version and GPU. Use the selector on [pytorch.org](https://pytorch.org/get-started/locally/) to choose a build compatible with your driver and hardware (newer GPUs such as the RTX 5090 require a recent build with the appropriate architecture support). Example for CUDA 12.8:

```bash
pip install torch==2.8.0 torchvision==0.23.0 torchaudio==2.8.0 \
    --index-url https://download.pytorch.org/whl/cu128
```

Install the remaining dependencies:

```bash
pip install -r requirements.txt
```

Source code: [https://github.com/cabooster/DeepPhD](https://github.com/cabooster/DeepPhD)

## Data format

Organize input volumes as multi-page **TIFF** stacks (`.tif`) in a single folder, for example:

```text
your_dataset/
  ├── stack_001.tif
  └── stack_002.tif
```

Each TIFF should have shape `T × H × W` (time or depth × height × width). Stacks with fewer than 400 frames are automatically extended to meet the minimum length required for training.

**All stacks in the same directory must come from the same imaging device (sensor),** so that shared physical noise parameters (e.g., the FPN pattern and MPGN gain/variance) stay consistent within a single training or inference run. Do not combine data from different cameras or microscopes in one folder.

## Noise model

Considering the dominant noise sources in fluorescence imaging, the overall noise model can be formulated as an additive combination of mixed Poisson–Gaussian noise (MPGN), fixed-pattern noise (FPN), and row noise (RN):

| Component | Origin |
|-----------|--------|
| **MPGN** | Poissonian photon counting, thermally generated dark current, and electronic readout. |
| **FPN** | Nonuniformities in the pixel circuitry. |
| **RN** | Nonuniformities in the row circuitry. |

Please choose an appropriate noise model that matches how your data were acquired. The table below lists common recommendations:

| Sensor | Typical modalities | Recommended `--noise_model` |
|------------------|--------------------|-----------------------------|
| Scanning detection (PMTs) | Two-photon microscopy, three-photon microscopy, *etc.* | <code>mpgn</code> |
| Parallel camera-array detection (EMCCD) | TIRF, singlemolecule localization microscopy (SMLM), *etc.* | <code>fpn&#124;mpgn</code> |
| Row-serial camera-array detection (CMOS) | Light-sheet microscopy, widefield microscopy, *etc.* | <code>fpn&#124;rn&#124;mpgn</code> |

Quote the `--noise_model` value in the shell (`'fpn|rn|mpgn'`), because `|` is a pipe operator.

## Training

```bash
python DeepPhD_train.py \
  --exp_dir demo_lightsheet_zebrafish \
  --datasets_path /path/to/your_dataset \
  --noise_model 'fpn|rn|mpgn' \
  --save_noise
```

For multiphoton / PMT data, use `--noise_model mpgn`. By default, training runs on GPUs 0 and 1. To use different devices, pass `--gpu` (e.g., `--gpu 0` or `--gpu 0,1,2`).

Key arguments:

| Argument | Description |
|----------|-------------|
| `--exp_dir` | Experiment name; logs and checkpoints are saved under `results/<exp_dir>/` |
| `--datasets_path` | Directory containing input `.tif` stacks |
| `--noise_model` | Noise model matching the acquisition, e.g. <code>fpn&#124;rn&#124;mpgn</code>, <code>fpn&#124;mpgn</code>, or <code>mpgn</code> (default: <code>fpn&#124;rn&#124;mpgn</code>) |
| `--gpu` | Comma-separated GPU IDs (default: `0,1`) |
| `--fresh_start` | Remove the existing experiment directory and restart training from scratch |
| `--save_noise` | During the final validation pass, save the learned FPN and estimated RN maps |
| `--seed` | Random seed (default: `0`) |

Checkpoints are saved to:

```text
results/<exp_dir>/saved_models/epoch_<N>.pth
```

## Inference

```bash
python DeepPhD_inference.py \
  --exp_dir demo_lightsheet_zebrafish \
  --datasets_path /path/to/your_dataset \
  --noise_model 'fpn|rn|mpgn' \
  --save_noise
```

| Argument | Description |
|----------|-------------|
| `--exp_dir` | Experiment name or absolute path to the training output directory |
| `--epoch` | Checkpoint epoch to load (default: latest) |
| `--noise_model` | Must match the noise model used during training |
| `--datasets_path` | Directory of TIFF stacks to denoise |
| `--gpu` | Comma-separated GPU IDs (default: `0,1`) |
| `--save_noise` | Export estimated RN and learned FPN maps |

Denoised outputs (and optional noise maps) are saved under `results/<exp_dir>/`:

```text
results/<exp_dir>/
  ├── saved_models/epoch_<N>.pth
  ├── plots/          # denoised TIFF stacks
  ├── FPN/            # learned FPN map, if --save_noise and the model includes FPN
  └── RN/             # estimated RN map, if --save_noise and the model includes RN
```
