import Image from 'next/image'
import AboutImage from '@/public/images/about-02.jpg'
import AboutLogo from '@/public/images/about-logo.png'

export default function AboutStory() {  
  return (
    <section>
      <div className="max-w-5xl mx-auto px-4 sm:py-6 sm:px-6">
        <div className="pb-12 md:pb-20">

          <div className="max-w-3xl mx-auto text-rblue-900">
            <p className="text-lg text-gray-600 mb-8">
            战略合作伙伴：中美研究中心
            </p>
            
          </div>


        </div>
      </div>
    </section>
  )
}