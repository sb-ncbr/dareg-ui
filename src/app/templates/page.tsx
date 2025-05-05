"use client";

import React, { useState } from "react";
import { useApiServiceGetApiV1Schemas} from "../../../openapi/queries";
import { DynamicDataTable } from "@/components/dynamic_table/dynamic-data-table";
import {TypographyH2} from "@/components/typography/typography-h2";
import {SkeletonTable} from "@/components/dynamic_table/skeleton-table";


const TemplatesPage = () => {
    const [pageIndex, setPageIndex] = useState(0);

    const { data: templates, isLoading } = useApiServiceGetApiV1Schemas()

    const projectDataCount = templates?.count || 0;
    const pageCount = Math.ceil(projectDataCount / 10) || 0;

    const dataToUse = templates || {};

    if (isLoading) {
        return <div>
            <TypographyH2 text={"Templates"} />
            <SkeletonTable></SkeletonTable></div>;
    }

    return (
        <>
            <TypographyH2 text={"Templates"} />
            <DynamicDataTable
                data={dataToUse.results || []}
                pageIndex={pageIndex}
                pageCount={pageCount}
                onPageChange={setPageIndex}
            />
        </>
    );
};

export default TemplatesPage;
