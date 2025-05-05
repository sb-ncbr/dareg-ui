import { useEffect, useRef } from "react";
import { ViewModes } from "../types/enums";

const useDocumentTitle = (title: string, object?: 'Dataset' | 'Collection' | 'Template' | string, action?: ViewModes | string) => {
    const documentDefined = typeof document !== 'undefined';
    const originalTitle = useRef(documentDefined ? document.title : null);
  
    useEffect(() => {
      if (!documentDefined) return;
  
      switch (action) {
        case ViewModes.View:
          originalTitle.current = document.title;
          document.title = `${title} | ${object} | CEITEC Dataset Registry`;
          break;
        case ViewModes.Edit:
          originalTitle.current = document.title;
          document.title = `Editing ${title} | ${object} | CEITEC Dataset Registry`;
          break;
        case ViewModes.New:
          originalTitle.current = document.title;
          document.title = `Creating ${object} | CEITEC Dataset Registry`;
          break;
        default:
          document.title = `${title} | CEITEC Dataset Registry`;
          break;
      }
      // if (document.title !== title) document.title = `${object} | `;
  
      return () => {
        document.title = originalTitle.current || '';
      }
    }), [object, action, title];
  }

export default useDocumentTitle;