'use client'

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react'

type Language = 'pt' | 'en'

type StatItem = {
  value: string
  label: string
}

type ProjectItem = {
  id: number
  title: string
  category: string
  year: string
  description: string
  color?: string
  url?: string
}

type ServiceItem = {
  id: number
  title: string
  description: string
  features: string[]
}

type Translation = {
  nav: {
    about: string
    projects: string
    services: string
    contact: string
    language: string
    startProject: string
    viewAll: string
    backToTop: string
  }
  hero: {
    intro: string
    main1: string
    main2: string
    main3: string
    subtitle: string
    work: string
    talk: string
    scroll: string
    rotatingBadge: string
  }
  about: {
    label: string
    title: string
    titleAccent: string
    p1: string
    p2: string
    quote: string
    stats: StatItem[]
  }
  projects: {
    label: string
    titleLine1: string
    titleLine2: string
    viewAll: string
    items: ProjectItem[]
  }
  services: {
    label: string
    title: string
    subtitle: string
    badgeText: string
    items: ServiceItem[]
  }
  contact: {
    label: string
    title1: string
    title2: string
    title3: string
    description: string
    button: string
    email: string
    phone: string
    location: string
    socials: string
    socialNames: string[]
  }
  footer: {
    copyright: string
    backToTop: string
    logo: string
  }
  marquee: {
    words: string[]
  }
}

