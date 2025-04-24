import Link from 'next/link'

export default function Logo() {
  return (
    <Link href="/" className="block" aria-label="Cruip">
         <img src="/images/Mingxi.png" alt="Mingxi Logo" className="w-20 h-20" />
    </Link>
  )
}
