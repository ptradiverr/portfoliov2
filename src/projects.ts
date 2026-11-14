export type ProjectImage = {
  src: string
  alt: string
  caption?: string
  previewFit?: 'cover' | 'contain'
}

export type ProjectWriteup = {
  slug: string
  title: string
  summary: string
  tags: string[]
  image?: ProjectImage
  sections: {
    heading: string
    paragraphs: string[]
    image?: ProjectImage
    links?: { href: string; label: string }[]
    interactive?: { src: string; title: string }
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
      src: '/post_images/rack-cover.jpg',
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
    summary: 'Building a Linux TCP controller that starts with a bounded high-rate guess, adapts from delivery feedback, and exposes the tradeoff between faster transfers and fair sharing.',
    tags: ['Networking', 'Linux Kernel', 'TCP/IP', 'C', 'Congestion Control'],
    image: {
      src: '/post_images/tcp_larp_architecture.jpg',
      alt: 'TCP LARP architecture showing speculative launch, feedback adaptation, and pacing control',
      previewFit: 'contain',
    },
    sections: [
      {
        "heading": "why startup is a separate problem",
        "paragraphs": [
          "TCP has to decide how much data to send before it knows what the path can carry. Conventional slow start begins with a small congestion window and grows it through ACKs. That caution protects an unknown bottleneck, but each feedback round takes time. For an application waiting on a finite object, time spent discovering capacity can be a substantial part of the download.",
          "Pacing and the congestion window constrain different things. The pacing rate $R$ controls departure spacing in bytes per second; the window $W$ limits outstanding segments. With payload size $M$ bytes per segment and round-trip time $T$ seconds, a useful approximate bound is:",
          "$$x \\leq \\min\\!\\left(R,\\frac{WM}{T}\\right)$$",
          "For example, $W=10$, $M=1448$ bytes, and $T=30$ ms give a window-limited rate of about $3.86$ Mbps. Keeping an idealized 1 Gbps path busy over that RTT takes a bandwidth-delay product of $125{,}000{,}000\\times0.030=3{,}750{,}000$ bytes, or roughly 2,590 segments. A high pacing request alone cannot fill that pipe when the sender lacks enough flight allowance.",
          "TCP LARP explores a bounded speculative start: request a high initial pace, limit initial exposure, and adapt when delivery and congestion feedback arrive. I implemented it as a Linux TCP congestion-control module so the experiment includes the real stack’s pacing, ACK processing, and loss recovery."
        ]
      },
      {
        "heading": "try the controller yourself",
        "paragraphs": [
          "The interactive notebook lets you follow packets through the bottleneck, step through ACKs, and inspect the equations behind each rate and window decision. Start with Next ACK twice, then open Equations to compare the saved calculations. Life of a packet provides a guided walkthrough with the corresponding C source.",
          "Try Discover a faster path, Overload a slower path, or Lose one segment to see how different feedback changes the controller’s behavior. On a small screen, open the notebook in its own tab for more room.",
          "This is a teaching model of the same adaptive LARP policy. Its network, ACK behavior, and competing flows are simplified; the benchmark results later in this writeup come from the Linux testbed."
        ],
        "interactive": {
          "src": "/interactive/tcp-larp/index.html",
          "title": "TCP LARP interactive notebook"
        }
      },
      {
        "heading": "a fast guess with a bounded first flight",
        "paragraphs": [
          "The initial guess is $R_0=125{,}000{,}000$ bytes/s, equivalent to 1 Gbps. The controller receives no bottleneck-capacity input. Its initial flight allowance is at most 512 segments, and the learned-feedback flag starts at $L=0$. Let $\\hat{T}$ be the minimum observed RTT and $G=\\max(\\hat{T},1\\text{ ms})$. In the following equations, $G$ is expressed in seconds and $M$ in bytes.",
          "$$W_{\\mathrm{target}}=\\min\\!\\left(W_{\\mathrm{cap}},\\max\\!\\left(4,\\left\\lceil\\frac{2RG}{M}\\right\\rceil\\right)\\right)$$",
          "The factor of two supplies a rate–RTT flight budget. Before qualifying feedback, the cap is 512 segments; after learning, the adaptive controller uses the socket’s congestion-window clamp. At initialization the window can jump to its target. Subsequent ACKs control how quickly it grows toward a larger target.",
          "The launch bound matters: at a 1448-byte MSS, 512 segments hold 741,376 bytes. If that cap persisted on a 30 ms path, its approximate payload ceiling would be $512\\times1448\\times8/0.030\\approx197.7$ Mbps. Releasing the flight limit and extending the pacing ceiling solve two separate constraints.",
          "This is bounded exposure to an unverified guess. The first-flight allowance does not establish capacity, prevent a shallow queue from overflowing, or establish a fair share of a shared link."
        ]
      },
      {
        "heading": "which feedback earns permission to grow",
        "paragraphs": [
          "Linux supplies delivery information through rate_sample in the congestion-control callback. The adapter admits a sample only if it covers at least four delivered segments and its positive measurement interval is at least the larger of one eighth of the current minimum RTT and one microsecond. This filters very short samples rather than treating every ACK spacing as a bandwidth measurement.",
          "$$B_{\\mathrm{sample}}=\\frac{N_{\\mathrm{delivered}}M}{\\Delta t}$$",
          "A nonzero admitted sample with a valid RTT sets the learned flag only when it is neither application limited nor in loss recovery. That flag grants permission to adapt the flight budget; a single sample cannot certify physical capacity or available fair share. Application limitation means the sender may have had too little data to reveal the path’s potential.",
          "The delivery estimate $\\hat{B}$ is the maximum across two buckets, each spanning $2G$. Outside recovery, old peaks expire within roughly $4G$. During recovery the filter’s clock is held so repair-limited delivery does not age away previously demonstrated capacity. A low estimate alone never triggers a rate cut: LARP requires queue growth, ECN, or loss."
        ]
      },
      {
        "heading": "relaxation, hysteresis, and timed probes",
        "paragraphs": [
          "Queue delay is estimated from RTT inflation above the minimum. The high-delay threshold is $\\theta=\\max(500\\,\\mu\\text{s},\\hat{T}/8)$. A delay episode begins when RTT exceeds $\\hat{T}+\\theta$. Once an episode has been recorded, another delay cut requires a further rise of more than $\\theta$; draining to $\\hat{T}+\\theta/2$ rearms the episode detector.",
          "For a delay-only event, the rate update uses recent delivery as a floor for the proposed reduction. With $R_{\\min}=125{,}000$ bytes/s (1 Mbps), the rule is:",
          "$$R^+=\\max\\!\\left(R_{\\min},\\min\\!\\left(R,\\max(0.70R,0.90\\hat{B})\\right)\\right)$$",
          "ECN or loss instead requests $R^+=\\max(R_{\\min},0.70R)$, without preserving the delivery-based floor. A recent high delivery rate may reflect a monopolized bottleneck, so it should not cancel explicit congestion feedback. The first reduction is immediate; subsequent reductions are separated by at least $G$. Congestion events take priority over probing.",
          "Otherwise, an eligible timed probe occurs at most once per $G$, outside loss recovery and without application limitation. With low queue delay its candidate is $P=\\max(1.25R,1.02\\hat{B})$. With elevated delay it is $P=1.05R$. For the adaptive controller, a current admitted, nonzero sample and low delay permit a moving ceiling:",
          "$$C=\\begin{cases}\\max(R_0,R,1.25\\hat{B}),&\\text{learned, current sample, low delay}\\\\\\max(R_0,R),&\\text{otherwise}\\end{cases}\\qquad R^+=\\min(C,P)$$",
          "This removes the permanent 1 Gbps ceiling while tying extensions to delivery evidence. The slower 5% probe allows growth under a standing queue, but it is also a reason to test coexistence carefully: stable elevated delay does not shut probing off."
        ],
        "image": {
          "src": "/post_images/tcp_larp_control.svg",
          "alt": "Three controller modes: bounded launch, congestion-driven relaxation, and timed probing, with all decisions feeding pacing and ACK-controlled window updates.",
          "caption": "A schematic of the implemented control loop. Every feedback update checks congestion before considering growth."
        }
      },
      {
        "heading": "making the kernel obey the model",
        "paragraphs": [
          "The implementation separates the transport adapter in kernel/tcp_larp.c from the decision rules in kernel/larp_core.h. The shared core can be exercised by native unit tests, while the adapter translates rate samples, ECN flags, recovery state, and socket limits into model inputs. Saturating integer arithmetic keeps rate and flight calculations from wrapping as learned rates increase.",
          "The requested pacing rate is clamped by the socket’s maximum pacing rate and enforced through the sender’s fq queue. The target window is also clamped by the kernel. Outside recovery, the simplified ACK update is:",
          "$$W^+=\\max\\!\\left(1,\\min(W_{\\mathrm{target}},W+N_{\\mathrm{acked}})\\right)$$",
          "A larger learned target therefore does not immediately authorize a second arbitrary window jump. Loss recovery requires explicit packet conservation in a cong_control implementation: the first recovery RTT replaces acknowledged packets, later recovery can grow the repair window, ECN respects the reduced slow-start threshold, and timeout recovery grows back from the kernel’s reset window. The advertised receiver window and socket resource limits still constrain transmission.",
          "The module also registers larp_fixed, larp_flight, and larp_rate alongside adaptive larp. They retain both initial limits, release only the flight limit, or extend only the rate ceiling. Sharing one binary and the same feedback and recovery code makes these useful controls for separating the effects of the two policy changes."
        ]
      },
      {
        "heading": "a controlled lab around real TCP",
        "paragraphs": [
          "The matched adaptive experiments run in a diskless ARM64 QEMU guest using Linux 6.12.115-0-virt, two vCPUs, and 4 GiB RAM. All shaping and module work happens inside the guest. Five network namespaces form two senders, a bottleneck router, a delay router, and a receiver, connected by virtual Ethernet pairs.",
          "Sender queues use fq and veth offloads are disabled. A Token Bucket Filter with a 16 KiB burst shapes the router’s forward egress, with FIFO or RED/ECN below it. Netem adds half the configured RTT in each direction. Returning ACKs traverse the reverse path without entering the forward TBF shaper.",
          "The key path labels are H: 1 Gbps / 30 ms; X: 2 Gbps / 5 ms; Z: 5 Gbps / 5 ms; M: 100 Mbps / 30 ms; and S: 25 Mbps / 90 ms. H, X, Z, and M use one-BDP FIFO buffers; S uses a quarter-BDP RED/ECN buffer. The earlier adaptive cohort also includes F at 1 Gbps / 5 ms. Z belongs to the later head-to-head cohort.",
          "Capacity, RTT, and absolute buffer bytes are coupled in these profiles. They are controlled path conditions, rather than independent sweeps of every variable. A 5 Gbps shaper setting also does not guarantee 5 Gbps of application payload in a two-vCPU guest."
        ],
        "image": {
          "src": "/post_images/tcp_larp_topology.svg",
          "alt": "Two paced sender namespaces feed a forward TBF bottleneck, then a delay router and receiver; ACKs return without the forward shaper.",
          "caption": "Five namespaces inside one disposable guest. Both competing senders share the same forward bottleneck; delay is applied in both directions."
        }
      },
      {
        "heading": "what the measurements actually capture",
        "paragraphs": [
          "Finite-object completion starts at connect and ends at the receiver’s last payload read. Successful transfers verify exact byte count and SHA-256. That measures an application-visible cost including connection setup, rather than reporting only the sender’s requested pace. Continuous goodput instead counts payload received during a common observation window.",
          "The earlier adaptive suite has 192 main observations across six methods, including the limit-policy controls. The official LARP/CUBIC/BBR v1 report selects 108 of those main observations, with three repetitions per cell and nine calibration checks. Its continuous tests use a two-second warmup and six-second receiver window. BBR here means the guest kernel’s BBR v1.",
          "The separate November 5 head-to-head cohort has 300 observations and compares unchanged adaptive LARP, native CUBIC, and an experimental JumpStart-style launch followed by native CUBIC. The integration switches to CUBIC on the first ACK and records a successful kernel handoff. It is not the JumpStart authors’ implementation, and the receiver-advertisement-limited launch does not create a matched-initial-window comparison.",
          "In that later cohort, continuous pairs use a common ten-second receiver window after warmup, and staggered pairs test both incumbent orders with a two-second head start. TCP_INFO is sampled every 50 ms for finite transfers and 20 ms for continuous tests. Completed-file times, sustained sharing, and whole-trial queue counters answer different questions and remain separate. Deadlines and failed transfers are never substituted for successful completion times."
        ]
      },
      {
        "heading": "where speculative startup pays off",
        "paragraphs": [
          "In the official adaptive cohort, a 128 MiB transfer on H completes in 1.288 s with LARP, 1.423 s with CUBIC, and 1.441 s with BBR v1. That is about a 9.5% completion-time reduction relative to CUBIC. For a 1 MiB object on the same path, LARP takes 154.68 ms versus CUBIC’s 271.82 ms, a reduction of about 43.1%. The startup advantage matters more when the object ends before a long flow settles.",
          "On X, LARP sustains 1879.50 Mbps of received payload, demonstrating growth beyond its initial 1 Gbps pacing guess. Native CUBIC and BBR v1 deliver about 1912 Mbps there, while 128 MiB completion is nearly tied at 0.604, 0.606, and 0.608 s respectively. Extending beyond the launch guess establishes that the ceiling can move; it does not imply better sustained utilization than the references.",
          "The chart below comes from the separate head-to-head cohort. On H, its LARP means are 0.154 s for 1 MiB, 0.309 s for 16 MiB, and 1.291 s for 128 MiB, compared with native CUBIC’s 0.272, 0.443, and 1.425 s. These are separate repetitions from the earlier official cohort, so their means are not pooled.",
          "Faster paths and larger files expose the limits. At Z’s configured 5 Gbps, native CUBIC completes 512 MiB in 0.952 s versus LARP’s 1.296 s, and sustains 4769.54 Mbps versus 3395.00 Mbps. On shallow-queue S, even the 1 MiB case favors CUBIC: 0.895 s versus LARP’s 1.956 s in the later cohort. An aggressive start can create a recovery cost that outweighs the time saved probing."
        ],
        "image": {
          "src": "/post_images/tcp_larp_completion.png",
          "alt": "Log-scale completion chart for 1, 16, and 128 MiB objects on H and up to 512 MiB on X, comparing LARP, JumpStart to CUBIC, and native CUBIC.",
          "caption": "Archived head-to-head results: mean completion time from three repetitions per cell; both axes are logarithmic. Lower is better. The experimental JumpStart/CUBIC integration has a different launch budget."
        }
      },
      {
        "heading": "fast completion has a sharing cost",
        "paragraphs": [
          "The official cohort’s 100 Mbps path makes the fairness problem clear: LARP receives 93.58 Mbps while a continuing native CUBIC flow receives 2.44 Mbps. At 25 Mbps with RED/ECN, the corresponding rates are 18.38 and 0.33 Mbps. A fast newcomer’s result can therefore come at a substantial cost to traffic already using the path.",
          "For the later pair tests, the report computes Jain’s index from each trial’s received rates $x_i$:",
          "$$J=\\frac{\\left(\\sum_{i=1}^{n}x_i\\right)^2}{n\\sum_{i=1}^{n}x_i^2}$$",
          "For two flows, equal rates give an index of 1; near-total domination approaches 0.5. This measures equality over the observation window, not total utilization or convergence to a fair equilibrium. The reported mean is the mean of per-trial indices, rather than an index calculated from pooled mean rates.",
          "In the head-to-head cohort’s simultaneous 100 Mbps mixed pair, LARP receives 93.19 Mbps and JumpStart/CUBIC receives 2.35 Mbps, with mean Jain index 0.525. Two LARP flows are much more balanced on H and X, but shallow-queue S has a mean index of only 0.503. The two sender roles can trade dominance between trials, so averaged bars can hide severe inequality within individual runs.",
          "The plot divides each mean goodput by the configured path capacity. H, X, Z, M, and S are the path profiles defined above. A high bar for LARP in a mixed pair is a sharing outcome to investigate, not an independent performance win."
        ],
        "image": {
          "src": "/post_images/tcp_larp_sharing.png",
          "alt": "Two panels show mean received goodput as a percentage of configured capacity for LARP self competition and LARP versus JumpStart to CUBIC across H, X, Z, M, and S.",
          "caption": "Archived head-to-head sharing chart. Bars average three trials and normalize to configured capacity. On S, mean self-competition bars hide individual trials with near-total domination."
        }
      },
      {
        "heading": "what this project established",
        "paragraphs": [
          "The useful result is a working kernel prototype that separates a speculative initial guess from feedback-qualified growth, while preserving ACK-driven window growth and TCP recovery constraints. The lab shows both the startup benefit and the failure modes: lower completion times in several finite workloads, uneven coexistence, shallow-queue regressions, and weaker sustained utilization at the 5 Gbps stress setting.",
          "The evidence comes from one virtual environment with three repetitions per cell. Those repetitions give descriptive means and observed ranges, not statistical significance, tail percentiles, physical-link guarantees, or Internet-wide conclusions. Cold neighbor state can inflate handshake RTT; minimum RTT does not expire; route changes and many-flow incast remain untested. Sampled TCP_INFO maxima can also miss brief excursions.",
          "The next engineering questions are how to age the RTT baseline, tighten feedback freshness, moderate probing under standing queues, and improve coexistence without losing the finite-transfer benefit. Those are follow-up work, not changes already evaluated in these reports. Building the controller made the tradeoff concrete: startup speed, recovery behavior, utilization, and fairness all need to be measured together.",
          "This writeup follows the controller sources and the two dated result cohorts in the supplied lab archive. The paper documents the earlier official adaptive results; the later report contains the separate 300-observation JumpStart/CUBIC comparison and per-cell ranges."
        ],
        "links": [
          {
            "href": "/post_documents/tcp_larp_paper.pdf",
            "label": "Read the TCP LARP paper (PDF)"
          },
          {
            "href": "/post_documents/tcp_larp_official_results.md",
            "label": "Official adaptive results — November 4 cohort"
          },
          {
            "href": "/post_documents/tcp_larp_head_to_head.md",
            "label": "Head-to-head results and observed ranges — November 5 cohort"
          }
        ]
      }
    ],
  },
  {
    "slug": "wifi7-multi-link-operation-thesis",
    "title": "Wi-Fi 7 MLO: Measuring What Multiple Links Actually Deliver",
    "summary": "My Purdue thesis: testing Wi-Fi 7 Multi-Link Operation across 285 lab runs to understand its throughput gains, client scaling, and response to distance.",
    "tags": [
      "Wi-Fi 7",
      "802.11be",
      "Wireless Networking",
      "MLO",
      "Research"
    ],
    "image": {
      "src": "/post_images/wifi7_mlo_testbed.png",
      "previewFit": "contain",
      "alt": "Thesis network topology with a wired iPerf3 endpoint, a 2.5G PoE switch, a UniFi U7 Pro access point, a monitoring machine, and eight wireless clients.",
      "caption": "Thesis Figure 2: the physical testbed. TCP payload travels from the wired endpoint through the AP to the wireless clients."
    },
    "sections": [
      {
        "heading": "the question behind the upgrade",
        "paragraphs": [
          "Wi-Fi upgrades are easy to describe in terms of the next standard and its headline speed. The harder question is what changes when several people are actually using the network. For my thesis at Purdue, I wanted to put one of Wi-Fi 7’s main features, Multi-Link Operation, into a physical lab and measure where its throughput advantage appeared.",
          "The setting was a university computer laboratory, with real access-point hardware, laptops, desks, and the RF conditions that come with an indoor space. I compared MLO against 5 GHz and 6 GHz single-link Wi-Fi 7 while changing how many clients were active and how far they were from the access point. Both baselines were Wi-Fi 7 configurations, so this was a study of the operating mode within the same generation.",
          "The result depended heavily on the workload. MLO delivered more aggregate throughput in every tested multi-client condition, but a single client never exceeded the 6 GHz single-link result. That distinction became the central finding: additional network capacity under concurrent demand does not automatically mean a faster connection for one device."
        ]
      },
      {
        "heading": "what multiple links actually change",
        "paragraphs": [
          "Multi-Link Operation lets a compatible access point and client coordinate multiple affiliated wireless links within one logical association. In this study, those links were in the 5 GHz and 6 GHz bands. The practical opportunity is to make use of more than one set of wireless resources as traffic and link conditions change.",
          "That still leaves a lot to the implementation. The presence of two affiliated links does not prove that one client is transmitting or receiving simultaneously on both, that traffic is split evenly, or that application throughput will equal the sum of two standalone links. Radio capabilities, firmware, drivers, and scheduling all affect what happens over the air.",
          "I kept each tested channel at 80 MHz and excluded 2.4 GHz. This avoided giving one single-link baseline a wider channel than the other, while letting the MLO configuration access the two 80 MHz links. OFDMA remained enabled across conditions; the experiments did not isolate its contribution. The measurements describe the throughput of this complete configuration rather than the efficiency of an internal scheduler."
        ]
      },
      {
        "heading": "building the physical testbed",
        "paragraphs": [
          "The experiment used a UniFi U7 Pro connected through a UniFi Flex 2.5G PoE switch to a wired Windows 11 iPerf3 endpoint. The AP’s 2.5 Gbps Ethernet connection was chosen to reduce the chance that a gigabit uplink would cap the wireless aggregate before the feature under test could show a difference.",
          "Up to eight Dell Latitude 3400 laptops acted as wireless clients. Each used an Intel BE200 adapter and Windows 11, keeping the client hardware platform consistent across conditions. The documented software setup used AP firmware 8.7.11, UniFi network application 10.6.106, and iPerf3 3.21. These are the versions used for this experiment.",
          "The AP was mounted six feet above the floor with its top facing downward, and client laptops sat approximately 2.5 feet above the floor. Distance markers referenced the AP’s floor position, so the reported distances are horizontal distances. Tests ran in Dudley Hall’s room 5431 during periods when the building was largely unoccupied to reduce outside wireless activity.",
          "Separate SSIDs selected 5 GHz single-link, 6 GHz single-link, or MLO. The channels were fixed to the documented 5 GHz channel 40 and 6 GHz channel 5 configurations, both at 80 MHz, with WPA3 on the test network. Static IP addresses kept endpoint addressing consistent between scenarios."
        ],
        "image": {
          "src": "/post_images/wifi7_mlo_layout.png",
          "alt": "Experiment Set 1 placement diagram showing the central AP and client positions at 5, 10, 20, and 30 horizontal feet, with markers for the different client-count configurations.",
          "caption": "Thesis Figure 1: the placement plan for Experiment Set 1. The drawing is a layout guide and is not to scale."
        }
      },
      {
        "heading": "confirming the feature was active",
        "paragraphs": [
          "An MLO-enabled setting in the management interface was not enough to begin a run. Before throughput testing, I captured association traffic and inspected the management frames for Multi-Link Elements, then checked the intended affiliated links in the UniFi interface. If negotiation could not be confirmed, the wireless adapter was disabled and re-enabled and the association checked again.",
          "A separate Ubuntu 22.04 machine with an Intel BE200 adapter and Wireshark 4.6.7 captured frames near the AP. Captures and throughput logs were saved under matching scenario identifiers, making it possible to connect a measurement with the setup that produced it. Scenarios with anomalies identified during validation were rerun before moving on.",
          "This step established that the clients had negotiated the intended MLO association. It did not establish how many payload bytes crossed each band during the test. I did not collect the per-link airtime and traffic-allocation evidence needed to explain exactly how the implementation used its affiliated links."
        ]
      },
      {
        "heading": "285 runs, two different experiments",
        "paragraphs": [
          "Experiment Set 1 combined three operating modes, four client counts, and four distances: 1, 2, 4, or 8 active clients at 5, 10, 20, or 30 feet. Five repetitions of each of the 48 conditions produced 240 aggregate runs. Those measurements answered both the MLO-versus-single-link question and the question of how MLO scaled with additional clients.",
          "Experiment Set 2 used one client at 5, 15, and 30 feet, again across all three operating modes with five repetitions. Its nine conditions produced another 45 runs. Distance was the controlled variable; I did not add artificial interference, obstructions, or independently controlled attenuation to one band.",
          "Each client ran a 60-second reverse-mode iPerf3 test with four parallel TCP streams. Reverse mode sent the payload from the wired endpoint toward the wireless laptops. Multiple client processes connected to assigned server ports, and PowerShell scripts used synchronized clocks and a common scheduled start time to make their measurement intervals overlap as closely as possible.",
          "A one-minute rest separated runs. Each client wrote a scenario-, client-, and trial-specific log, and server processes and wireless associations were reset between scenarios. With eight clients active, the workload contained 32 TCP streams, but the statistical observation was still the aggregate result of one run. Parallel streams were traffic-generation settings, not additional independent trials."
        ]
      },
      {
        "heading": "turning throughput logs into comparisons",
        "paragraphs": [
          "For a run with $n$ active clients, I summed the receiver throughput $x_{i,r}$ of each client $i$ to obtain aggregate throughput $A_r$. The condition mean came from the five run-level aggregates:",
          "$$A_r=\\sum_{i=1}^{n}x_{i,r},\\qquad \\bar{A}=\\frac{1}{5}\\sum_{r=1}^{5}A_r$$",
          "This separates three quantities that can otherwise be easy to confuse: the AP’s combined received payload rate across clients, the throughput available to each individual client, and the advertised radio link rate. The thesis evaluates TCP receiver throughput, and its multi-client aggregate is not a speed that every client receives.",
          "For the matched MLO-versus-single-link comparison, I expressed the difference relative to the single-link mean $\\bar{A}_{\\mathrm{SL}}$:",
          "$$\\Delta_{\\mathrm{MLO,SL}}=100\\,\\frac{\\bar{A}_{\\mathrm{MLO}}-\\bar{A}_{\\mathrm{SL}}}{\\bar{A}_{\\mathrm{SL}}}\\%$$",
          "The analysis also used standard deviations and Student’s t confidence intervals based on five run-level measurements per condition. With sample standard deviation $s$, the 95% interval is $\\bar{A}\\pm t_{0.975,4}s/\\sqrt{5}$. Those intervals describe the repeated measurements under the tested conditions; they do not cover variation across other hardware or buildings."
        ]
      },
      {
        "heading": "where MLO delivered more capacity",
        "paragraphs": [
          "The clearest example came at 30 feet with four active clients. Mean aggregate throughput was 1613.70 Mbps for MLO, 831.98 Mbps for 5 GHz, and 892.53 Mbps for 6 GHz. Relative to the corresponding single-link configurations, that is approximately 94.0% and 80.8% more received payload throughput.",
          "That pattern held across all tested combinations with two, four, or eight clients: MLO’s aggregate mean exceeded both single-link means at the same client count and distance. This is the comparison that establishes the observed benefit of enabling MLO in the testbed. Merely adding another client and seeing a larger aggregate would not establish the same thing.",
          "The one-client result was different. At 30 feet, MLO reached 946.50 Mbps and 6 GHz reached 947.19 Mbps, effectively the same mean throughput. At 20 feet, MLO fell to 716.62 Mbps while 6 GHz reached 921.64 Mbps, putting MLO about 22.2% below that baseline. MLO exceeded 5 GHz in these conditions, but did not exceed 6 GHz at any of the four single-client distances.",
          "The three-way ANOVA reported a mode-by-client-count-by-distance interaction of F(18, 192) = 32.79, with p < 0.001. The effect of operating mode depended jointly on the workload and placement. That supports a conditional explanation of the results rather than assigning one universal percentage gain to MLO."
        ],
        "image": {
          "src": "/post_images/wifi7_mlo_comparison.png",
          "alt": "Four panels compare aggregate TCP throughput for 5 GHz, 6 GHz, and MLO at 5 to 30 feet with one, two, four, and eight clients. MLO is higher in the multi-client panels but not above 6 GHz in the single-client panel.",
          "caption": "Thesis Figure 4: aggregate receiver throughput by client count and distance. Each condition contains five 60-second trials; the analysis uses run-level means and 95% t confidence intervals."
        }
      },
      {
        "heading": "more clients did not mean unlimited scaling",
        "paragraphs": [
          "Averaging MLO results across the four distances gives approximately 882 Mbps with one client, 1650 Mbps with two, 1653 Mbps with four, and 1594 Mbps with eight. The largest jump was from one to two clients, about 87%. Four clients barely changed the aggregate, and eight reduced it slightly.",
          "The system had reached a practical throughput plateau under these workloads. Additional clients shared the available aggregate rather than increasing it in proportion to their count. The measurements do not identify one component as the cause of that plateau; wireless airtime, AP processing, client behavior, and other implementation constraints remain possible contributors.",
          "An aggregate of about 1594 Mbps divided among eight clients corresponds to an average of roughly 199 Mbps per client, while about 1650 Mbps divided among two corresponds to roughly 825 Mbps. Those calculations describe equal-share averages for interpreting the total; actual client rates need to be inspected separately.",
          "Placement mattered too. With two clients, MLO reached 1783.00 Mbps at 20 feet but fell to 1349.33 Mbps at 30 feet. That was a different distance response from the four-client case. The MLO-only ANOVA reported a client-count-by-distance interaction of F(9, 64) = 50.55, with p < 0.001, consistent with the different shapes of the curves."
        ],
        "image": {
          "src": "/post_images/wifi7_mlo_scaling.png",
          "alt": "MLO aggregate throughput curves show a large increase from one to two clients followed by a plateau or decline at four and eight clients across four distances.",
          "caption": "Thesis Figure 6: MLO scaling across active client count. Each curve holds distance fixed; a larger client count does not produce proportional growth in aggregate throughput."
        }
      },
      {
        "heading": "checking who received the extra throughput",
        "paragraphs": [
          "An aggregate result can conceal a very different experience for individual clients. I looked at the four-client condition at 20 feet to check whether one unusually fast station accounted for the improvement. All four clients had higher mean throughput under MLO than under either single-link mode.",
          "The MLO per-client means were 416.76, 390.68, 427.35, and 370.63 Mbps. The corresponding 5 GHz means ranged from 203.54 to 229.13 Mbps, and the 6 GHz means ranged from 229.27 to 254.47 Mbps. The aggregate improvement in this example therefore reached each active client.",
          "That result is useful, but it has a specific scope. It does not establish equal sharing in every condition, long-term fairness, or the experience of clients with different adapters and radio capabilities. It shows why keeping the individual-client logs matters even when aggregate capacity is the primary research metric."
        ],
        "image": {
          "src": "/post_images/wifi7_mlo_per_client.png",
          "alt": "Grouped bars compare each of four clients at 20 feet. Each client has a higher mean throughput with MLO than with either 5 GHz or 6 GHz single-link operation.",
          "caption": "Thesis Figure 8: per-client means for the four-client, 20-foot condition. Higher aggregate throughput was distributed across all four clients in this example."
        }
      },
      {
        "heading": "distance changed the result across bands",
        "paragraphs": [
          "The second experiment removed multi-client contention and followed one client through a separate 5-, 15-, and 30-foot placement arrangement. At five feet, mean throughput was 615.8 Mbps on 5 GHz, 954.2 Mbps on 6 GHz, and 911.6 Mbps with MLO. At 30 feet, the corresponding values were 621.8, 854.8, and 834.4 Mbps.",
          "The 5 GHz condition remained relatively stable while 6 GHz and MLO declined. At the intermediate 15-foot placement, MLO measured 877.8 Mbps versus 943.2 Mbps on 6 GHz, continuing the pattern of no single-client throughput advantage over that baseline.",
          "These are the results of Experiment Set 2, which used its own placement arrangement and repetitions. They should be read within that experiment rather than averaged together with single-client values from Set 1. In both sets, comparisons between operating modes use the matched conditions from the same experiment.",
          "This part of the thesis began with a question about link asymmetry. What the measurements establish directly is a difference in throughput response to distance. Without per-link RSSI, SNR, modulation, airtime, and payload-distribution measurements, they do not quantify how asymmetric the two affiliated links became or show which one carried the MLO traffic."
        ],
        "image": {
          "src": "/post_images/wifi7_mlo_distance.png",
          "alt": "Experiment Set 2 throughput across 5, 15, and 30 feet: 5 GHz remains near 620 Mbps, while 6 GHz declines from 954.2 to 854.8 Mbps and MLO declines from 911.6 to 834.4 Mbps.",
          "caption": "Thesis Figure 9: absolute receiver throughput in the separate single-client distance experiment. These trials are kept distinct from Experiment Set 1."
        }
      },
      {
        "heading": "a smaller decline was not a higher final speed",
        "paragraphs": [
          "To compare how each mode changed from its own starting point, I normalized its mean throughput at distance $d$ to its five-foot baseline:",
          "$$Q_m(d)=100\\,\\frac{\\bar{x}_m(d)}{\\bar{x}_m(5\\text{ ft})}\\%$$",
          "From five to 30 feet, 5 GHz increased by about 1.0%, 6 GHz declined by 10.4%, and MLO declined by 8.5%. MLO retained a slightly larger fraction of its starting throughput than 6 GHz, but its absolute throughput at 30 feet was still lower: 834.4 versus 854.8 Mbps.",
          "That distinction matters when reading a normalized graph. Retaining more of a lower baseline does not imply that an application receives more data per second at the final location. The absolute and normalized plots answer complementary questions, and neither should replace the other.",
          "The mode-by-distance interaction in this experiment was F(4, 36) = 10.34, with p < 0.001. The statistical result supports different distance responses among the configurations. It does not identify the radio scheduling behavior that produced those responses, or establish that each plotted pairwise difference is individually significant."
        ],
        "image": {
          "src": "/post_images/wifi7_mlo_normalized.png",
          "alt": "Throughput normalized to each operating mode’s five-foot baseline shows approximately 101% for 5 GHz, 89.6% for 6 GHz, and 91.5% for MLO at 30 feet.",
          "caption": "Thesis Figure 10: each operating mode is normalized to its own five-foot mean. The vertical axis is narrowed to emphasize relative change, so read it alongside the absolute throughput figure."
        }
      },
      {
        "heading": "what I took from the study",
        "paragraphs": [
          "The strongest finding was about concurrent demand. In this physical lab, MLO provided additional aggregate capacity when several clients were active, and the difference could be substantial. The same hardware did not give a single active client greater throughput than its 6 GHz connection. Workload and placement were essential parts of the result.",
          "The study also reinforced how much of a networking experiment happens around the speed test: keeping channel widths consistent, verifying the negotiated feature, coordinating concurrent traffic, preserving individual-client measurements, and defining the observation used in the statistical analysis. Each decision affected what the final numbers could support.",
          "There are clear limits to the evidence. This was one laboratory, one AP model, one client-adapter platform, at most eight clients, and five repetitions per condition. The room was largely unoccupied during testing, so the results do not reproduce a busy classroom’s background traffic. I measured downlink TCP throughput, leaving uplink behavior, latency, jitter, loss, mobility, and real-time application performance for future work.",
          "The next useful step would be to pair these receiver measurements with per-link RF and scheduling observations, then repeat the experiment across more client counts and different AP and adapter combinations. That would help explain whether the plateau and single-client behavior come from this implementation or persist across other systems.",
          "This article follows my thesis revision, An Empirical Evaluation of 802.11be Multi-Link Operation Performance in a Controlled Educational Environment. The figures are extracted from the thesis. The CSV below transcribes the 285 run-level throughput values from Appendices A and B: Set 1 uses the reported aggregate row, and Set 2 uses the single-client receiver measurement. Values retain the precision reported in the document."
        ],
        "links": [
          {
            "href": "/post_documents/wifi7_mlo_throughput.csv",
            "label": "Download the thesis run-level throughput data (CSV)"
          }
        ]
      }
    ]
  },

  {
  slug: 'migrating-my-homelab-from-raspberry-pis-to-proxmox',
  title: 'Migrating My Homelab from Raspberry Pis to Proxmox',
  summary: 'Moving my services from a Pi K3s cluster to two OptiPlex hosts, while working through quorum, networking, deployment, monitoring, and recovery.',
  tags: ['Kubernetes', 'Proxmox', 'Networking', 'Infrastructure', 'DevOps'],
  sections: [
    {
      heading: 'why move a working cluster',
      paragraphs: [
        "The Pi cluster started as a way to give hardware I already had something useful to do. It ended up hosting my portfolio, a Pokémon tracker, and an HLTV service, with monitoring and deployments around them. Once I relied on those services, I started paying more attention to the parts that made them work: the machine running the control plane, where data was stored, and what happened when I needed to make a change.",
        "The Pis were useful for learning, but their memory and SD-card storage made it harder to add services without watching every resource decision. I had two Dell OptiPlex 5070 Micros available, each with an i7-9700T, 16 GB of RAM, and a 500 GB SSD. I wanted to use that extra capacity without throwing away the working environment before its replacement was ready.",
        "I built a second cluster alongside the first, moved and checked services one at a time, and retired the old K3s installation afterward. The move also gave me a chance to revisit assumptions I had made while the lab was growing, particularly around quorum, local storage, and what a successful deployment actually proves."
      ]
    },
    {
      heading: 'two hosts, three votes',
      paragraphs: [
        "I installed Proxmox on the two OptiPlexes and made them a cluster. Each host has one Kubernetes control-plane VM and two worker VMs. A Raspberry Pi provides the third control plane. K3s uses embedded etcd, so each control plane also has a vote in the database that holds cluster state.",
        "My first thought was to put two control planes on one OptiPlex and one on the other. That gives me three VMs, but not three independent places for them to run. Losing the host with two VMs would also remove two etcd votes. Putting the third voter on a Pi means either OptiPlex can fail without automatically taking a majority with it, provided the other members remain healthy and connected.",
        "The Pi has its own drawback: it uses an SD card, which is a less comfortable place for etcd than an SSD. I accepted that for the current lab because I already had the hardware, but the card remains a dependency I want to improve. The two workers on each OptiPlex also share that host's power, disk, and network connection. Separate VMs give me separate nodes to work with; they do not make those failures independent.",
        "Proxmox has its own quorum to maintain, separate from Kubernetes. I used another Pi as a Corosync QDevice for the two Proxmox hosts. It participates in the Proxmox quorum decision; it is not an etcd voter and does not replace the third Kubernetes control plane."
      ]
    },
    {
      heading: 'an address for the cluster',
      paragraphs: [
        "I placed the new nodes on the existing server VLAN and gave them reserved addresses. The old and new clusters needed to coexist during the migration, so I gave the new cluster its own pod and Service ranges. That let me build and test it without treating the old pod network as if it had moved with the applications.",
        "The Kubernetes API also needed an address that wasn't tied to whichever control-plane VM I happened to configure first. I used kube-vip for a shared address and pointed clients at it. I tested failover by removing the active kube-vip pod and checking that another instance took over. That was useful evidence for the VIP path, although I haven't tested a complete physical-host failure.",
        "K3s uses Flannel with VXLAN for pod networking. I placed test pods on different workers and checked that they could communicate before moving applications. Earlier, I had a separate two-Pi Cilium lab, which was useful for trying Hubble and network policy without changing production. The lab also exposed an endpoint mistake: an API address of 127.0.0.1 worked on the server, but pointed back to the worker when the second Pi tried to join. I corrected it to the server's reachable address.",
        "Cilium's Envoy component also failed on that Pi kernel, so I disabled its L7 proxy features to continue the lab. I kept Flannel for the new cluster rather than making the CNI migration another moving part. That leaves the Cilium features I experimented with out of the production setup for now."
      ]
    },
    {
      heading: 'moving applications without moving the outage',
      paragraphs: [
        "The new worker VMs are AMD64, while the Pis are ARM64. An image that worked on the Pi cluster was not automatically usable on the OptiPlexes. I changed the portfolio and tracker builds to publish both architectures and checked the HLTV images and scheduling choices for the new nodes. Pinning an image by digest makes the exact build being deployed explicit, but the digest still has to include an image compatible with the target architecture.",
        "I kept the old and new deployment paths separate while bringing the services across. The new application playbook checks the target cluster before applying one selected application, instead of reusing the old Pi server provisioning path. I verified application rollouts and connectivity on the new cluster before retiring the old one. The old databases contained little data, so I chose to start those applications with fresh databases instead of carrying their previous contents across.",
        "The portfolio has two replicas and an internal Kubernetes Service. Two cloudflared connectors maintain outbound tunnel connections to Cloudflare, which routes the public hostname to that Service. I moved the connectors into their own namespace and kept the tunnel credential there. That gives the connector and application separate management boundaries, although a namespace alone is not a network firewall.",
        "The tracker and HLTV service have different needs. Both use a single replica and node-local SQLite storage, with a Recreate update strategy to avoid overlapping writers. That is straightforward for small workloads but causes an interruption during an update and ties the data to one worker. A Bound PVC means Kubernetes has found storage; it doesn't mean there is a second copy on another node."
      ]
    },
    {
      heading: 'making deployments repeatable',
      paragraphs: [
        "The portfolio source and infrastructure live in separate repositories. A portfolio change builds and publishes a multi-architecture image, then dispatches a deployment with the image digest. The deployment runner reaches the Kubernetes API through the VIP using a scoped service account and waits for the rollout. A successful image build or dispatch is not the same as a successful deployment, so the deployment run has to be checked separately.",
        "I separated the portfolio deployer's access from the tunnel namespace. The deployer can patch the portfolio Deployment but can't directly read the tunnel Secret. The permission is still meaningful: Kubernetes RBAC doesn't restrict that patch to just the image field, so the credential needs protection and rotation. Its kubeconfig uses a time-limited token, and rotation is currently manual. The deployed digest is recorded in the workflow output rather than automatically written back to Git.",
        "Pokédex and HLTV use a separate manually triggered workflow. It calls the application playbook over SSH to the first control-plane VM, so that management path still depends on that VM even though the cluster has an API VIP. The tracker password and the private HLTV collector's registry credentials are supplied as secrets rather than put into manifests or images."
      ]
    },
    {
      heading: 'keeping monitoring outside the cluster',
      paragraphs: [
        "I considered running Prometheus and Grafana as Kubernetes workloads, but kept them on a Pi outside the new cluster. That gives me somewhere to look when the Kubernetes API or its workloads are having trouble. The tradeoff is another machine and another set of credentials and configuration to maintain; if the monitoring Pi or its storage fails, the dashboards and their local history go with it.",
        "Node exporters provide host metrics for the Pis and VMs. Prometheus also collects Kubernetes state and kubelet metrics using a restricted cluster identity, and Grafana has host and cluster dashboards. I removed the old cluster's scrape jobs after retirement and kept the new ones. Metrics are kept locally for seven days. There is no configured alert delivery, so a green dashboard when I check it isn't the same as being notified when something breaks.",
        "The HLTV collector was a good example of why infrastructure health isn't the whole picture. The pod and PVC were healthy and the API rolled out, but a player-data request received an upstream 403. Results and upcoming matches had been stored successfully. Restarting a pod or changing the cluster doesn't establish that an outside service will allow the request, so I left that issue visible for later rather than treating the rollout as a complete application test."
      ]
    },
    {
      heading: 'a copy is not a recovery plan',
      paragraphs: [
        "I set up daily snapshots of the tracker and HLTV SQLite databases to another Pi. SQLite's online backup API creates the snapshots while the applications are running, including committed write-ahead-log data. The receiver checks the files before placing them in private directories. A restricted SSH key can send backups to the receiver without granting an interactive shell.",
        "That improves the situation over having only a local PVC, but it is one extra copy on one Pi's SD card. The timer runs on the first control-plane VM and doesn't automatically move if that VM is down. The received databases passed integrity checks, including checks of temporary restored copies, but I haven't completed a full application restore into a PVC. There is also no backup retention limit yet, so the destination can fill over time.",
        "The application backups don't replace etcd snapshots or the K3s server token, which need their own secure recovery plan. I also kept Prometheus data and application data separate in my thinking: seven days of monitoring history helps investigate a problem, but it won't restore a lost database."
      ]
    },
    {
      heading: 'what i kept and what is next',
      paragraphs: [
        "After checking the new services, I retired the old Pi K3s cluster. The Pis still have jobs: one runs monitoring and the Proxmox QDevice, one stores application backups, and another runs the deployment runner. Terraform and Ansible continue to describe the Pi services, while manifests and application workflows manage the new cluster.",
        "I had also tested MetalLB BGP against pfSense on the old cluster. That experiment advertised a demo Service address to the router, but I haven't brought it to the new cluster yet. The public portfolio doesn't need that path because it uses the tunnel. When I return to BGP, I can give it a separate address plan and test routes and client traffic without making it a prerequisite for the migration.",
        "The cluster now has more compute capacity and a control-plane layout spread across three devices. It still depends on shared home power and networking, local worker disks, the Pi's SD card, and several manually maintained credentials. My next work is to test an application restore, improve backup retention and visibility, and eventually replace the Pi control plane's SD storage. Those are the parts that will tell me more about recovery than another successful rollout alone."
      ]
    }
  ]
},

]
