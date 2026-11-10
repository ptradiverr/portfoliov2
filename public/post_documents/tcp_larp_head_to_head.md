# Adaptive LARP and JumpStart with CUBIC

Verified 300 observations on Linux 6.12.115-0-virt. Three repetitions per cell; values are mean [observed minimum, maximum], not confidence intervals.

Adaptive LARP is unchanged from the official November 4 controller. `jumpcubic` is an experimental paced JumpStart launch followed by native Linux CUBIC at the first ACK. It is not an original-author implementation or the historical Reno-fallback port. No Reno measurements are included.

The verdict is workload-dependent. LARP often completes files sooner than this JumpStart/CUBIC integration on the faster paths, but native CUBIC wins the 5 Gbps large-file and sustained comparisons. LARP also loses some shallow-queue solo cases. Self competition is balanced on several paths but extremely unequal per trial on the shallow RED/ECN path; mixed LARP/JumpStart-CUBIC sharing strongly favors LARP at 100 and 25 Mbps. These results do not establish a universally superior controller or a matched-initial-window causal effect.

## Conditions

| Path | Shaper Mbps | Base RTT ms | Buffer BDP | Queue |
| --- | ---: | ---: | ---: | --- |
| H | 1000 | 30 | 1 | FIFO |
| X | 2000 | 5 | 1 | FIFO |
| Z | 5000 | 5 | 1 | FIFO |
| M | 100 | 30 | 1 | FIFO |
| S | 25 | 90 | 0.25 | RED/ECN |

These are coupled path conditions; absolute buffer bytes scale with BDP. Configured 5 Gbps is not a physical-link guarantee. Use native CUBIC sustained delivery below to assess guest capacity.

## Solo finite completion

Connect to last receiver payload read, seconds; successful transfers verify byte count and SHA-256.

| Path | File MiB | Adaptive LARP | JumpStart -> CUBIC | CUBIC |
| --- | ---: | ---: | ---: | ---: |
| H | 1 | 0.154 [0.153, 0.154] (3/3) | 0.479 [0.477, 0.480] (3/3) | 0.272 [0.268, 0.274] (3/3) |
| H | 16 | 0.309 [0.307, 0.312] (3/3) | 1.752 [1.744, 1.758] (3/3) | 0.443 [0.440, 0.447] (3/3) |
| H | 128 | 1.291 [1.286, 1.297] (3/3) | 3.158 [3.156, 3.160] (3/3) | 1.425 [1.421, 1.428] (3/3) |
| X | 1 | 0.027 [0.027, 0.028] (3/3) | 0.087 [0.087, 0.087] (3/3) | 0.048 [0.048, 0.049] (3/3) |
| X | 16 | 0.104 [0.104, 0.104] (3/3) | 0.317 [0.316, 0.318] (3/3) | 0.115 [0.114, 0.115] (3/3) |
| X | 128 | 0.603 [0.602, 0.605] (3/3) | 0.817 [0.816, 0.818] (3/3) | 0.607 [0.606, 0.607] (3/3) |
| X | 512 | 2.321 [2.316, 2.330] (3/3) | 2.500 [2.499, 2.502] (3/3) | 2.291 [2.291, 2.291] (3/3) |
| Z | 1 | 0.027 [0.027, 0.028] (3/3) | 0.086 [0.086, 0.087] (3/3) | 0.048 [0.048, 0.049] (3/3) |
| Z | 16 | 0.094 [0.093, 0.094] (3/3) | 0.315 [0.315, 0.315] (3/3) | 0.084 [0.081, 0.086] (3/3) |
| Z | 128 | 0.344 [0.325, 0.355] (3/3) | 0.617 [0.615, 0.617] (3/3) | 0.302 [0.277, 0.351] (3/3) |
| Z | 512 | 1.296 [1.295, 1.298] (3/3) | 1.557 [1.554, 1.561] (3/3) | 0.952 [0.951, 0.952] (3/3) |
| M | 1 | 0.212 [0.209, 0.215] (3/3) | 0.478 [0.474, 0.480] (3/3) | 0.290 [0.289, 0.292] (3/3) |
| M | 16 | 1.514 [1.511, 1.518] (3/3) | 2.119 [2.088, 2.174] (3/3) | 1.613 [1.600, 1.629] (3/3) |
| M | 128 | 11.344 [11.332, 11.355] (3/3) | 11.915 [11.909, 11.921] (3/3) | 11.432 [11.429, 11.433] (3/3) |
| S | 1 | 1.956 [1.289, 3.199] (3/3) | 1.403 [1.394, 1.409] (3/3) | 0.895 [0.890, 0.902] (3/3) |
| S | 16 | 8.158 [8.019, 8.281] (3/3) | 9.226 [9.215, 9.244] (3/3) | 8.387 [8.351, 8.455] (3/3) |
| S | 128 | 58.538 [58.187, 59.008] (3/3) | 56.126 [52.301, 59.336] (3/3) | 55.388 [53.509, 56.531] (3/3) |

