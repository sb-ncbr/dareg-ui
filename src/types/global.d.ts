export type ProjectsData = {
    id?: string,
    name: string,
    description: string,
    upper?: string | null,
    default_template: string,
    creator?: string,
    created_at?: string,
  }

export type TemplatesData = {
    id?: string,
    name: string,
    description: string,
    scheme: string,
    uischeme: string,
    created_at?: string,
    creator?: string
}

export type FormData = {
    id?: string,
    node: string,
    used_template: string,
    data: string,
    created_at?: string
    creator?: string,
}

export type DatasetsData = {
    dataset: ProjectsData,
    project: ProjectsData,
    template: TemplatesData,
    form: FormData,
}

module.exports = {
    DatasetsData,
    ProjectsData,
    TemplatesData,
    FormData,
}