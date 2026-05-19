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
  description: string
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
      heroLine: string
      heroAccent: string
      liveLabel: string
      title: string
      subtitle: string
      description: string
      globalLabel: string
      globalDesc: string
      stat1Label: string
      stat1Value: string
      stat1Sub: string
      stat2Label: string
      stat2Value: string
      stat2Sub: string
      pipelineLabel: string
      pipelineTitle: string
      pipelineDesc: string
      perfLabel: string
      perfTitle: string
      illustrativeLabel: string
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
      links: Array<{ label: string; href: string }>
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
      intro: 'AUTOMAÇÃO · IA · EFICIÊNCIA',
      main1: 'Automatizamos',
      main2: 'processos',
      main3: 'com IA',
      subtitle:
        'Criamos software à medida, automações internas e assistentes inteligentes para empresas que querem poupar tempo, reduzir erros e escalar operações.',
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
      copyright: '© {year} FRPC Tech. Todos os direitos reservados.',
      backToTop: 'Voltar ao topo',
      logo: 'FRPC',
    },
    marquee: {
      words: ['SOFTWARE', 'INOVAÇÃO', 'SAAS', 'WEB APP', 'DESIGN', 'TYPESCRIPT'],
    },
    sections: {
      features: {
        label: 'O QUE FAZEMOS',
        title1: 'Software',
        title2: 'Automação',
        title3: 'IA aplicada',
        cards: [
          { tag: '01 — SOFTWARE', title: 'Software à medida', body: 'Criamos plataformas, portais e sistemas internos adaptados à forma como a tua empresa trabalha — sem software genérico, sem complicação desnecessária.', stat: '', sub: 'ajustado ao teu processo' },
          { tag: '02 — AUTOMAÇÃO', title: 'Processos mais eficientes', body: 'Automatizamos tarefas repetitivas, emails, documentos, pastas, aprovações e fluxos internos para reduzir erros e libertar tempo à equipa.', stat: '', sub: 'menos tarefas manuais' },
          { tag: '03 — IA', title: 'Assistentes inteligentes', body: 'Desenvolvemos assistentes com IA que respondem com base nos dados internos da empresa — por chat, voz ou integração com as ferramentas existentes.', stat: '', sub: 'IA útil, aplicada ao negócio' },
        ],
      },
      insights: {
        heroLine: 'Menos trabalho',
        heroAccent: 'manual',
        liveLabel: 'Exemplo de dashboard',
        title: 'Impacto',
        subtitle: 'mensurável',
        description: 'Criamos soluções que tornam o trabalho mais simples, controlado e fácil de acompanhar — desde tarefas automatizadas até dashboards de gestão.',
        globalLabel: 'Eficiência · operação',
        globalDesc: 'Reduza tarefas repetitivas, emails manuais, documentos dispersos e processos internos pouco eficientes com soluções digitais feitas à medida.',
        stat1Label: 'Processos internos',
        stat1Value: 'Processos organizados',
        stat1Sub: 'Pedidos, aprovações, documentos e tarefas internas centralizados numa solução simples de acompanhar.',
        stat2Label: 'Análise inicial',
        stat2Value: 'Processo claro',
        stat2Sub: 'Antes de desenvolver, analisamos a operação da empresa e identificamos onde faz sentido automatizar, integrar ou aplicar IA.',
        pipelineLabel: '02 — Processo',
        pipelineTitle: 'Do processo à solução',
        pipelineDesc: 'Analisamos a forma como a empresa trabalha e criamos tecnologia ajustada à operação real — não software genérico. Cada solução nasce de um processo concreto, com o objetivo de o tornar mais simples, rápido e fácil de gerir.',
        perfLabel: '03 — Dashboard',
        perfTitle: 'Exemplo de eficiência operacional',
        illustrativeLabel: 'Exemplo ilustrativo',
        chips: ['↗ produtividade', '+ controlo', '↘ erros'],
        legendA: 'Manual',
        legendB: 'Automatizado',
        dayLabels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
        footerLinks: ['Suporte', 'Status', 'Docs'],
        footerCopy: 'Criado no FRPC Tech · 2026',
        statusActive: 'Estratégia',
        statusOutput: 'Gestão',
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
        productsLabel: 'Soluções em produção',
        productsCount: '2 ativos · 1 em breve',
        products: [
          { label: 'Calendário de Férias', description: 'Gestão simples de férias, ausências e aprovações.', status: 'Ativo' },
          { label: 'Gestão de Projetos', description: 'Acompanhamento de projetos, tarefas e equipas.', status: 'Ativo' },
          { label: 'Portal FRPC', description: 'Acesso centralizado a ferramentas, documentos e pedidos internos.', status: 'Em breve' },
        ],
        chips: ['Feito em Portugal', 'Cloud', 'Suporte prioritário', 'Microsoft 365', 'Pronto para equipas', 'Atualizações contínuas'],
        btnPrimary: 'Explorar produtos',
        btnSecondary: 'Ver planos',
        dialUptime: 'Ativos',
        dialLabel: 'Ecossistema FRPC',
      },
      cta: {
        label: 'PRONTO PARA COMEÇAR?',
        title1: 'Inicia o teu',
        title2: 'projeto',
        subtitle: 'Da ideia ao desenvolvimento, ajudamos a criar soluções digitais simples, úteis e prontas para a realidade da sua empresa.',
        btnPrimary: 'Pedir proposta',
        btnSecondary: 'Fala connosco',
        links: [],
        copyright: '© 2026 FRPC Tech',
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
      intro: 'AUTOMATION · AI · EFFICIENCY',
      main1: 'We automate',
      main2: 'processes',
      main3: 'with AI',
      subtitle:
        'We create custom software, internal automations and intelligent assistants for companies that want to save time, reduce errors and scale operations.',
      work: 'Contact',
      talk: 'Discover',
      scroll: 'Scroll to explore',
      rotatingBadge: '• DISCOVER • TRY • SUBSCRIBE • GROW ',
    },
    about: {
      label: '01 — About Us',
      title: 'We develop software',
      titleAccent: ' tailored to any need',
      p1:
        'At FRPC, we transform ideas into digital products. We combine design, modern technology and a focus on user experience to create applications that solve real problems.',
      p2:
        'Every product we launch comes from a concrete need. We build intuitive, scalable SaaS tools ready for the day-to-day of teams and companies that want to improve their workflow.',
      quote: 'Software that works for you',
      stats: [
        { value: '3+', label: 'Products Launched' },
        { value: '2026', label: 'Year Founded' },
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
        label: 'WHAT WE DO',
        title1: 'Software',
        title2: 'Automation',
        title3: 'Applied AI',
        cards: [
          { tag: '01 — SOFTWARE', title: 'Custom software', body: 'We create platforms, portals and internal systems tailored to how your company works — no generic software, no unnecessary complexity.', stat: '', sub: 'tailored to your process' },
          { tag: '02 — AUTOMATION', title: 'More efficient processes', body: 'We automate repetitive tasks, emails, documents, folders, approvals and internal workflows to reduce errors and free up team time.', stat: '', sub: 'fewer manual tasks' },
          { tag: '03 — AI', title: 'Intelligent assistants', body: 'We develop AI assistants that respond based on your company\'s internal data — via chat, voice or integration with existing tools.', stat: '', sub: 'Useful AI, applied to business' },
        ],
      },
      insights: {
        heroLine: 'Less manual',
        heroAccent: 'work',
        liveLabel: 'Dashboard example',
        title: 'Impact',
        subtitle: 'measurable',
        description: 'We create solutions that make work simpler, more controlled and easier to track — from automated tasks to management dashboards.',
        globalLabel: 'Efficiency · operation',
        globalDesc: 'Reduce repetitive tasks, manual emails, scattered documents and inefficient internal processes with custom digital solutions.',
        stat1Label: 'Internal processes',
        stat1Value: 'Organized processes',
        stat1Sub: 'Requests, approvals, documents and internal tasks centralized in a simple solution to track.',
        stat2Label: 'Initial analysis',
        stat2Value: 'Clear process',
        stat2Sub: 'Before developing, we analyze the company\'s operations and identify where it makes sense to automate, integrate or apply AI.',
        pipelineLabel: '02 — Process',
        pipelineTitle: 'From process to solution',
        pipelineDesc: 'We analyze how the company works and create technology tailored to real operations — not generic software. Each solution is born from a concrete process, with the goal of making it simpler, faster and easier to manage.',
        perfLabel: '03 — Dashboard',
        perfTitle: 'Operational efficiency example',
        illustrativeLabel: 'Illustrative example',
        chips: ['↗ productivity', '+ control', '↘ errors'],
        legendA: 'Manual',
        legendB: 'Automated',
        dayLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        footerLinks: ['Support', 'Status', 'Docs'],
        footerCopy: 'Created at FRPC Tech · 2026',
        statusActive: 'Strategy',
        statusOutput: 'Management',
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
        productsLabel: 'Solutions in production',
        productsCount: '2 active · 1 coming soon',
        products: [
          { label: 'Vacation Calendar', description: 'Simple management of holidays, absences and approvals.', status: 'Active' },
          { label: 'Project Manager', description: 'Project, task and team tracking.', status: 'Active' },
          { label: 'FRPC Portal', description: 'Centralized access to tools, documents and internal requests.', status: 'Coming soon' },
        ],
        chips: ['Made in Portugal', 'Cloud', 'Priority support', 'Microsoft 365', 'Team ready', 'Continuous updates'],
        btnPrimary: 'Explore products',
        btnSecondary: 'View plans',
        dialUptime: 'Active',
        dialLabel: 'FRPC Ecosystem',
      },
      cta: {
        label: 'READY TO GET STARTED?',
        title1: 'Start your',
        title2: 'project',
        subtitle: 'From idea to development, we help you create simple, useful digital solutions ready for your company\'s reality.',
        btnPrimary: 'Request a proposal',
        btnSecondary: 'Talk to us',
        links: [],
        copyright: '© 2026 FRPC Tech',
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
    const textTimeout = window.setTimeout(() => { setLang(nextLang) }, 140)
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
