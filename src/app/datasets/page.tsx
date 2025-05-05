"use client";

import React, { useState } from "react";
import {useApiServiceGetApiV1Datasets} from "../../../openapi/queries";
import { DynamicDataTable } from "@/components/dynamic_table/dynamic-data-table";
import {TypographyH2} from "@/components/typography/typography-h2";
import {SkeletonTable} from "@/components/dynamic_table/skeleton-table";


const DatasetsPage = () => {
    const [pageIndex, setPageIndex] = useState(0);

    const { data: datasets, isLoading } = useApiServiceGetApiV1Datasets();

    const projectDataCount = datasets?.count || 0;
    const pageCount = Math.ceil(projectDataCount / 10) || 0;

    const dataToUse = datasets || {};

    if (isLoading) {
        return <div>
            <TypographyH2 text={"Datasets"} />
            <SkeletonTable></SkeletonTable></div>;
    }


    return (
        <><TypographyH2 text={"Datasets"}/><DynamicDataTable
            data={dataToUse.results || []}
            pageIndex={pageIndex}
            pageCount={pageCount}
            onPageChange={setPageIndex}/></>
    );
};

export default DatasetsPage;
