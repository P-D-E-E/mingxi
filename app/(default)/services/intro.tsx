import Image from 'next/image'
import AboutImage from '@/public/images/P6.jpg'

export default function ServicesIntro() {  
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-24 pb-8 md:pt-32 md:pb-12 lg:pt-40 lg:pb-20">
          <figure className="w-full">
            <Image 
              className="rounded shadow-2xl w-full h-full" 
              src={AboutImage} 
              width={3000} 
              height={2000} 
              priority 
              alt="About us" 
            />
          </figure>
        </div>
      </div>
    </section>
  )
}