"""整合性を確認し、Cloudflare Pagesへ公開する静的ファイルをdistへ集める。"""

from pathlib import Path
import shutil

from check_integrity import main as check_integrity
from build_share_pages import build_share_pages
from build_app_pages import build_app_pages


ROOT = Path(__file__).resolve().parents[1]


def main():
    check_integrity()
    destination = ROOT / "dist"
    if destination.exists():
        shutil.rmtree(destination)
    destination.mkdir()
    build_app_pages(destination)
    shutil.copy2(ROOT / "_redirects", destination / "_redirects")
    shutil.copy2(ROOT / "robots.txt", destination / "robots.txt")
    shutil.copy2(ROOT / "404.html", destination / "404.html")
    for name in ("assets", "data", "docs", "js"):
        shutil.copytree(
            ROOT / name,
            destination / name,
            ignore=shutil.ignore_patterns("*:Zone.Identifier", "__pycache__", "*.pyc"),
        )
    build_share_pages(destination)
    files = [path for path in destination.rglob("*") if path.is_file()]
    print(f"Pages公開用ファイル: {len(files)}件 → {destination}")


if __name__ == "__main__":
    main()
