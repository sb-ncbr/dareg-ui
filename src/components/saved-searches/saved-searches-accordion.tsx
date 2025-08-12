"use client";

import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bookmark,
  Search,
  Trash2,
  Edit,
  Calendar,
  Clock,
  ExternalLink,
  Loader2,
} from "lucide-react";
import {
  savedSearchesService,
  SavedSearch,
} from "@/services/saved-searches-service";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { SaveSearchDialog } from "./save-search-dialog";

export function SavedSearchesAccordion() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSearch, setEditingSearch] = useState<SavedSearch | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadSavedSearches();
  }, []);

  const loadSavedSearches = async () => {
    try {
      setIsLoading(true);
      const searches = await savedSearchesService.getSavedSearches();
      setSavedSearches(searches);
    } catch (error) {
      console.error("Error loading saved searches:", error);
      toast.error("Failed to load saved searches.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (search: SavedSearch) => {
    if (!confirm(`Are you sure you want to delete "${search.name}"?`)) {
      return;
    }

    try {
      await savedSearchesService.deleteSavedSearch(search.id);
      await loadSavedSearches(); // Reload the list

      toast.success("Your saved search has been deleted.");

      // Refresh sidebar searches
      if ((window as any).refreshSidebarSearches) {
        (window as any).refreshSidebarSearches();
      }
    } catch (error) {
      console.error("Error deleting search:", error);
      toast.error("Failed to delete the search.");
    }
  };

  const handleRunSearch = (search: SavedSearch) => {
    try {
      // Navigate to the saved search URL
      router.push(search.url);
    } catch (error) {
      console.error("Error running saved search:", error);
      toast.error("Failed to run the saved search.");
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (savedSearches.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <Bookmark className="h-12 w-12 mx-auto mb-2 text-gray-300" />
        <p className="text-sm">No saved searches yet</p>
        <p className="text-xs text-gray-400 mt-1">
          Save searches to access them quickly
        </p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {savedSearches.map((search) => (
        <AccordionItem key={search.id} value={search.id}>
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-2 text-left">
              <Bookmark className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm truncate">{search.name}</p>
                {search.description && (
                  <p className="text-xs text-gray-500 truncate">
                    {search.description}
                  </p>
                )}
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent className="px-4 pb-4">
            <Card className="border-0 shadow-none bg-gray-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Search Details
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Search Summary */}
                <div className="space-y-2">
                  {search.filters.tokens.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">
                        Filters:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {search.filters.tokens.map((token, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {token.field} {token.operator} {token.displayValue}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {search.filters.freeText && (
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">
                        Free Text:
                      </p>
                      <Badge variant="outline" className="text-xs">
                        "{search.filters.freeText}"
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="space-y-1 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>Created: {formatDate(search.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>Updated: {formatDate(search.updatedAt)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => handleRunSearch(search)}
                    className="flex-1"
                  >
                    <Search className="h-3 w-3 mr-1" />
                    Run Search
                  </Button>

                  <SaveSearchDialog
                    tokens={search.filters.tokens}
                    freeTextQuery={search.filters.freeText || ""}
                    queryBody={search.filters.queryBody}
                    currentUrl={search.url}
                    trigger={
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                    }
                  />

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(search)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
