import  Footer from "@/components/ui/footer"
import  Header from "@/components/ui/header"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {  
  return (
    <>
    <Header/>
    <main className="grow bg-gradient-to-b from-gray-200 to-white">
      {children}
    </main>  
    <Footer/>
    </>
  )
}
