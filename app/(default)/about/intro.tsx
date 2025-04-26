import Image from 'next/image'
import AboutImage from '@/public/images/P5.jpg'

export default function AboutIntro() {  
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-20 pb-8 md:pt-40 md:pb-20">
          <figure className="w-full">
            <Image 
              className="rounded shadow-2xl w-full h-auto object-cover" 
              src={AboutImage} 
              width={2800} 
              height={1137} 
              priority 
              alt="About us" 
            />
          </figure>
        </div>
      </div>
    </section>
  )
}