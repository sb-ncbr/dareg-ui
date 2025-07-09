import { Token } from "@/types/search/search-models";
import Cookies from "js-cookie";

const HISTORY_KEY = "search_history";
const HISTORY_LIMIT = 10;

export type SearchHistoryEntry = Token[];

export class SearchHistoryService {
  static getHistory(): SearchHistoryEntry[] {
    const raw = Cookies.get(HISTORY_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static addSearch(entry: SearchHistoryEntry) {
    if (!entry || entry.length === 0) return;
    let history = this.getHistory();
    // Remove duplicates (by JSON string)
    history = history.filter(
      (h) => JSON.stringify(h) !== JSON.stringify(entry)
    );
    history.unshift(entry);
    if (history.length > HISTORY_LIMIT)
      history = history.slice(0, HISTORY_LIMIT);
    Cookies.set(HISTORY_KEY, JSON.stringify(history), { expires: 365 });
  }

  static clearHistory() {
    Cookies.remove(HISTORY_KEY);
  }
}