## Solo continuous delivery

Six-second receiver window after two seconds of warmup; all senders remain active through the window.

| Path | Adaptive LARP Mbps | JumpStart -> CUBIC Mbps | CUBIC Mbps |
| --- | ---: | ---: | ---: |
| H | 955.72 [955.70, 955.72] | 916.66 [916.49, 916.96] | 955.09 [953.85, 955.73] |
| X | 1879.85 [1879.13, 1880.60] | 1911.52 [1909.30, 1912.64] | 1912.55 [1912.49, 1912.59] |
| Z | 3395.00 [3389.09, 3403.50] | 3411.45 [3397.56, 3420.72] | 4769.54 [4767.99, 4770.60] |
| M | 95.73 [95.20, 96.36] | 95.64 [95.64, 95.64] | 95.64 [95.64, 95.64] |
| S | 18.54 [18.46, 18.62] | 16.31 [16.29, 16.34] | 16.84 [16.71, 16.97] |

## Two continuous flows starting together

Ten-second common receiver window after two seconds of warmup. A/B rates follow the listed method order. Identical-method A/B denotes sender namespaces; it does not denote a persistent privileged role.

| Path | A / B | A Mbps | B Mbps | Mean Jain |
| --- | --- | ---: | ---: | ---: |
| H | Adaptive LARP / Adaptive LARP | 489.68 [463.49, 504.15] | 459.55 [447.18, 481.69] | 0.998 |
| H | Adaptive LARP / JumpStart -> CUBIC | 758.55 [758.08, 759.04] | 195.65 [195.17, 196.08] | 0.742 |
| H | JumpStart -> CUBIC / JumpStart -> CUBIC | 477.28 [476.35, 478.20] | 475.46 [474.22, 476.62] | 1.000 |
| H | CUBIC / CUBIC | 476.54 [475.40, 478.35] | 479.43 [477.86, 480.50] | 1.000 |
| X | Adaptive LARP / Adaptive LARP | 956.98 [956.69, 957.50] | 950.17 [948.79, 951.77] | 1.000 |
| X | Adaptive LARP / JumpStart -> CUBIC | 1015.83 [998.48, 1049.15] | 896.75 [863.44, 914.06] | 0.996 |
| X | JumpStart -> CUBIC / JumpStart -> CUBIC | 1008.41 [861.21, 1106.28] | 903.90 [806.22, 1050.63] | 0.985 |
| X | CUBIC / CUBIC | 1002.67 [894.67, 1122.66] | 908.16 [785.39, 1017.19] | 0.988 |
| Z | Adaptive LARP / Adaptive LARP | 2718.24 [2525.23, 3103.35] | 1985.73 [1615.96, 2190.18] | 0.966 |
| Z | Adaptive LARP / JumpStart -> CUBIC | 2317.29 [1698.85, 3484.19] | 2442.44 [1242.63, 3075.98] | 0.892 |
| Z | JumpStart -> CUBIC / JumpStart -> CUBIC | 2269.53 [961.07, 3726.57] | 2477.88 [965.65, 3812.59] | 0.822 |
| Z | CUBIC / CUBIC | 2275.80 [2088.12, 2408.14] | 2495.53 [2363.64, 2685.71] | 0.995 |
| M | Adaptive LARP / Adaptive LARP | 48.72 [43.29, 53.98] | 49.88 [42.34, 57.11] | 0.989 |
| M | Adaptive LARP / JumpStart -> CUBIC | 93.19 [92.64, 93.99] | 2.35 [1.95, 2.75] | 0.525 |
| M | JumpStart -> CUBIC / JumpStart -> CUBIC | 49.97 [44.02, 53.14] | 45.66 [42.50, 51.59] | 0.990 |
| M | CUBIC / CUBIC | 47.32 [45.85, 48.81] | 48.32 [46.82, 49.79] | 0.999 |
| S | Adaptive LARP / Adaptive LARP | 6.25 [0.03, 18.63] | 12.38 [0.06, 18.56] | 0.503 |
| S | Adaptive LARP / JumpStart -> CUBIC | 18.34 [18.29, 18.43] | 0.30 [0.29, 0.31] | 0.516 |
| S | JumpStart -> CUBIC / JumpStart -> CUBIC | 9.26 [8.99, 9.81] | 9.53 [8.99, 9.80] | 0.998 |
| S | CUBIC / CUBIC | 9.01 [7.45, 10.62] | 11.55 [9.09, 14.91] | 0.962 |

