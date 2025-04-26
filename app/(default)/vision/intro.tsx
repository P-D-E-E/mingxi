import Image from 'next/image'
import AboutImage from '@/public/images/P3.jpg'

export default function AboutIntro() {  
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-24 sm:pt-32 md:pt-40 pb-8 sm:pb-12 md:pb-20">
          <figure className="w-full">
            <Image 
              className="rounded shadow-2xl w-full h-auto" 
              src={AboutImage} 
              width={2800} 
              height={1137} 
              priority 
              alt="About us" 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
            />
          </figure>
        </div>
      </div>
    </section>
  )
}