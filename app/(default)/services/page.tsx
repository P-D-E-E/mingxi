export const metadata = {
    title: '明曦咨询 - 服务业务',
    description: 'Page description',
    icons: {
      icon: [
        { url: '/images/Mingxi.png' },
      ],
    },
  }
  
  import Intro from './intro'
  import Story from './story'
  import Service from './service'

  export default function () {
    return (
      <>
        <Intro />
        <Story />
        <Service />
      </>
    )
  }