# Official TCP LARP results

LARP is the official feedback-adaptive controller. All numbers below come from the new matched cohort:108 main observations, three repetitions per cell, plus nine calibration checks. No older LARP performance is included.

| Method | H delivery Mbps | X delivery Mbps | H 128 MiB seconds | X 128 MiB seconds |
| --- | ---: | ---: | ---: | ---: |
| LARP | 955.71 | 1879.50 | 1.288 | 0.604 |
| CUBIC | 954.78 | 1912.54 | 1.423 | 0.606 |
| BBR v1 | 955.00 | 1912.35 | 1.441 | 0.608 |

H=1 Gbps/30 ms; X=2 Gbps/5 ms, both1 BDP FIFO. Continuous delivery uses a six-second receiver window after two-second warmup. File completion includes connect and ends at the last payload read. Ranges and per-trial values are in `official-summary.json` and the raw reports.

For 1 MiB, LARP means are28.62ms onF,154.68ms onH,27.25 ms onX and1289.00ms onS. CUBIC means are48.57,271.82,47.40 and892.67ms. F=1 Gbps/5 ms; S=25 Mbps/90 ms/0.25 BDP RED/ECN. LARP is slower onS.

With a continuing CUBIC incumbent onH,128 MiB LARP completion averages2.794s. With continuing BBR it averages8.241s; a BBR newcomer averages2.605s. All three CUBIC newcomers behind BBR reach the45 s wall limit and remain censored, rather than receiving a completed-file time.

Coexistence remains uneven. OnM (100 Mbps/30 ms), LARP/CUBIC delivers93.58/2.44Mbps. OnS, it delivers18.38/0.33Mbps. A fast LARP result is not proof of fair sharing. The paper and slides report both flows.

Reproduce with `python3 -B lab/adaptive_report.py`, then `python3 -B paper/generate_official.py`. These validate all raw identities, controlled source hashes, packages, successful payload sizes and continuing incumbents, then select only the official controllers. Other limit-policy observations remain separate engineering diagnostics.

This is a two-vCPU virtual testbed with three repetitions, not a physical-link, tail-percentile, significance or equilibrium-fairness result. No host network or kernel setting was changed.
