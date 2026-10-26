export type ProjectWriteup = {
  slug: string
  title: string
  summary: string
  tags: string[]
  image?: { src: string; alt: string; caption?: string }
  sections: {
    heading: string
    paragraphs: string[]
  }[]
}

// Edit this template, or copy the object to create another project page.
// Each slug becomes its URL: /projects/project-template
export const projects: ProjectWriteup[] = [
  {
    slug: 'implementing-a-pi-powered-kube-cluster-in-my-home',
    title: 'Implementing a Pi-Powered Kube Cluster in my Home',
    summary: 'Turning five Raspberry Pis into a home Kubernetes lab for this site, monitoring, and hands-on infrastructure practice.',
    tags: ['Kubernetes', 'Raspberry Pi', 'Home Lab', 'DevOps'],
    image: {
      src: '/post_images/rack.png',
      alt: 'Home lab rack for my Raspberry Pi Kubernetes cluster',
      caption: 'Current "rack" infrastructure (ignore the terrible cable management)',
    },
    sections: [
      {
        heading: 'the idea',
        paragraphs: [
          "I've had Raspberry Pis lying around for years, but finding a lasting use for them took a few attempts. My first was a Pi 3B for an intro to cybersecurity class in undergrad. We could choose from projects like a travel router or a Pi-hole ad blocker. I decided to build a cloud security camera.",
          "That went about as well as you might expect from a first project. I never got the cloud part working, and the camera only took photos about a quarter of the time. After that, the Pi spent a couple of years in a box before eventually finding work as a Pi-hole and then an Nginx server.",
          "For this project, I wanted to give the hardware a purpose while getting more comfortable with Kubernetes. A home cluster felt like a good fit: something I could keep running, add services to, and use to explore the infrastructure topics I'm interested in.",
        ],
      },
      {
        heading: 'infrastructure with a purpose',
        paragraphs: [
          "The five Raspberry Pis—two 3Bs and three 4Bs—give me a shared foundation for hosting websites and supporting services. This portfolio runs on the cluster alongside Prometheus and Grafana. That gives the infrastructure a practical purpose: keeping the things I publish accessible and giving me visibility into the systems behind them.",
          "Hosting websites makes availability a real design concern. Someone visiting a site shouldn't have to know that I'm updating an application or taking a Pi down for maintenance. High availability is a goal for this setup: I want services to remain reachable through routine changes and individual node failures, with recovery that doesn't depend on me being there to intervene.",
          "That goal shapes how I think about the infrastructure, from spreading workloads across nodes to keeping traffic flowing to healthy instances. It also means looking beyond the applications themselves at shared dependencies like networking, storage, and power. Having five boards gives me room to work on resilience, but I still need to test what happens when parts of the setup fail.",
          "Prometheus and Grafana support that work by providing the monitoring side of the cluster. I want to use that visibility to spot resource pressure, investigate interruptions, and check how services respond to changes. The outcome I'm working toward is infrastructure I can maintain and expand while keeping the websites and services people use available.",
        ],
      },
      {
        heading: 'why a home lab',
        paragraphs: [
          "My main reason for building this is practice. I'm interested in networking, infrastructure, and security, and this project gives me a place to bring those interests together. There are useful questions to work through at every layer, from how a service is deployed to how traffic reaches it and how I can tell when something needs attention.",
          "Having an ongoing project also gives me a reason to come back to those questions. As I add or change services, I can use the cluster to explore how the pieces fit together. The goal is to understand the setup well enough to maintain it and explain why it's configured the way it is.",
        ],
      },
      {
        heading: 'what’s next',
        paragraphs: [
          "From here, I want to make the setup easier to maintain and rebuild. That means documenting the configuration, keeping deployment changes organized, and working out how I would recover if a board or storage device failed. Those are areas I want to develop further as the lab grows.",
          "I also want to make better use of the monitoring tools already running and add services when I have a reason to use them. For now, five Pis and a few applications give me plenty to work with. I'll keep updating this page as the setup develops—and hopefully improve the cable management along the way.",
        ],
      },
    ],
  },
]
