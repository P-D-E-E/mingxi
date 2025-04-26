import Link from 'next/link'

export default function Logo() {
  return (
    <Link href="/" className="block" aria-label="Cruip">
      <img src="/images/Mingxi.png" alt="Mingxi Logo" className="w-12 h-12 md:w-20 md:h-20" />
    </Link>
  )
}