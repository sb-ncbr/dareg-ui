import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EnhancedFilterDialog } from "../filters/enhanced-filter-dialog";

/**
 * Demo component showing how the EnhancedFilterDialog handles enum fields
 * This demonstrates the automatic dropdown creation for fields like "solvent"
 */
export function EnhancedFilterDemo() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [lastAppliedFilters, setLastAppliedFilters] = useState<any>(null);

  const handleFilterApply = (type: string, filters: any, schemaId?: string) => {
    console.log("Applied filters:", { type, filters, schemaId });
    setLastAppliedFilters({ type, filters, schemaId, timestamp: new Date() });
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Filter Dialog Demo</CardTitle>
          <CardDescription>
            This demo shows how the FormsWrapped component automatically handles
            enum fields like "solvent"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Key Features:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  ✓
                </Badge>
                Automatic enum detection and dropdown creation
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  ✓
                </Badge>
                Schema-driven form generation
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  ✓
                </Badge>
                Built-in validation
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  ✓
                </Badge>
                Toggle between enhanced and manual modes
              </li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Button onClick={() => setIsDialogOpen(true)} className="flex-1">
              Open Enhanced Filter Dialog
            </Button>
          </div>

          {lastAppliedFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Last Applied Filters:</h4>
              <div className="text-sm space-y-1">
                <p>
                  <strong>Type:</strong> {lastAppliedFilters.type}
                </p>
                <p>
                  <strong>Schema ID:</strong>{" "}
                  {lastAppliedFilters.schemaId || "None"}
                </p>
                <p>
                  <strong>Timestamp:</strong>{" "}
                  {lastAppliedFilters.timestamp.toLocaleString()}
                </p>
                <details className="mt-2">
                  <summary className="cursor-pointer font-medium">
                    Filter Details
                  </summary>
                  <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto">
                    {JSON.stringify(lastAppliedFilters.filters, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Example Schema with Solvent Enum</CardTitle>
          <CardDescription>
            This is how a schema would look to automatically create a solvent
            dropdown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">
            {`{
  "type": "object",
  "properties": {
    "metadata": {
      "type": "object",
      "properties": {
        "solvent": {
          "type": "string",
          "enum": ["water", "ethanol", "methanol", "acetone"],
          "title": "Solvent"
        },
        "concentration": {
          "type": "number",
          "minimum": 0,
          "maximum": 100,
          "title": "Concentration (%)"
        },
        "temperature": {
          "type": "number",
          "minimum": -273.15,
          "maximum": 1000,
          "title": "Temperature (°C)"
        }
      }
    }
  }
}`}
          </pre>
        </CardContent>
      </Card>

      <EnhancedFilterDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onApply={handleFilterApply}
      />
    </div>
  );
}
