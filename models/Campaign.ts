export interface Campaign {
  id: string
  title: string
  description: string
  imageUrl: string
  budget: number
  paid: number
  reward: number
  type: string
  socialMedia: string[]
  requirements?: string[]
  category: string
  files?: string[]
  status: number
  creationDate: Date
  startDate:    Date
  endDate:      Date
  authorId:     string
  authorName:   string
  authorAvatar: string
  maxPayment: number
}

export enum SocialMedia { TikTok='tiktok', YouTube='youtube', Instagram='instagram' }
