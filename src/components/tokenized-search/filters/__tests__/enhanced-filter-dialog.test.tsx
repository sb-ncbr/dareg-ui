import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EnhancedFilterDialog } from "../enhanced-filter-dialog";

// Mock the dependencies
jest.mock("../../../../openapi/queries", () => ({
  useApiServiceGetApiV1Schemas: () => ({
    data: {
      results: [
        {
          id: "schema-1",
          name: "Test Schema",
          schema: {
            type: "object",
            properties: {
              metadata: {
                type: "object",
                properties: {
                  solvent: {
                    type: "string",
                    enum: ["water", "ethanol", "methanol"],
                    title: "Solvent",
                  },
                },
              },
            },
          },
          uischema: {},
        },
      ],
    },
    isLoading: false,
  }),
}));

jest.mock("../../../forms/form-wraper/forms-wraped", () => {
  return function MockFormsWrapped({
    setData,
  }: {
    setData: (data: any) => void;
  }) {
    return (
      <div data-testid="forms-wrapped">
        <button onClick={() => setData({ solvent: "water" })}>
          Set Solvent to Water
        </button>
      </div>
    );
  };
});

jest.mock("../../providers/search-context", () => ({
  useSearch: () => ({
    setSelectedSchemaId: jest.fn(),
  }),
}));

describe("EnhancedFilterDialog", () => {
  const mockOnClose = jest.fn();
  const mockOnApply = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(
      <EnhancedFilterDialog
        open={true}
        onClose={mockOnClose}
        onApply={mockOnApply}
      />
    );

    expect(screen.getByText("Advanced Search Filters")).toBeInTheDocument();
  });

  it("shows model selection buttons", () => {
    render(
      <EnhancedFilterDialog
        open={true}
        onClose={mockOnClose}
        onApply={mockOnApply}
      />
    );

    // Should show available models
    expect(screen.getByText("Datasets")).toBeInTheDocument();
    expect(screen.getByText("Templates")).toBeInTheDocument();
  });

  it("allows switching between manual and enhanced modes", async () => {
    render(
      <EnhancedFilterDialog
        open={true}
        onClose={mockOnClose}
        onApply={mockOnApply}
      />
    );

    // Select Datasets model
    fireEvent.click(screen.getByText("Datasets"));

    // Wait for schema selection to appear
    await waitFor(() => {
      expect(screen.getByText("Metadata Selection")).toBeInTheDocument();
    });

    // Select a schema
    const schemaSelect = screen.getByText("Select a schema");
    fireEvent.click(schemaSelect);

    // Select the test schema
    fireEvent.click(screen.getByText("Test Schema"));

    // Wait for the input method toggle to appear
    await waitFor(() => {
      expect(screen.getByText("Metadata Input Method:")).toBeInTheDocument();
    });

    // Toggle to enhanced mode
    const modeSelect = screen.getByDisplayValue("Manual Fields");
    fireEvent.click(modeSelect);

    // Select enhanced form
    fireEvent.click(screen.getByText("Enhanced Form"));

    // Should show FormsWrapped component
    expect(screen.getByTestId("forms-wrapped")).toBeInTheDocument();
  });

  it("calls onApply with correct data when applying filters", async () => {
    render(
      <EnhancedFilterDialog
        open={true}
        onClose={mockOnClose}
        onApply={mockOnApply}
      />
    );

    // Select Datasets model
    fireEvent.click(screen.getByText("Datasets"));

    // Wait for and select schema
    await waitFor(() => {
      expect(screen.getByText("Metadata Selection")).toBeInTheDocument();
    });

    const schemaSelect = screen.getByText("Select a schema");
    fireEvent.click(schemaSelect);
    fireEvent.click(screen.getByText("Test Schema"));

    // Wait for and switch to enhanced mode
    await waitFor(() => {
      expect(screen.getByText("Metadata Input Method:")).toBeInTheDocument();
    });

    const modeSelect = screen.getByDisplayValue("Manual Fields");
    fireEvent.click(modeSelect);
    fireEvent.click(screen.getByText("Enhanced Form"));

    // Set some data using the mock FormsWrapped
    await waitFor(() => {
      expect(screen.getByTestId("forms-wrapped")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Set Solvent to Water"));

    // Apply filters
    fireEvent.click(screen.getByText(/Show results/));

    // Should call onApply with the correct data
    expect(mockOnApply).toHaveBeenCalledWith(
      "Dataset",
      expect.objectContaining({
        schema: "schema-1",
        solvent: "water",
      }),
      "schema-1"
    );
  });
});
