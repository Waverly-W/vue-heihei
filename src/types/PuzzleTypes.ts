export interface PuzzleScore {
  logicScore: number;
  funScore: number;
  difficultyScore: number;
  diversityScore: number;
  totalScore: number;
}

export interface PuzzleData {
  id: number
  difficultyLevel: string
  theme: string[]
  prompt: string
  solution: string
  keyPoints: string[]
  creator: string
  modifier: string | null
  versionNumber: number
  score: PuzzleScore
  createdDate: number
  lastModifiedDate: number
  active: boolean
  valid: boolean
}

export interface EnumValue {
  id: number
  valueCode: string
  valueName: string
  description: string
  sortOrder: number
  deleted: boolean
}

export interface EnumData {
  itemId: number
  itemName: string
  itemDescription: string
  enumValues: EnumValue[]
  deleted: boolean
}

export interface EnumResponse {
  code: string
  message: string
  data: EnumData
}
