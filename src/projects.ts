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

  {
    slug: 'tcp-larp-speculative-pacing',
    title: 'TCP LARP: Fast Startup Through Speculative Pacing',
    summary: 'A deep dive into a custom Linux kernel TCP congestion controller that bypasses slow-start using mathematical pacing bounds and delay-driven relaxation.',
    tags: ['Networking', 'Linux Kernel', 'TCP/IP', 'C', 'Congestion Control'],
    image: {
      src: '/post_images/tcp_larp_architecture.jpg',
      alt: 'TCP LARP state machine from bounded launch to qualified growth',
      caption: 'The core control loop: moving from a speculative launch to a feedback-adaptive state.',
    },
    sections: [
      {
        heading: 'the problem with slow start',
        paragraphs: [
          "If you're downloading a large payload before your application can move to its next compute step, you are entirely at the mercy of TCP's initial caution. A new TCP connection has no idea what the path's capacity is, so it defaults to 'slow start'—probing the network and waiting for acknowledgments (ACKs) to scale up its transmission window.",
          "Mathematically, a fixed flight window $W$ with a maximum segment size $M$ caps your payload rate at $x \\le \\frac{W \\cdot M}{RTT}$. If you have an initial window of 10 segments on a 30 ms RTT link, you are artificially bottlenecking yourself regardless of the physical link's speed.",
          "I wanted to test a different hypothesis: what if we assume the network is incredibly fast by default, and only back off if we actually break something? This turned into a research project to build a bounded, speculative launch controller in the Linux kernel."
        ],
      },
      {
        heading: 'the math behind speculative launch',
        paragraphs: [
          "Instead of waiting for ACKs to authorize a higher rate, TCP LARP initializes with a massive speculative guess. We set the initial pacing target $R_0 = 125,000,000$ bytes/s (1 Gbps) and a hard flight bound of $W_{cap} = 512$ segments.",
          "During this launch phase, a flag $L$ (learned-feedback) is set to 0. We define a baseline minimum RTT interval as $G = \\max(\\hat{T}, 1 \\text{ ms})$. To ensure we have enough data in flight to actually sustain our pacing target without starving the pipe, the target window is calculated as:",
          "$$W^*(R) = \\min(W_{cap}, \\max(4, \\lceil \\frac{2RG}{M} \\rceil))$$",
          "That factor of 2 provides a rate-RTT flight budget. The connection blasts data based on these equations before receiving a single piece of delivery evidence. But to keep this from being a total network DDOS, $L$ flips to 1 the moment we receive our first valid, non-zero delivery sample. Once $L=1$, the hard 512-segment cap is released, and the socket's normal congestion-window clamp takes over, allowing us to grow past 1 Gbps if the path supports it."
        ],
      },
      {
        heading: 'adaptive rate relaxation',
        paragraphs: [
          "A speculative launch is useless if it can't adapt to reality. Once LARP starts getting ACKs, it relies on Linux's per-ACK `rate_sample` interface to monitor delay. We define a delay threshold $\\theta = \\max(500 \\mu s, \\hat{T}/8)$. If the current RTT exceeds the baseline by $\\theta$, we trigger a delay episode.",
          "Congestion feedback always takes priority over growth. If we hit a delay-only event, we relax the pacing rate $R$ using recent maximum delivery $\\hat{B}$ as a guide:",
          "$$R^+ = \\max(R_{min}, \\min(R, \\max(0.70R, 0.90\\hat{B})))$$",
          "If the network screams at us with Explicit Congestion Notification (ECN) or actual packet loss, we drop the rate much harder, immediately cutting to $0.70R$. This hysteresis means an unchanged standing queue won't trigger continuous rate reductions on every single ACK, but it prevents us from completely saturating a constrained bottleneck."
        ],
      },
      {
        heading: 'the lab setup and methodology',
        paragraphs: [
          "To prove LARP worked, we couldn't just rely on high-level network simulators; we needed to see how the actual OS networking stack behaved. We compiled our modified TCP controller into a real Linux kernel (v6.12) and ran it inside a diskless ARM64 QEMU virtual machine.",
          "Inside that VM, we used Linux network namespaces to build a completely isolated virtual topology. We spun up five distinct namespaces: two independent senders, a bottleneck router, a delay router, and a single receiver. To emulate real-world link conditions, we used a Token Bucket Filter (TBF) to strictly shape the forward bottleneck capacity, and `netem` to inject artificial round-trip times (RTT) across the link. We were also careful to route the returning ACKs around the forward rate shaper so our delivery measurements wouldn't be distorted.",
          "With the sandbox built, we pitted LARP against the native, unmodified kernel implementations of TCP CUBIC and BBR v1. We ran workloads across several distinct network profiles—ranging from a constrained 25 Mbps link with RED/ECN queues up to a massive 2 Gbps and 5 Gbps datacenter-style path.",
          "The testing wasn't just about solo speed. We measured finite object transfers (like 1 MiB or 128 MiB payloads) to see how fast an application could theoretically fetch data, but we also ran continuous, simultaneous flow tests. Pitting a newly launched LARP connection directly against an established CUBIC or BBR flow is what ultimately exposed the controller's aggressive sharing behavior, proving that while it is incredibly fast, it requires careful tuning to play nicely in a shared ecosystem[cite: 4, 5, 7]."
        ],
      },
      {
        heading: 'kernel hacking and reality checks',
        paragraphs: [
          "Writing this meant getting deep into the Linux kernel (`kernel/tcp_larp.c`), managing callbacks, pacing requests, and integrating with the sender `fq` queue. We spun up an isolated ARM64 QEMU environment with heavily controlled token-bucket filters to benchmark this against native CUBIC and BBR v1.",
          "The raw performance was exactly what we hoped for. On a 1 Gbps, 30 ms path, LARP finished a 128 MiB transfer in 1.288 seconds, beating both CUBIC (1.423s) and BBR v1 (1.441s). On a faster 2 Gbps path, our controller dynamically scaled past the 1 Gbps launch guess to deliver 1879.50 Mbps of payload.",
          "But there's a catch, which was a great lesson in network infrastructure: aggressive behavior has a cost. When we tested LARP against an incumbent CUBIC flow on a constrained 100 Mbps link, LARP commanded 93.58 Mbps and squeezed the CUBIC flow down to 2.44 Mbps. It completely bullied the shared link.",
          "Ultimately, the project proved that a carefully bounded speculative launch can massively accelerate completion times for data-heavy applications. However, taking it into production would require tightening the fairness mechanics so it doesn't push existing traffic off the road. It was an incredible way to bridge the gap between theoretical math and low-level OS engineering."
        ],
      },
    ],
  }
]


