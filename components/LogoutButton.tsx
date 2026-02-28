'use client'

import { useRouter } from 'next/navigation'

interface LogoutButtonProps {
  children: React.ReactNode
  className?: string
}

export default function LogoutButton({ children, className }: LogoutButtonProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        router.push('/auth/login')
        router.refresh()
      } else {
        console.error('Logout failed')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <button 
      onClick={handleLogout}
      className={className}
    >
      {children}
    </button>
  )
}