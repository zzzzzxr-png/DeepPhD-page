# DeepPhD asset map

执行表。只处理已有 figure / SI video，不发明新实验或假 demo。

配对 slider 规则：同一 scene 的 Raw / DeepPhD /（如有）GT 或 Reference 必须同分辨率、同裁剪、同帧率、同时长。输出 HTML5：`autoplay` `muted` `loop` `playsinline`，首页视频同步。网页版过大时用田字格取左上角像素下采样（ffmpeg `scale=iw/2:ih/2:flags=neighbor`），不做插值。HeLa 不下采样；Zebrafish / Neutrophils 1 次（2×）；Spines 2 次（4×）；Mouse 3 次（8×，3800×3600）。

有 GT / Reference 的 scene 使用两条拖动条：`Raw | DeepPhD | GT/Reference`。Mouse 没有配对参考，只保留 `Raw | DeepPhD`。

命名：

```
输入  videos/original/{scene}_raw_original.mp4
      videos/original/{scene}_deepphd_original.mp4
      videos/original/{scene}_ref_original.mp4   # 仅 HeLa / Zebrafish / Spines / Neutrophils

输出  videos/demo/{scene}/raw_web.mp4
      videos/demo/{scene}/deepphd_web.mp4
      videos/demo/{scene}/ref_web.mp4           # 有则启用第三条分割线
      videos/demo/{scene}/poster.png

Gallery 单视频（可选）
      videos/gallery/{scene}_web.mp4
```

`{scene}` = `hela` | `zebrafish` | `mouse` | `spines` | `neutrophils`

未到齐前：Home Demo 与 Gallery 使用已有 YouTube SI Video，不假装 Raw | DeepPhD slider。

| 位置 | 标题 | 来源 figure / video | 需要处理 | 目标文件 | 状态 |
| --- | --- | --- | --- | --- | --- |
| Home Hero Demo · HeLa | Synthetic volumetric imaging data | `videos/Hela/*_ds8.mp4`（Fig. 2 GT） | 原分辨率 CRF16 网页版；三条竖条 Raw / DeepPhD / **GT** | `videos/demo/hela/` | 原片已到；网页版生成中 |
| Home Hero Demo · Zebrafish | Larval zebrafish light-sheet imaging | `videos/Zebrafish/Raw_MC-RGB.mp4` + `Denoised_MC-RGB.mp4` | 前 10 s；仅 Raw / DeepPhD（文件夹无 reference） | `videos/demo/zebrafish/` | 原片已到；无 High-SNR |
| Home Hero Demo · Mouse | Freely behaving mouse neural imaging | `videos/Mouse/fig4-*-crop-RGB.mp4` | 前 10 s；仅 Raw / DeepPhD | `videos/demo/mouse/` | 原片已到 |
| Home Hero Demo · Spines | Dendritic spine calcium imaging | `videos/Dendritic spines/*` + HighSNR | 前 10 s；Raw / DeepPhD / **Reference** | `videos/demo/spines/` | 原片已到 |
| Home Hero Demo · Neutrophils | Neutrophil migration imaging | `videos/Neutrophils/*` + High_SNR | 前 10 s；Raw / DeepPhD / **Reference** | `videos/demo/neutrophils/` | 原片已到 |
| Home Physics principle | Physics-informed principle of DeepPhD | Fig. 1a | 从 Fig. 1 裁出 physical process（不要 pipeline） | `images/deepphd_fig1a.png` | **待裁剪**；暂用 `deepphd_principle.png`（Fig. 1a–c） |
| About Pipeline | Detailed workflow | Supplementary Fig. 1 | 导出完整 SI Fig. 1 | `images/deepphd_detailed_workflow.png` | **缺失** |
| Home Synthetic denoising | Synthetic volumetric imaging data | Fig. 2 | 网页版 / 可选 selected panel | `images/deepphd_evaluation.png` | **已就位**（整图）；selected panel 可选 |
| Home Experimental · Zebrafish | Larval zebrafish light-sheet imaging | Fig. 3 | 网页版 figure；可选 representative panel | `images/gallery_fig3_lightsheet.png` | **已就位**（整图） |
| Home Experimental · Mouse | Freely behaving mouse neural imaging | Fig. 4 | 同上 | `images/gallery_fig4_freely_behaving_mice.png` | **已就位**（整图） |
| Home Experimental · Two-photon | Two-photon imaging of cellular dynamics in vivo | Fig. 5 | 同上；Spines / Neutrophils 目前共用整图 | `images/gallery_fig5_twophoton.png` | **已就位**（整图） |
| Home Applications · Zebrafish | Larval zebrafish light-sheet imaging | Fig. 3 + SI Video 2 | thumbnail（可从 Fig. 3 代表面板裁） | `images/gallery_fig3_lightsheet.png` | 暂用整图 cover |
| Home Applications · Mouse | Freely behaving mouse neural imaging | Fig. 4 + SI Video 3 | thumbnail | `images/gallery_fig4_freely_behaving_mice.png` | 暂用整图 cover |
| Home Applications · Spines | Dendritic spine calcium imaging | Fig. 5a–c + SI Video 4 | 从 Fig. 5 裁 spines thumbnail | `images/thumb_spines.png` | **待裁剪**；暂用 Fig. 5 整图 |
| Home Applications · Neutrophils | Neutrophil migration imaging | Fig. 5d–i + SI Video 5 | 从 Fig. 5 裁 neutrophil thumbnail | `images/thumb_neutrophils.png` | **待裁剪**；暂用 Fig. 5 整图 |
| Gallery Zebrafish | Larval zebrafish light-sheet imaging | SI Video 2 | 单视频 web mp4（可选） | `videos/gallery/zebrafish_web.mp4` | YouTube 已就位 |
| Gallery Mouse | Freely behaving mouse neural imaging | SI Video 3 | 同上 | `videos/gallery/mouse_web.mp4` | YouTube 已就位 |
| Gallery Spines | Dendritic spine calcium imaging | SI Video 4 | 同上 | `videos/gallery/spines_web.mp4` | YouTube 已就位 |
| Gallery Neutrophils | Neutrophil migration imaging | SI Video 5 | 同上 | `videos/gallery/neutrophils_web.mp4` | YouTube 已就位 |
| Gallery HeLa | Synthetic volumetric imaging data | SI Video 1 | 同上 | `videos/gallery/hela_web.mp4` | YouTube 已就位 |

## 页面跳转（已接到站点）

| 控件 | 目标 |
| --- | --- |
| Read the paper | `PAPER_URL_PLACEHOLDER` |
| Try it on your data | `/Tutorial/` |
| Demo HeLa → View detailed denoising results | `/Gallery/#hela` |
| Demo Zebrafish / Mouse / Spines / Neutrophils → View downstream analysis | `/#app-zebrafish` `/#app-mouse` `/#app-spines` `/#app-neutrophils` |
| Detailed pipeline | `/About/#pipeline` |
| Applications → View video | `/Gallery/#zebrafish` 等 |
| Gallery biological → Back to applications | `/#app-*` |
| Gallery HeLa → Back to demo | `/#demo` |

## 不做

- 不把整页 figure 放回 Gallery。
- 不把 Demo 的 biological scene 跳到 Gallery；HeLa 除外。
- 不把 “Try it on your data” 指到 Code。
- 没有配对 mp4 时不显示 Raw \| DeepPhD slider。
- 没有 `ref_web.mp4` 时不显示第三条 GT/Reference 分割线；不把 Mouse 标成有 GT。
