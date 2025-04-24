'use client'

import { createContext, useContext, useState } from 'react'
import { User } from '@prisma/client'

interface UserContextProps {
  user: User | null
  setUser: (user: User | null) => void
}

const UserContext = createContext<UserContextProps | undefined>(undefined)

export const UserProvider = ({ children }: {
  children: React.ReactNode
}) => {
  const [user, setUser] = useState<User | null>(null)
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useTransaction must be used within a UserProvider')
  }
  return context
}