import { Token } from "@/components/tokenized-search/types/search-models";
import Cookies from "js-cookie";

const HISTORY_KEY = "search_history";
const HISTORY_LIMIT = 10;

export interface SearchHistoryEntry {
  tokens: Token[];
  freeTextQuery?: string;
}

export class SearchHistoryService {
  static getHistory(): SearchHistoryEntry[] {
    const raw = Cookies.get(HISTORY_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (Array.isArray(parsed[0]) || (parsed[0] && !parsed[0].tokens)) {
          return parsed.map((entry: Token[] | any) => ({
            tokens: Array.isArray(entry) ? entry : [],
            freeTextQuery: undefined,
          }));
        }
      }
      return parsed;
    } catch {
      return [];
    }
  }

  static addSearch(tokens: Token[], freeTextQuery?: string) {
    if ((!tokens || tokens.length === 0) && !freeTextQuery) return;

    const entry: SearchHistoryEntry = {
      tokens: tokens || [],
      freeTextQuery,
    };

    let history = this.getHistory();
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
