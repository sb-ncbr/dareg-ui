import { RecentlyViewedItem } from "@/types/recently-viewed/recently-viewed-item";
import Cookies from "js-cookie";

const COOKIE_KEY = "recent_pages";
const MAX_ITEMS = 5;

export const recentPagesService = {
  getRecentPages(): RecentlyViewedItem[] {
    try {
      const cookie = Cookies.get(COOKIE_KEY);
      return cookie ? JSON.parse(cookie) : [];
    } catch (e) {
      console.error("Failed to parse recent pages cookie:", e);
      return [];
    }
  },

  savePage(page: RecentlyViewedItem) {
    const current = recentPagesService.getRecentPages();

    const filtered = current.filter((item) => item.url !== page.url);

    const updated = [page, ...filtered].slice(0, MAX_ITEMS);

    Cookies.set(COOKIE_KEY, JSON.stringify(updated), { expires: 7 }); // 7 days
  },
};
