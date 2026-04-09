import type Anthropic from '@anthropic-ai/sdk'

export const tools: Anthropic.Tool[] = [
  {
    name: 'get_products',
    description:
      'Returns the full list of FRPC products and services. Use this when the user asks about what products are available, their features, or current status.',
    input_schema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_contact_info',
    description:
      'Returns FRPC contact information including email, location, and social media links.',
    input_schema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'schedule_callback',
    description:
      'Registers a callback request from a potential client. Use this when the user explicitly wants to be contacted or schedule a meeting with the FRPC team.',
    input_schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Full name of the person requesting the callback',
        },
        email: {
          type: 'string',
          description: 'Email address to use for contact',
        },
        subject: {
          type: 'string',
          description: 'Topic or reason for the callback (e.g. "New project", "Pricing")',
        },
      },
      required: ['name', 'email', 'subject'],
    },
  },
]

export function handleToolCall(name: string, input: Record<string, unknown>): unknown {
  switch (name) {
    case 'get_products':
      return {
        products: [
          {
            name: 'Vacation Schedule / Calendário de Férias',
            category: 'SaaS · Team Management',
            year: 2026,
            description:
              'Vacation and absence management platform for teams. Simple, visual, and efficient.',
            url: '/produtos/calendario-de-ferias',
            status: 'Available',
          },
          {
            name: 'Project Manager',
            category: 'SaaS · Project Management',
            year: 2026,
            description:
              'Complete tool to manage projects, tasks, and teams with a modern and intuitive interface.',
            url: '/produtos/project-manager',
            status: 'Available',
          },
          {
            name: 'FRPC Portal / Portal FRPC',
            category: 'Web · Product Hub',
            year: 2026,
            description:
              'Central hub to access all FRPC products and services in one place.',
            status: 'Coming Soon',
          },
          {
            name: 'AI Call Bot / Bot de Chamadas com IA',
            category: 'SaaS · AI & Automation',
            year: 2026,
            description:
              'Intelligent bot that automatically makes and manages phone calls with natural voice and seamless system integration.',
            status: 'Coming Soon',
          },
        ],
        services: [
          {
            name: 'Web Development / Desenvolvimento Web',
            features: ['React / Next.js', 'TypeScript', 'REST APIs'],
          },
          {
            name: 'SaaS Products / Produtos SaaS',
            features: ['Multi-tenant', 'Subscriptions', 'Dashboards'],
          },
          {
            name: 'UI/UX Design',
            features: ['Prototyping', 'Design System', 'Usability Testing'],
          },
          {
            name: 'Technical Consulting / Consultoria Técnica',
            features: ['Architecture', 'Code Review', 'Mentoring'],
          },
        ],
      }

    case 'get_contact_info':
      return {
        email: 'hello@frpc.dev',
        location: 'Portugal',
        socials: {
          instagram: '@frpc.dev',
          linkedin: 'linkedin.com/company/frpc',
          github: 'github.com/frpc-dev',
          twitter: '@frpc_dev',
        },
      }

    case 'schedule_callback': {
      const { name, email, subject } = input as {
        name: string
        email: string
        subject: string
      }
      console.log(
        `[Callback scheduled] Name: ${name} | Email: ${email} | Subject: ${subject}`
      )
      return {
        success: true,
        message: `Callback request registered for ${name} (${email}) regarding "${subject}". Our team will be in touch shortly.`,
        reference: `CB-${Date.now().toString(36).toUpperCase()}`,
      }
    }

    default:
      return { error: `Unknown tool: ${name}` }
  }
}
