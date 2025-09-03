import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

// Import available delete mutations
import {
  useApiServiceDeleteApiV1DatasetsById,
  useApiServiceDeleteApiV1ProjectsById,
  useApiServiceDeleteApiV1SchemasById,
} from "../../openapi/queries";

export interface DeleteHandlerOptions {
  onSuccess?: () => void;
  onError?: (error: any) => void;
  redirectAfterDelete?: boolean;
}

export function useDeleteHandler(rowType: string, options: DeleteHandlerOptions = {}) {
  const router = useRouter();
  
  // Initialize delete mutations for different types
  const deleteDataset = useApiServiceDeleteApiV1DatasetsById({
    onSuccess: () => {
      toast.success("Dataset deleted successfully");
      options.onSuccess?.();
      if (options.redirectAfterDelete) {
        router.push("/datasets");
      }
    },
    onError: (error: any) => {
      toast.error(`Failed to delete dataset: ${error.message}`);
      options.onError?.(error);
    },
  });

  const deleteProject = useApiServiceDeleteApiV1ProjectsById({
    onSuccess: () => {
      toast.success("Project deleted successfully");
      options.onSuccess?.();
      if (options.redirectAfterDelete) {
        router.push("/collections");
      }
    },
    onError: (error: any) => {
      toast.error(`Failed to delete project: ${error.message}`);
      options.onError?.(error);
    },
  });

  const deleteSchema = useApiServiceDeleteApiV1SchemasById({
    onSuccess: () => {
      toast.success("Template deleted successfully");
      options.onSuccess?.();
      if (options.redirectAfterDelete) {
        router.push("/templates");
      }
    },
    onError: (error: any) => {
      toast.error(`Failed to delete template: ${error.message}`);
      options.onError?.(error);
    },
  });

  const handleDelete = async (row: any) => {
    const id = row.id;
    
    if (!id) {
      toast.error("Cannot delete: No ID found");
      return;
    }
    console.log("Deleting rowType", rowType);

    try {
      switch (rowType) {
        case "dataset":
          await deleteDataset.mutateAsync({ id });
          break;
        case "collection":
        case "project":
          await deleteProject.mutateAsync({ id });
          break;
        case "template":
        case "schema":
          await deleteSchema.mutateAsync({ id });
          break;
        default:
          toast.error(`Delete not supported for type: ${rowType}`);
      }
    } catch (error) {
      // Error handling is done in the mutation callbacks
      console.error("Delete operation failed:", error);
    }
  };

  return {
    handleDelete,
    isDeleting: deleteDataset.isPending || deleteProject.isPending || deleteSchema.isPending,
  };
}

// Convenience function for creating delete handlers
export function createDeleteHandler(
  rowType: string, 
  options: DeleteHandlerOptions = {}
) {
  return (row: any) => {
    const { handleDelete } = useDeleteHandler(rowType, options);
    return handleDelete(row);
  };
}
