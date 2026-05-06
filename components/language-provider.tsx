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

type CardItem = {
  tag: string
  title: string
  body: string
  stat: string
  sub: string
}

type ProductItem2 = {
  label: string
  status: string
}

type Translation = {
  nav: {
    home: string
    about: string
    projects: string
    services: string
    contact: string
    pricing: string
    language: string
    startProject: string
    viewAll: string
    backToTop: string
    tutorials: string
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
  sections: {
    features: {
      label: string
      title1: string
      title2: string
      title3: string
      cards: CardItem[]
    }
    insights: {
      liveLabel: string
      title: string
      subtitle: string
      description: string
      globalLabel: string
      globalDesc: string
      stat1Label: string
      stat1Sub: string
      stat2Label: string
      stat2Sub: string
      pipelineLabel: string
      pipelineTitle: string
      pipelineDesc: string
      perfLabel: string
      perfTitle: string
      chips: string[]
      legendA: string
      legendB: string
      dayLabels: string[]
      footerLinks: string[]
      footerCopy: string
      statusActive: string
      statusOutput: string
    }
    testimonials: {
      starsLabel: string
      quote: string
      author: string
      role: string
      stats: Array<{ value: string; label: string }>
    }
    workspace: {
      title: string
      subtitle: string
      priceBtn: string
      productsLabel: string
      productsCount: string
      products: ProductItem2[]
      chips: string[]
      btnPrimary: string
      btnSecondary: string
      dialUptime: string
      dialLabel: string
    }
    cta: {
      label: string
      title1: string
      title2: string
      subtitle: string
      btnPrimary: string
      btnSecondary: string
      links: string[]
      copyright: string
    }
  }
}

const translations: Record<Language, Translation> = {
  pt: {
    nav: {
      about: 'Sobre',
      projects: 'Produtos',
      services: 'Serviços',
      contact: 'Contacto',
      pricing: 'Preços',
      language: 'EN',
      startProject: 'Iniciar Projeto',
      viewAll: 'Ver Todos',
      backToTop: 'Voltar ao topo',
      home: 'Início',
      tutorials: 'Tutoriais',
    },
    hero: {
      intro: 'Vol. 01 — Digital Studio · 2026',
      main1: 'Criamos',
      main2: 'digital',
      main3: 'produtos.',
      subtitle:
        'Um studio focado onde design encontra tecnologia — construído para marcas que se preocupam com o detalhe.',
      work: 'Contacto',
      talk: 'Descobrir',
      scroll: 'Scroll para explorar',
      rotatingBadge: '• DESCOBRE • EXPERIMENTA • SUBSCREVE • CRESCE ',
    },
    about: {
      label: '01 — Sobre Nós',
      title: 'Desenvolvemos software',
      titleAccent: ' à medida de qualquer necessidade',
      p1:
        'Na FRPC, transformamos ideias em produtos digitais. Combinamos design, tecnologia moderna e foco na experiência do utilizador para criar aplicações que resolvem problemas reais.',
      p2:
        'Cada produto que lançamos nasce de uma necessidade concreta. Construímos ferramentas SaaS intuitivas, escaláveis e prontas para o dia a dia de equipas e empresas que querem melhorar o fluxo de trabalho.',
      quote: 'Software que funciona para si',
      stats: [
        { value: '3+', label: 'Produtos Lançados' },
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
          url: '/produtos/calendario-de-ferias',
        },
        {
          id: 2,
          title: 'Project Manager',
          category: 'SaaS · Gestão de Projetos',
          year: '2026',
          description: 'Ferramenta completa para gerir projetos, tarefas e equipas numa interface moderna e intuitiva.',
          url: '/produtos/project-manager',
        },
        {
          id: 3,
          title: 'Portal FRPC',
          category: 'Web · Portal de Produtos',
          year: '2026',
          description: 'Portal central para aceder a todos os produtos e serviços FRPC num único lugar.',
        },
        {
          id: 4,
          title: 'CloseAI',
          category: 'SaaS · IA & Automação',
          year: '2026',
          description: 'Agente inteligente integrado no WhatsApp e Instagram que qualifica leads, responde automaticamente e fecha marcações — ideal para imobiliário, clínicas e serviços de consultas.',
        },
      ],
    },
    services: {
      label: '03 — Serviços',
      title: 'Áreas',
      subtitle: 'de atuação',
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
      label: '04 — Contacto',
      title1: 'Vamos criar',
      title2: 'algo incrível',
      title3: 'juntos?',
      description:
        'Tem uma ideia de produto ou precisa de software à medida? Fale connosco e vamos transformar a sua visão em realidade.',
      button: 'Iniciar Conversa',
      email: 'Email',
      phone: 'Telefone',
      location: 'Localização',
      socials: '',
      socialNames: [],
    },
    footer: {
      copyright: '© {year} FRPC. Todos os direitos reservados.',
      backToTop: 'Voltar ao topo',
      logo: 'FRPC',
    },
    marquee: {
      words: ['SOFTWARE', 'INOVAÇÃO', 'SAAS', 'WEB APP', 'DESIGN', 'TYPESCRIPT'],
    },
    sections: {
      features: {
        label: 'O Studio',
        title1: 'Do conceito ao produto',
        title2: 'com atenção a',
        title3: 'cada detalhe.',
        cards: [
          { tag: '01 — Design', title: 'Design & UX', body: 'Interfaces, sistemas de design e identidade visual construídos com atenção obsessiva ao detalhe — do wireframe ao produto final.', stat: '100%', sub: 'foco no utilizador' },
          { tag: '02 — Produto', title: 'Desenvolvimento', body: 'Apps web, SaaS e APIs modernas com as tecnologias certas — escaláveis desde o primeiro dia e prontas a crescer.', stat: '99.9%', sub: 'uptime garantido' },
          { tag: '03 — Lançamento', title: 'Do conceito ao mercado', body: 'Acompanhamos o teu projeto desde a ideia até ao lançamento, com um processo claro, iterativo e sem surpresas.', stat: '48h', sub: 'resposta garantida' },
        ],
      },
      insights: {
        liveLabel: 'Live · Q2 2026',
        title: 'Resultados',
        subtitle: 'mensuráveis',
        description: 'Um dashboard vivo. Métricas que respiram. Cada sinal é um fio que podes puxar.',
        globalLabel: 'Taxa de satisfação · global',
        globalDesc: 'Clientes satisfeitos com produtos entregues a tempo e com qualidade.',
        stat1Label: 'Projetos entregues',
        stat1Sub: 'desde o lançamento',
        stat2Label: 'Resposta',
        stat2Sub: 'tempo médio de resposta',
        pipelineLabel: '02 — Processo',
        pipelineTitle: 'Desenvolvimento Ágil',
        pipelineDesc: 'Iterações rápidas, feedback constante — o produto evolui com as tuas necessidades reais.',
        perfLabel: '03 — Performance',
        perfTitle: 'Entregas por semana',
        chips: ['↗ +1.2k / mês', 'Novo projeto', 'Auto-assign'],
        legendA: 'Entregues',
        legendB: 'Revistos',
        dayLabels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
        footerLinks: ['Suporte', 'Status', 'Docs'],
        footerCopy: 'Criado no FRPC Studio · 2026',
        statusActive: 'Ativo',
        statusOutput: 'Output',
      },
      testimonials: {
        starsLabel: 'Destaques de clientes',
        quote: '"A FRPC entregou o nosso Calendário de Férias num tempo recorde. O resultado superou todas as expectativas — interface limpa, produto sólido."',
        author: 'Ricardo Fonseca',
        role: 'CEO, TechFlow Lisboa',
        stats: [
          { value: '48h', label: 'Resposta garantida' },
          { value: '3+', label: 'Produtos lançados' },
          { value: '100%', label: 'Foco no cliente' },
          { value: '2025', label: 'A crescer desde' },
        ],
      },
      workspace: {
        title: 'Os nossos Produtos',
        subtitle: 'Software feito em Portugal para simplificar o trabalho das equipas — do calendário de férias à gestão de projetos.',
        priceBtn: 'Ver preços',
        productsLabel: 'Produtos em produção',
        productsCount: '2 Ativos',
        products: [
          { label: 'Calendário de Férias', status: 'Ativo' },
          { label: 'Project Manager', status: 'Ativo' },
          { label: 'Portal FRPC', status: 'Em breve' },
        ],
        chips: ['Calendário de Férias', 'Project Manager', 'Portal FRPC', 'Cloud Native', 'Suporte Prioritário', 'Feito em Portugal', 'Enterprise Ready'],
        btnPrimary: 'Ver Produtos',
        btnSecondary: 'Preços',
        dialUptime: 'Uptime',
        dialLabel: 'Produtos Ativos',
      },
      cta: {
        label: 'Começa hoje — é grátis',
        title1: 'Inicia o teu',
        title2: 'projeto.',
        subtitle: 'Os teus melhores designs, as tecnologias certas, o teu melhor trabalho — num único lugar tranquilo.',
        btnPrimary: 'Começar grátis',
        btnSecondary: 'Fala connosco',
        links: ['Privacidade', 'Termos', 'Docs', 'Status'],
        copyright: '© 2026 FRPC Studio',
      },
    },
  },
  en: {
    nav: {
      about: 'About',
      projects: 'Products',
      services: 'Services',
      contact: 'Contact',
      pricing: 'Pricing',
      language: 'PT',
      startProject: 'Start Project',
      viewAll: 'View All',
      backToTop: 'Back to top',
      home: 'Home',
      tutorials: 'Tutorials',
    },
    hero: {
      intro: 'Vol. 01 — Digital Studio · 2026',
      main1: 'We build',
      main2: 'digital',
      main3: 'products.',
      subtitle:
        'A focused studio where design meets technology — built for brands that care about every detail.',
      work: 'Open Studio',
      talk: 'Discover',
      scroll: 'Scroll to explore',
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
          url: '/produtos/calendario-de-ferias',
        },
        {
          id: 2,
          title: 'Project Manager',
          category: 'SaaS · Project Management',
          year: '2026',
          description: 'Complete tool to manage projects, tasks, and teams with a modern and intuitive interface.',
          url: '/produtos/project-manager',
        },
        {
          id: 3,
          title: 'FRPC Portal',
          category: 'Web · Product Hub',
          year: '2026',
          description: 'Central hub to access all FRPC products and services in one place.',
        },
        {
          id: 4,
          title: 'CloseAI',
          category: 'SaaS · AI & Automation',
          year: '2026',
          description: 'Intelligent agent integrated with WhatsApp and Instagram that qualifies leads, responds automatically, and closes bookings — ideal for real estate, clinics, and consultation services.',
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
      socials: '',
      socialNames: [],
    },
    footer: {
      copyright: '© {year} FRPC. All rights reserved.',
      backToTop: 'Back to top',
      logo: 'FRPC',
    },
    marquee: {
      words: ['SOFTWARE', 'INNOVATION', 'SAAS', 'WEB APP', 'DESIGN', 'TYPESCRIPT'],
    },
    sections: {
      features: {
        label: 'The Studio',
        title1: 'From concept to product',
        title2: 'with attention to',
        title3: 'every detail.',
        cards: [
          { tag: '01 — Design', title: 'Design & UX', body: 'Interfaces, design systems and visual identity built with obsessive attention to detail — from wireframe to final product.', stat: '100%', sub: 'user focused' },
          { tag: '02 — Product', title: 'Development', body: 'Web apps, SaaS and modern APIs with the right technologies — scalable from day one and ready to grow.', stat: '99.9%', sub: 'guaranteed uptime' },
          { tag: '03 — Launch', title: 'Concept to Market', body: 'We accompany your project from idea to launch, with a clear, iterative process and no surprises.', stat: '48h', sub: 'guaranteed response' },
        ],
      },
      insights: {
        liveLabel: 'Live · Q2 2026',
        title: 'Measurable',
        subtitle: 'results',
        description: 'A living dashboard. Metrics that breathe. Every signal is a thread you can pull.',
        globalLabel: 'Satisfaction rate · global',
        globalDesc: 'Clients satisfied with products delivered on time and with quality.',
        stat1Label: 'Projects delivered',
        stat1Sub: 'since launch',
        stat2Label: 'Response',
        stat2Sub: 'average response time',
        pipelineLabel: '02 — Process',
        pipelineTitle: 'Agile Development',
        pipelineDesc: 'Fast iterations, constant feedback — the product evolves with your real needs.',
        perfLabel: '03 — Performance',
        perfTitle: 'Deliveries per week',
        chips: ['↗ +1.2k / month', 'New project', 'Auto-assign'],
        legendA: 'Delivered',
        legendB: 'Reviewed',
        dayLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        footerLinks: ['Support', 'Status', 'Docs'],
        footerCopy: 'Created at FRPC Studio · 2026',
        statusActive: 'Active',
        statusOutput: 'Output',
      },
      testimonials: {
        starsLabel: 'Customer highlights',
        quote: '"FRPC delivered our Vacation Calendar in record time. The result exceeded all expectations — clean interface, solid product."',
        author: 'Ricardo Fonseca',
        role: 'CEO, TechFlow Lisboa',
        stats: [
          { value: '48h', label: 'Guaranteed response' },
          { value: '3+', label: 'Products launched' },
          { value: '100%', label: 'Customer focus' },
          { value: '2025', label: 'Growing since' },
        ],
      },
      workspace: {
        title: 'Our Products',
        subtitle: 'Software made in Portugal to simplify team workflows — from vacation calendars to project management.',
        priceBtn: 'See pricing',
        productsLabel: 'Products in production',
        productsCount: '2 Active',
        products: [
          { label: 'Vacation Calendar', status: 'Active' },
          { label: 'Project Manager', status: 'Active' },
          { label: 'FRPC Portal', status: 'Coming soon' },
        ],
        chips: ['Vacation Calendar', 'Project Manager', 'FRPC Portal', 'Cloud Native', 'Priority Support', 'Made in Portugal', 'Enterprise Ready'],
        btnPrimary: 'View Products',
        btnSecondary: 'Pricing',
        dialUptime: 'Uptime',
        dialLabel: 'Active Products',
      },
      cta: {
        label: "Start today — it's free",
        title1: 'Start your',
        title2: 'project.',
        subtitle: 'Your best designs, the right technologies, your best work — all in one calm place.',
        btnPrimary: 'Start for free',
        btnSecondary: 'Talk to us',
        links: ['Privacy', 'Terms', 'Docs', 'Status'],
        copyright: '© 2026 FRPC Studio',
      },
    },
  },
}

