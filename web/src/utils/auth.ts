import {StorageService} from '@/services/storage.service'

export function isAuthenticated(): boolean {
  return !!StorageService.getAccessToken()
}
