"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookmarkPlus, Loader2 } from "lucide-react";
import {
  savedSearchesService,
  SavedSearch,
} from "@/services/saved-searches-service";
import { toast } from "react-toastify";

interface SaveSearchDialogProps {
  tokens: any[];
  freeTextQuery: string;
  queryBody: any;
  currentUrl: string;
  trigger?: React.ReactNode;
}

export function SaveSearchDialog({
  tokens,
  freeTextQuery,
  queryBody,
  currentUrl,
  trigger,
}: SaveSearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [existingSearch, setExistingSearch] = useState<SavedSearch | null>(
    null
  );

  // Check if this search is already saved when dialog opens
  useEffect(() => {
    if (open) {
      checkIfSearchExists();
    }
  }, [open, tokens, freeTextQuery]);

  const checkIfSearchExists = async () => {
    try {
      const existing = await savedSearchesService.isSearchSaved({
        tokens,
        freeText: freeTextQuery,
        queryBody,
      });
      setExistingSearch(existing);

      if (existing) {
        setName(existing.name);
        setDescription(existing.description || "");
      } else {
        // Generate a default name based on the search
        const defaultName = generateDefaultName();
        setName(defaultName);
        setDescription("");
      }
    } catch (error) {
      console.error("Error checking if search exists:", error);
    }
  };

  const generateDefaultName = (): string => {
    if (freeTextQuery) {
      return `Search: "${freeTextQuery}"`;
    }

    if (tokens.length > 0) {
      const tokenDescriptions = tokens.map(
        (token) => `${token.field} ${token.operator} ${token.displayValue}`
      );
      return `Filters: ${tokenDescriptions.join(", ")}`;
    }

    return "New Search";
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast("Name required", {
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (existingSearch) {
        // Update existing search
        await savedSearchesService.updateSavedSearch(existingSearch.id, {
          name: name.trim(),
          description: description.trim() || undefined,
        });

        toast("Search updated", {
          type: "success",
        });
      } else {
        // Create new search
        await savedSearchesService.createSavedSearch({
          name: name.trim(),
          description: description.trim() || undefined,
          url: currentUrl,
          filters: {
            tokens,
            freeText: freeTextQuery,
            queryBody,
          },
        });

        toast("Search saved", {
          type: "success",
        });
      }

      // Refresh sidebar searches
      if ((window as any).refreshSidebarSearches) {
        (window as any).refreshSidebarSearches();
      }

      setOpen(false);
    } catch (error) {
      console.error("Error saving search:", error);
      toast("Failed to save your search. Please try again.", {
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!existingSearch) return;

    setIsLoading(true);
    try {
      await savedSearchesService.deleteSavedSearch(existingSearch.id);

      toast("Your saved search has been deleted.", {
        type: "success",
      });

      // Refresh sidebar searches
      if ((window as any).refreshSidebarSearches) {
        (window as any).refreshSidebarSearches();
      }

      setOpen(false);
    } catch (error) {
      console.error("Error deleting search:", error);
      toast("Failed to delete your search. Please try again.", {
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <BookmarkPlus className="h-4 w-4 mr-2" />
            Save Search
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {existingSearch ? "Update Saved Search" : "Save Search"}
          </DialogTitle>
          <DialogDescription>
            {existingSearch
              ? "Update the name and description for your saved search."
              : "Save this search with a name and description for future use."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Enter search name"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Optional description"
              rows={3}
            />
          </div>

          {existingSearch && (
            <div className="text-sm text-gray-500">
              <p>Created: {existingSearch.createdAt.toLocaleDateString()}</p>
              <p>
                Last updated: {existingSearch.updatedAt.toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            {existingSearch && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Delete"
                )}
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : existingSearch ? (
                "Update"
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
