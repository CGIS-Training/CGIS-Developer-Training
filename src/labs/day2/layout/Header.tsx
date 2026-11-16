import type { ReactNode } from 'react'

type HeaderProps = {
  title: string
  children?: ReactNode
}

export function Header({ title, children }: HeaderProps) {
  return (
    <header className="app-header">
      <h1>{title}</h1>
      {children}
    </header>
  )
}
