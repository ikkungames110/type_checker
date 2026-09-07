"""整合性を確認し、Cloudflare Pagesへ公開する静的ファイルをdistへ集める。"""

from pathlib import Path
import shutil

from check_integrity import main as check_integrity


ROOT = Path(__file__).resolve().parents[1]


def main():
    check_integrity()
    destination = ROOT / "dist"
    if destination.exists():
        shutil.rmtree(destination)
    destination.mkdir()
    shutil.copy2(ROOT / "index.html", destination / "index.html")
    for name in ("assets", "data", "docs"):
        shutil.copytree(
            ROOT / name,
            destination / name,
            ignore=shutil.ignore_patterns("*:Zone.Identifier", "__pycache__", "*.pyc"),
        )
    files = [path for path in destination.rglob("*") if path.is_file()]
    print(f"Pages公開用ファイル: {len(files)}件 → {destination}")


if __name__ == "__main__":
    main()
