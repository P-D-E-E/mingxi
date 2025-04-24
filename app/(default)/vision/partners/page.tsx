export const metadata = {
    title: '明曦 - 愿景',
    description: 'Page description',
    icons: {
      icon: [
        { url: '/images/Mingxi.png' },
      ],
    },
  }
  
  import Intro from './intro'
  import Story from './story'
  import MiddleNav from '../MiddleNav'
  import Team from './team'


  export default function Partners() {
    return (
      <>
        <Intro />
        <MiddleNav />
        <Story />
        {/*<Team />*/}
      </>
    )
  }
  