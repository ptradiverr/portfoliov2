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
    summary: 'How I brought Kubernetes to my home using Raspberry Pis, and what I am running',
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
          "I've always had some Raspberry Pis lying around, and never found a good use for them. Originally, I had one Pi 3B for an intro to cybersecurity class I was taking in undergrad, which involved doing a project with the Pi. There were many options provided to us, including making a travel router and the popular pi-hole adblocker. I went with a cloud security camera, which gave me more trouble than expected, with me never even getting the cloud part working, and in the end I just had a half working camera that would take photos 25% of the time. After this, my Pi sat in a box for a couple of years before I finally decided to try to find some usage. Originally it was a pi-hole, then nginx server, and now I've finally decided to improve my k8s skills by creating a cluster.",
        ],
      },
      {
        heading: 'what I built',
        paragraphs: [
          "My current cluster is powered 5 Raspberry Pis, two 3Bs and three 4Bs. Currently, it is maintaining this site, Grafana, and Prometheus.  ",
          "Add another paragraph here to go into more detail. You can add as many paragraphs as you need.",
        ],
      },
      {
        heading: 'what’s next',
        paragraphs: [
          'Share the results so far and any improvements or ideas you would like to explore next.',
        ],
      },
    ],
  },
]
