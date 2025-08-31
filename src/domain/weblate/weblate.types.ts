export interface IWeblateComponentsResponse {
  results: {
    translations_url: string
    name: string
  }[]
}

export interface IWeblateTranslationResponse {
  results: {
    language_code: string
    file_url: string
  }[]
}