## Mixed continuous flows with an incumbent

The incumbent starts two seconds earlier. Observation begins two seconds after the newcomer starts; both continue through the common ten-second window.

| Path | Earlier method | LARP Mbps | JumpStart -> CUBIC Mbps | Mean Jain |
| --- | --- | ---: | ---: | ---: |
| H | Adaptive LARP | 754.74 [750.30, 758.59] | 198.86 [195.67, 201.85] | 0.746 |
| H | JumpStart -> CUBIC | 740.03 [736.01, 746.95] | 212.57 [207.59, 215.78] | 0.765 |
| X | Adaptive LARP | 998.27 [996.45, 999.61] | 914.16 [913.00, 915.64] | 0.998 |
| X | JumpStart -> CUBIC | 1116.72 [1046.12, 1235.29] | 795.83 [677.83, 866.47] | 0.966 |
| Z | Adaptive LARP | 2101.76 [1276.22, 3685.49] | 2660.62 [1059.66, 3498.67] | 0.809 |
| Z | JumpStart -> CUBIC | 1187.70 [1014.31, 1278.94] | 3576.30 [3478.63, 3755.64] | 0.799 |
| M | Adaptive LARP | 93.31 [92.83, 93.75] | 2.14 [1.89, 2.29] | 0.523 |
| M | JumpStart -> CUBIC | 93.11 [92.61, 93.39] | 2.41 [2.25, 2.65] | 0.526 |
| S | Adaptive LARP | 18.51 [18.38, 18.63] | 0.25 [0.10, 0.35] | 0.514 |
| S | JumpStart -> CUBIC | 18.45 [18.44, 18.47] | 0.28 [0.26, 0.31] | 0.515 |

## Two simultaneous 128 MiB files

Each file ends independently. These completion times include a period of competition followed by solo service if the other file finishes earlier; they are not equilibrium-fairness measurements.

| Path | A / B | A completion s | B completion s | Completed files |
| --- | --- | ---: | ---: | ---: |
| H | Adaptive LARP / Adaptive LARP | 2.437 [2.433, 2.441] | 2.300 [2.276, 2.317] | 3 / 3 |
| H | Adaptive LARP / JumpStart -> CUBIC | 1.321 [1.319, 1.323] | 3.437 [3.433, 3.444] | 3 / 3 |
| X | Adaptive LARP / Adaptive LARP | 1.149 [1.131, 1.160] | 1.140 [1.133, 1.150] | 3 / 3 |
| X | Adaptive LARP / JumpStart -> CUBIC | 0.918 [0.907, 0.926] | 1.247 [1.234, 1.271] | 3 / 3 |

## Integrity and interpretation

- Noncompleted/error flows: 0. They receive no successful completion time; raw statuses and deadlines are preserved.
- Every successful JumpStart/CUBIC flow must report final native `cubic` and a successful kernel handoff event. There is no silent Reno substitution.
- The original launch rate and 512-segment launch allowance are retained for adaptive LARP. No controller fixes were applied during this experiment.
- Solo method order rotates over three repetitions; the mixed simultaneous pair reverses sender namespaces in repetition two. Both incumbent orders are tested.
- TCP_INFO sampling is 50 ms finite / 20 ms continuous. Receiver arrival bins are 100 ms; sampled maxima can miss short events.
- Each topology starts with cold neighbor state, which can inflate handshake RTT. JumpStart launch is bounded by the initial receiver advertisement; this is not a matched-initial-cwnd comparison.
- Whole-transfer qdisc counters include startup, warmup and tail. They are not restricted to the common goodput window.
- A high Jain index measures similar observed rates, not good total utilization or convergence. These short pairs do not establish equilibrium or tail behavior.
- Results come from one two-vCPU diskless ARM64 guest with offloads disabled. Host network/kernel settings and installed packages are unchanged.
- Raw input: `head-to-head-2026-11-05.json.gz`; SHA-256 `26303ef22405b81f64a9030f5f011615100378ec410a541d4b4940e7100c7047`.
- Historical JumpStart/Reno and older LARP measurements are not pooled into these results.