// ─── Two separate contexts so isSwitching changes don't re-render
// components that only care about lang/t/toggleLanguage ──────────────────

interface LangContextType {
  lang: Language
  t: Translation
  toggleLanguage: () => void
}

interface SwitchContextType {
  isSwitching: boolean
}

const LangContext = createContext<LangContextType>({
  lang: 'pt',
  t: translations.pt,
  toggleLanguage: () => {},
})

const SwitchContext = createContext<SwitchContextType>({ isSwitching: false })

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
    const textTimeout = window.setTimeout(() => { setLang(nextLang) }, 400)
    const finishTimeout = window.setTimeout(() => {
      setIsSwitching(false)
      switchTimeoutsRef.current = []
    }, 800)
    switchTimeoutsRef.current = [textTimeout, finishTimeout]
  }

  return (
    <LangContext.Provider value={{ lang, t: translations[lang], toggleLanguage }}>
      <SwitchContext.Provider value={{ isSwitching }}>
        {children}
      </SwitchContext.Provider>
    </LangContext.Provider>
  )
}

// useLanguage — reads translation + switching state (ScrambleText, TextSplit)
export function useLanguage() {
  const { lang, t, toggleLanguage } = useContext(LangContext)
  const { isSwitching } = useContext(SwitchContext)
  return { lang, t, toggleLanguage, isSwitching }
}

// useLang — reads only lang/t/toggle; never re-renders on isSwitching changes
export function useLang() {
  return useContext(LangContext)
}

// useSwitch — reads only isSwitching (for language toggle button UI)
export function useSwitch() {
  return useContext(SwitchContext)
}
