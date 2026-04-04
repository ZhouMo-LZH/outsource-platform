'use client'

import { createContext, useContext } from 'react'

interface UnreadContextType {
  unreadCount: number
  refreshUnreadCount: () => void
}

export const UnreadContext = createContext<UnreadContextType>({
  unreadCount: 0,
  refreshUnreadCount: () => {}
})

export const useUnreadCount = () => useContext(UnreadContext)
