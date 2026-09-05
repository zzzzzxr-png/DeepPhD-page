# Videos

Originals stay in scene folders and are excluded from Jekyll / git. Homepage uses `videos/demo/`.

Rebuild web clips:

```
python videos/make_web_videos.py
```

Downsample is top-left of each 2x2 tile (`scale=iw/2:ih/2:flags=neighbor`), not interpolation. HeLa: none. Zebrafish / Neutrophils: 2x. Spines: 4x. Mouse: 8x. CRF 16, first 10 s except full HeLa.
