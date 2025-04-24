import Image from 'next/image'
import AboutImage from '@/public/images/Mingxi.png'


export default function ContactIntro() {  
    return (
      <section>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="pt-32 pb-12 md:pt-48 ">
  
  
            <figure className="w-full">
      <Image 
      className="rounded shadow-2xl w-full h-80" 
      src={AboutImage} 
      width={768} 
      height={432} 
      priority 
      alt="About us" 
    />
  </figure>
  
  
          </div>
        </div>
      </section>
    )
  }