const translations: Record<Language, Translation> = {
  pt: {
    nav: {
      about: 'Sobre',
      projects: 'Produtos',
      services: 'Serviços',
      contact: 'Contato',
      language: 'EN',
      startProject: 'Iniciar Projeto',
      viewAll: 'Ver Todos',
      backToTop: 'Voltar ao topo',
    },
    hero: {
      intro: 'FRPC - software & inovação',
      main1: 'CRIAMOS',
      main2: 'SOFTWARE',
      main3: 'AGORA',
      subtitle:
        'Desenvolvemos agora aplicações web modernas que transformam a forma como as equipas trabalham. Do conceito ao lançamento, construímos produtos digitais que fazem a diferença.',
      work: 'Ver Produtos',
      talk: 'Fale Conosco',
      scroll: 'Scroll',
      rotatingBadge: '• DESCOBRE • EXPERIMENTA • SUBSCREVE • CRESCE ',
    },
    about: {
      label: '01 — Sobre Nós',
      title: 'Desenvolvemos software',
      titleAccent: ' que transforma equipas e processos',
      p1:
        'Na FRPC, transformamos ideias em produtos digitais que as pessoas adoram usar. Combinamos design cuidado, tecnologia moderna e foco na experiência do utilizador para criar aplicações que resolvem problemas reais.',
      p2:
        'Cada produto que lançamos nasce de uma necessidade concreta. Construímos ferramentas SaaS intuitivas, escaláveis e prontas para o dia a dia de equipas e empresas que querem trabalhar melhor.',
      quote: 'Software que funciona para si',
      stats: [
        { value: '2+', label: 'Produtos Lançados' },
        { value: '2026', label: 'Ano de Fundação' },
        { value: '100%', label: 'Foco no Cliente' },
      ],
    },
    projects: {
      label: '02 — Produtos',
      titleLine1: 'Os Nossos',
      titleLine2: 'Produtos',
      viewAll: 'Ver Todos',
      items: [
        {
          id: 1,
          title: 'Calendário de Férias',
          category: 'SaaS · Gestão de Equipas',
          year: '2026',
          description: 'Plataforma de gestão de férias e ausências para equipas. Simples, visual e eficiente.',
          url: 'https://frpc-calendario-de-ferias-production.up.railway.app/login.html',
        },
        {
          id: 2,
          title: 'Project Manager',
          category: 'SaaS · Gestão de Projetos',
          year: '2026',
          description: 'Ferramenta completa para gerir projetos, tarefas e equipas numa interface moderna e intuitiva.',
          url: 'https://frpc-project-production.up.railway.app/login.html',
        },
        {
          id: 3,
          title: 'Portal FRPC',
          category: 'Web · Portal de Produtos',
          year: '2026',
          description: 'Portal central para aceder a todos os produtos e serviços FRPC num único lugar.',
        },
      ],
    },
    services: {
      label: '03 — Serviços',
      title: 'O que fazemos',
      subtitle: 'de melhor',
      badgeText: '• REACT • NEXTJS • TYPESCRIPT • SAAS ',
      items: [
        {
          id: 1,
          title: 'Desenvolvimento Web',
          description:
            'Criamos aplicações web modernas e performantes com as melhores tecnologias do mercado — React, Next.js e TypeScript.',
          features: ['React / Next.js', 'TypeScript', 'APIs REST'],
        },
        {
          id: 2,
          title: 'Produtos SaaS',
          description:
            'Desenvolvemos e operamos produtos SaaS prontos a usar, com foco em usabilidade, escalabilidade e valor real para o utilizador.',
          features: ['Multi-tenant', 'Subscrições', 'Dashboards'],
        },
        {
          id: 3,
          title: 'UI/UX Design',
          description:
            'Desenhamos interfaces que os utilizadores adoram: claras, consistentes e pensadas para cada fluxo de trabalho.',
          features: ['Protótipagem', 'Design System', 'Testes de Usabilidade'],
        },
        {
          id: 4,
          title: 'Consultoria Técnica',
          description:
            'Apoiamos equipas e empresas na escolha de tecnologias, arquitetura de sistemas e melhores práticas de desenvolvimento.',
          features: ['Arquitetura', 'Code Review', 'Mentoria'],
        },
      ],
    },
    contact: {
      label: '04 — Contato',
      title1: 'Vamos criar',
      title2: 'algo incrível',
      title3: 'juntos?',
      description:
        'Tem uma ideia de produto ou precisa de software à medida? Fale connosco e vamos transformar a sua visão em realidade.',
      button: 'Iniciar Conversa',
      email: 'Email',
      phone: 'Telefone',
      location: 'Localização',
      socials: 'Redes Sociais',
      socialNames: ['Instagram', 'LinkedIn', 'GitHub', 'Twitter'],
    },
    footer: {
      copyright: '© {year} FRPC. Todos os direitos reservados.',
      backToTop: 'Voltar ao topo',
      logo: 'FRPC',
    },
    marquee: {
      words: ['SOFTWARE', 'INOVAÇÃO', 'SAAS', 'WEB APP', 'DESIGN', 'TYPESCRIPT'],
    },
  },
  en: {
    nav: {
      about: 'About',
      projects: 'Products',
      services: 'Services',
      contact: 'Contact',
      language: 'PT',
      startProject: 'Start Project',
      viewAll: 'View All',
      backToTop: 'Back to top',
    },
    hero: {
      intro: 'FRPC - software & innovation',
      main1: 'WE BUILD',
      main2: 'AMAZING',
      main3: 'SOFTWARE',
      subtitle:
        'We craft modern web applications that transform the way teams work. From concept to launch, we build digital products that make a real difference.',
      work: 'See Products',
      talk: 'Talk to Us',
      scroll: 'Scroll',
      rotatingBadge: '• DISCOVER • TRY • SUBSCRIBE • GROW ',
    },
    about: {
      label: '01 — About Us',
      title: 'We build software',
      titleAccent: ' that transforms teams and workflows',
      p1:
        'At FRPC, we turn ideas into digital products that people love to use. We combine thoughtful design, modern technology, and a sharp focus on user experience to build applications that solve real problems.',
      p2:
        'Every product we ship starts with a concrete need. We build intuitive, scalable SaaS tools that are ready for the daily demands of teams and companies that want to work smarter.',
      quote: 'Software that works for you',
      stats: [
        { value: '3+', label: 'Products Launched' },
        { value: '2026', label: 'Founded' },
        { value: '100%', label: 'Customer Focus' },
      ],
    },
    projects: {
      label: '02 — Products',
      titleLine1: 'Our',
      titleLine2: 'Products',
      viewAll: 'View All',
      items: [
        {
          id: 1,
          title: 'Vacation Schedule',
          category: 'SaaS · Team Management',
          year: '2026',
          description: 'Vacation and absence management platform for teams. Simple, visual, and efficient.',
          url: 'https://frpc-calendario-de-ferias-production.up.railway.app/login.html',
        },
        {
          id: 2,
          title: 'Project Manager',
          category: 'SaaS · Project Management',
          year: '2026',
          description: 'Complete tool to manage projects, tasks, and teams with a modern and intuitive interface.',
          url: 'https://frpc-project-production.up.railway.app/login.html',
        },
        {
          id: 3,
          title: 'FRPC Portal',
          category: 'Web · Product Hub',
          year: '2026',
          description: 'Central hub to access all FRPC products and services in one place.',
        },
      ],
    },
    services: {
      label: '03 — Services',
      title: 'What we do',
      subtitle: 'best',
      badgeText: '• REACT • NEXTJS • TYPESCRIPT • SAAS ',
      items: [
        {
          id: 1,
          title: 'Web Development',
          description:
            'We build modern, high-performance web applications using the best technologies — React, Next.js, and TypeScript.',
          features: ['React / Next.js', 'TypeScript', 'REST APIs'],
        },
        {
          id: 2,
          title: 'SaaS Products',
          description:
            'We develop and operate ready-to-use SaaS products focused on usability, scalability, and real value for users.',
          features: ['Multi-tenant', 'Subscriptions', 'Dashboards'],
        },
        {
          id: 3,
          title: 'UI/UX Design',
          description:
            'We design interfaces that users love: clear, consistent, and crafted for each specific workflow.',
          features: ['Prototyping', 'Design System', 'Usability Testing'],
        },
        {
          id: 4,
          title: 'Technical Consulting',
          description:
            'We help teams and companies choose the right technologies, system architecture, and development best practices.',
          features: ['Architecture', 'Code Review', 'Mentoring'],
        },
      ],
    },
    contact: {
      label: '04 — Contact',
      title1: 'Let\'s create',
      title2: 'something amazing',
      title3: 'together?',
      description:
        'Have a product idea or need custom software? Get in touch and let\'s turn your vision into reality.',
      button: 'Start Conversation',
      email: 'Email',
      phone: 'Phone',
      location: 'Location',
      socials: 'Socials',
      socialNames: ['Instagram', 'LinkedIn', 'GitHub', 'Twitter'],
    },
    footer: {
      copyright: '© {year} FRPC. All rights reserved.',
      backToTop: 'Back to top',
      logo: 'FRPC',
    },
    marquee: {
      words: ['SOFTWARE', 'INNOVATION', 'SAAS', 'WEB APP', 'DESIGN', 'TYPESCRIPT'],
    },
  },
}

interface LanguageContextType {
  lang: Language
  t: Translation
  toggleLanguage: () => void
  isSwitching: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>({
  lang: 'pt',
  t: translations.pt,
  toggleLanguage: () => {},
  isSwitching: false
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('pt')
  const [isSwitching, setIsSwitching] = useState(false)
  const switchTimeoutsRef = useRef<Array<number>>([])

  useEffect(() => {
    return () => {
      switchTimeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout))
      switchTimeoutsRef.current = []
    }
  }, [])

  const toggleLanguage = () => {
    if (isSwitching) return

    setIsSwitching(true)
    const nextLang = lang === 'pt' ? 'en' : 'pt'

    const textTimeout = window.setTimeout(() => {
      setLang(nextLang)
    }, 400)

    const finishTimeout = window.setTimeout(() => {
      setIsSwitching(false)
      switchTimeoutsRef.current = []
    }, 800)

    switchTimeoutsRef.current = [textTimeout, finishTimeout]
  }

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], toggleLanguage, isSwitching }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  return context || {
    lang: 'pt' as Language,
    t: translations.pt,
    toggleLanguage: () => {},
    isSwitching: false
  }
}
