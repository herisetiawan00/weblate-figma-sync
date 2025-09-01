export interface IWeblateComponentsResponse {
  results: {
    translations_url: string
    name: string
    is_glossary: boolean
  }[]
}

export interface IWeblateTranslationResponse {
  results: {
    language: { name: string }
    language_code: string
    file_url: string
  }[]
}

