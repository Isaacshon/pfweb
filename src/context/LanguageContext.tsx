'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'en' | 'ko' | 'zh' | 'es'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => any
}

const translations = {
  en: {
    nav: {
      home: 'Home',
      conference: 'Conference',
      events: 'Events',
      about: 'About',
      contact: 'Contact',
      join: 'Join Now'
    },
    hero: {
      influence: 'Kingdom Influence',
      title: 'PASSION FRUITS',
      subtitle: 'Leading a youth culture that is as trendy as it is transformative. Join the movement of changemakers.',
      getStarted: 'Get Started',
      vision: 'Our Vision'
    },
    menu: {
      conf: '2026 Conf',
      confSub: 'Conference',
      events: 'Events',
      eventsSub: 'Kingdom News',
      about: 'About Us',
      aboutSub: 'Our Story',
      vision: 'Vision',
      visionSub: 'Our Vision',
      contact: 'Contact',
      contactSub: 'Get in Touch',
      support: 'Support',
      supportSub: 'Sponsorship'
    },
    schedule: {
      title: 'Ministry',
      subtitle: 'Schedule',
      desc: 'Our ministries are filled with creative language and passion. Find your place today.',
      cta: 'Join a Ministry',
      mon: 'Monday Worship',
      sun: 'Passion Worship',
      sat: 'Youth Gathering',
      thu: 'Creative Lab'
    },
    about: {
      massiveTitle: 'We are Creators, not just followers.',
      massiveDesc: 'We break away from rigid traditions to create a space where young people’s creative talents and raw passion become a bridge for the Gospel. We lead a youth culture that is as trendy as it is transformative.',
      creativeCall: 'The Creative Call',
      creativeQuote: '"Art and culture are the most powerful languages we have to communicate the love of Jesus to the next generation."',
      commitment: 'Our Commitment',
      commitmentDesc: 'From supporting the marginalized to launching cultural projects that heal society, we are a community of young changemakers flipping the world upside down.',
      beliefsTitle: 'What We Believe',
      foundation: 'Foundation',
      missionTitle: 'Passion for Jesus, Culture for the World'
    },
    contactPage: {
      title: 'Get in Touch',
      subtitle: 'Visit our creative hub in Toronto. We\'d love to hear from you.',
      addressTitle: 'Our Location',
      address: '1057 McNicoll Ave, Scarborough, ON M1W 2L8, Canada',
      emailTitle: 'Email Us',
      email: 'passionfruits.ministry@gmail.com',
      instaTitle: 'Follow Us',
      instaHandle: '@passionfruits_ministry',
      formTitle: 'Send a Message',
      namePlaceholder: 'Your Name',
      emailPlaceholder: 'Email Address',
      messagePlaceholder: 'How can we help?',
      sendBtn: 'Send Message'
    }
  },
  ko: {
    nav: {
      home: '홈',
      conference: '컨퍼런스',
      events: '이벤트',
      about: '소개',
      contact: '문의',
      join: '가입하기'
    },
    hero: {
      influence: '킹덤 인플루언스',
      title: '패션 프루츠',
      subtitle: '트렌디하면서도 변화를 이끄는 청년 문화를 선도합니다. 세상을 바꾸는 체인지메이커들의 움직임에 동참하세요.',
      getStarted: '시작하기',
      vision: '우리의 비전'
    },
    menu: {
      conf: '2026 컨퍼런스',
      confSub: '컨퍼런스',
      events: '이벤트',
      eventsSub: '킹덤 뉴스',
      about: '소개',
      aboutSub: '우리의 이야기',
      vision: '비전',
      visionSub: '우리의 비전',
      contact: '문의',
      contactSub: '연락하기',
      support: '후원',
      supportSub: '스폰서십'
    },
    schedule: {
      title: '사역',
      subtitle: '스케줄',
      desc: '우리의 사역은 창의적인 언어와 열정으로 가득합니다. 당신의 자리를 찾아보세요.',
      cta: '사역 참여하기',
      mon: '월요 예배',
      sun: '패션 예배',
      sat: '청년 모임',
      thu: '크리에이티브 랩'
    },
    about: {
      massiveTitle: '우리는 단순한 추종자가 아닌, 창조자입니다.',
      massiveDesc: '정형화된 틀을 깨고 청년들의 창의적인 재능과 가공되지 않은 열정이 복음의 통로가 되는 공간을 만듭니다. 우리는 변화를 일으키는 트렌디한 청년 문화를 주도합니다.',
      creativeCall: '창조적인 부르심',
      creativeQuote: '"예술과 문화는 우리가 다음 세대에게 예수님의 사랑을 전할 수 있는 가장 강력한 언어입니다."',
      commitment: '우리의 다짐',
      commitmentDesc: '소외된 이들을 향한 마음부터 사회를 치유하는 문화 프로젝트까지, 우리는 세상을 뒤집어 놓는 젊은 체인지메이커들의 공동체입니다.',
      beliefsTitle: '우리의 믿음',
      foundation: '신앙의 기초',
      missionTitle: '예수를 향한 열정, 세상을 향한 문화'
    },
    contactPage: {
      title: '문의하기',
      subtitle: '토론토의 크리에이티브 허브를 방문해 보세요. 여러분의 소중한 목소리를 기다립니다.',
      addressTitle: '찾아오시는 길',
      address: '1057 McNicoll Ave, Scarborough, ON M1W 2L8, Canada',
      emailTitle: '이메일 문의',
      email: 'passionfruits.ministry@gmail.com',
      instaTitle: '공식 인스타그램',
      instaHandle: '@passionfruits_ministry',
      formTitle: '메시지 남기기',
      namePlaceholder: '이름',
      emailPlaceholder: '이메일 주소',
      messagePlaceholder: '무엇을 도와드릴까요?',
      sendBtn: '메시지 전송하기'
    }
  },
  zh: {
    nav: {
      home: '首页',
      conference: '特会',
      events: '活动',
      about: '关于我们',
      contact: '联系我们',
      join: '立即加入'
    },
    hero: {
      influence: '神国影响力',
      title: '热情 果实',
      subtitle: '引领走在潮流尖端且具有变革力的青年文化。加入变革者的行列。',
      getStarted: '立即开始',
      vision: '我们的愿景'
    },
    menu: {
      conf: '2026 特会',
      confSub: '年度特会',
      events: '近期活动',
      eventsSub: '神国新闻',
      about: '关于我们',
      aboutSub: '我们的故事',
      vision: '异象',
      visionSub: '核心愿景',
      contact: '联系我们',
      contactSub: '保持沟通',
      support: '支持事工',
      supportSub: '赞助与合作'
    },
    schedule: {
      title: '事工板块',
      subtitle: '日程表',
      desc: '我们的事工充满了创意的语言和热情。今天就找到属于你的位置。',
      cta: '参与事工',
      mon: '周一崇拜',
      sun: '热情崇拜',
      sat: '青年聚会',
      thu: '创意实验室'
    },
    about: {
      massiveTitle: '我们是创造者，而不仅仅是追随者。',
      massiveDesc: '我们打破僵化的传统，创造一个让年轻人的创意天赋和纯粹热情成为福音桥梁的空间。我们引领着既潮流又具转型能力的青年文化。',
      creativeCall: '创意的呼召',
      creativeQuote: '“艺术和文化是我们向下一代传达耶稣之爱最强有力的语言。”',
      commitment: '我们的承诺',
      commitmentDesc: '从支持弱势群体到发起治愈社会的文化项目，我们是一个致力于颠覆世界的年轻变革者社区。',
      beliefsTitle: '我们的信仰',
      foundation: '信仰基础',
      missionTitle: '为耶稣燃烧热情，以文化改变世界'
    },
    contactPage: {
      title: '保持联系',
      subtitle: '欢迎访问我们在多伦多的创意中心。我们非常期待听到您的声音。',
      addressTitle: '我们的位置',
      address: '1057 McNicoll Ave, Scarborough, ON M1W 2L8, Canada',
      emailTitle: '邮件联系',
      email: 'passionfruits.ministry@gmail.com',
      instaTitle: '关注我们',
      instaHandle: '@passionfruits_ministry',
      formTitle: '在线留言',
      namePlaceholder: '您的姓名',
      emailPlaceholder: '电子邮件',
      messagePlaceholder: '有什么可以帮到您的？',
      sendBtn: '发送消息'
    }
  },
  es: {
    nav: {
      home: 'Inicio',
      conference: 'Conferencia',
      events: 'Eventos',
      about: 'Nosotros',
      contact: 'Contacto',
      join: 'Únete'
    },
    hero: {
      influence: 'Influencia del Reino',
      title: 'PASSION FRUITS',
      subtitle: 'Liderando una cultura juvenil que es tan moderna como transformadora. Únete al movimiento de agentes de cambio.',
      getStarted: 'Comenzar',
      vision: 'Nuestra Visión'
    },
    menu: {
      conf: 'Conf 2026',
      confSub: 'Conferencia',
      events: 'Eventos',
      eventsSub: 'Noticias del Reino',
      about: 'Nosotros',
      aboutSub: 'Nuestra Historia',
      vision: 'Visión',
      visionSub: 'Nuestra Visión',
      contact: 'Contacto',
      contactSub: 'Escríbenos',
      support: 'Apoyo',
      supportSub: 'Patrocinio'
    },
    schedule: {
      title: 'Ministerios',
      subtitle: 'Horarios',
      desc: 'Nuestros ministerios están llenos de lenguaje creativo y pasión. Encuentra tu lugar hoy.',
      cta: 'Unirse al Ministerio',
      mon: 'Adoración Lunes',
      sun: 'Adoración Pasión',
      sat: 'Reunión Juvenil',
      thu: 'Laboratorio Creativo'
    },
    about: {
      massiveTitle: 'Somos Creadores, no solo seguidores.',
      massiveDesc: 'Rompemos con las tradiciones rígidas para crear un espacio donde los talentos creativos y la pasión pura de los jóvenes se conviertan en un puente para el Evangelio. Lideramos una cultura juvenil moderna y transformadora.',
      creativeCall: 'El Llamado Creativo',
      creativeQuote: '"El arte y la cultura son los lenguajes más poderosos que tenemos para comunicar el amor de Jesús a la próxima generación."',
      commitment: 'Nuestro Compromiso',
      commitmentDesc: 'Desde el apoyo a los marginados hasta el lanzamiento de proyectos culturales que sanan la sociedad, somos una comunidad de jóvenes agentes de cambio que están transformando el mundo.',
      beliefsTitle: 'Lo Que Creemos',
      foundation: 'Fundamentos',
      missionTitle: 'Pasión por Jesús, Cultura para el Mundo'
    },
    contactPage: {
      title: 'Ponte en Contacto',
      subtitle: 'Visita nuestro centro creativo en Toronto. Nos encantaría saber de ti.',
      addressTitle: 'Nuestra Ubicación',
      address: '1057 McNicoll Ave, Scarborough, ON M1W 2L8, Canada',
      emailTitle: 'Envíanos un Correo',
      email: 'passionfruits.ministry@gmail.com',
      instaTitle: 'Síguenos',
      instaHandle: '@passionfruits_ministry',
      formTitle: 'Enviar un Mensaje',
      namePlaceholder: 'Tu Nombre',
      emailPlaceholder: 'Correo Electrónico',
      messagePlaceholder: '¿Cómo podemos ayudarte?',
      sendBtn: 'Enviar Mensaje'
    }
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en')

  const t = (path: string) => {
    const keys = path.split('.')
    let result: any = translations[language]
    for (const key of keys) {
      if (result && result[key]) {
        result = result[key]
      } else {
        return path
      }
    }
    return result
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
