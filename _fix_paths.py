from pathlib import Path

root = Path(r"E:\DeepPhD\DeepPhD_page\DeepPhD-page")
index = root / "index.html"
text = index.read_text(encoding="utf-8")
old = 'src="images/'
new = 'src="{{ site.baseurl }}/images/'
count = text.count(old)
index.write_text(text.replace(old, new), encoding="utf-8")
print("image path fixes:", count)

gitignore = root / ".gitignore"
gi = gitignore.read_text(encoding="utf-8")
gi = gi.replace("videos/demo/spines/stack_web.mp4\n", "")
gi = gi.replace("videos/demo/spines/stack_web.mp4\r\n", "")
extra = """
# Demo player uses stack_web only
videos/demo/**/raw_web.mp4
videos/demo/**/deepphd_web.mp4
videos/demo/**/ref_web.mp4
"""
if "raw_web.mp4" not in gi:
    gi = gi.rstrip() + "\n" + extra
gitignore.write_text(gi, encoding="utf-8")
print("gitignore updated")
