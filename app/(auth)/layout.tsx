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
    <main className="grow">
      {children}
    </main>  
    <Footer/>
    </>
  )
}
