export interface ICollection {
  id: string
  name: string
}

export interface IWeblateConfiguration {
  baseUrl: string
  collection: string
  token: string
  remember: boolean
  languageAsMode: boolean
}
