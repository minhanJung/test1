"""
크롤러 모듈 초기화
"""
import sys
from pathlib import Path

# 상위 디렉토리를 path에 추가 (모든 크롤러가 공통으로 사용)
current_dir = Path(__file__).parent
parent_dir = current_dir.parent
if str(parent_dir) not in sys.path:
    sys.path.insert(0, str(parent_dir))

from .zooseyo import crawl_zooseyo
from .yourpet import crawl_yourpet
from .meyoupet import crawl_meyoupet
from .meyoupet_gwangju import crawl_meyoupet_gwangju
from .petworldkorea import crawl_petworldkorea
from .petami import crawl_petami
from .adamspet import crawl_adamspet
from .petkas import crawl_petkas
from .petfree import crawl_petfree
from .dorothypet import crawl_dorothypet

__all__ = [
    "crawl_zooseyo",
    "crawl_yourpet",
    "crawl_meyoupet",
    "crawl_meyoupet_gwangju",
    "crawl_petworldkorea",
    "crawl_petami",
    "crawl_adamspet",
    "crawl_petkas",
    "crawl_petfree",
    "crawl_dorothypet",
]
