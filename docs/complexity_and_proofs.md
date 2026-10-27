# Mathematical Formulation, Optimality Proofs & Complexity Analysis (WP1 – WP3)

## 1. Part A — A* Search Optimality Proofs

### 1.1 Admissibility & Consistency of Haversine Heuristic $h(n)$
Let $G = (V, E)$ be the road network where each active road $(u, v) \in E$ has non-negative physical highway length $w(u, v) = d_{\text{road}}(u, v) > 0$.
The heuristic $h(u) = d_{\text{Haversine}}(u, D)$ measures the shortest geodesic arc on the Earth's surface between $u$ and destination $D$.
1. **Admissibility:** Since no terrestrial road between $u$ and $D$ can be shorter than the great-circle geodesic distance, $h(u) \le d^*(u, D)$ for all $u \in V$, and $h(D) = 0$.
2. **Consistency (Monotonicity):** By the spherical triangle inequality, $d_{\text{Haversine}}(u, D) \le d_{\text{Haversine}}(u, v) + d_{\text{Haversine}}(v, D) \le w(u, v) + h(v)$. Therefore, $f(n) = g(n) + h(n)$ is monotonically non-decreasing along any path, guaranteeing that `A*` finds the globally minimum-distance route without re-expanding closed vertices.

### 1.2 Part A Time & Space Complexity
- **Time Complexity:** Using an adjacency list and a binary min-heap priority queue, each vertex is popped once ($\mathcal{O}(|V| \log |V|)$) and each active edge triggers at most one heap insertion ($\mathcal{O}(|E| \log |V|)$), yielding:
  $$T_{\text{A*}}(|V|, |E|) = \mathcal{O}((|V| + |E|) \log |V|)$$
- **Space Complexity:** $\mathcal{O}(|V| + |E|)$ for adjacency lists, `g_score`, `parent` pointers, and the open heap.

---

## 2. Part B — Dynamic Programming Optimality & Complexity

### 2.1 Optimal Substructure Proof
Let $\mathcal{S} = \langle S_0, S_1, \dots, S_k \rangle$ be the sequence of $k+1$ nodes along the `A*` corridor.
Suppose an optimal charging schedule reaches node $S_{i+1}$ with residual battery $b'$ after charging $\Delta b^*$ at node $S_i$ from arrival battery $b_{\text{arr}} = b' + E_{i \to i+1} - \Delta b^*$.
By contradiction, if the prefix schedule reaching $S_i$ with battery $b_{\text{arr}}$ were not minimum-cost (for a given elapsed time budget), substituting a cheaper valid prefix to $(S_i, b_{\text{arr}})$ would strictly reduce the total cost to $(S_{i+1}, b')$, contradicting optimality. Thus, the problem exhibits **Optimal Substructure**.

### 2.2 Part B Time & Space Complexity vs. Brute Force
- Let $k$ be the number of corridor stations and $B = B_{\max} - B_{\min} + 1$ be the number of discrete battery states.
- At each station $i \in \{0, \dots, k-1\}$ and each arrival state $b_{\text{arr}} \in [B_{\min}, B_{\max}]$, there are at most $B$ valid charge increments $\Delta b \in [0, B_{\max} - b_{\text{arr}}]$.
- **DP Time Complexity:**
  $$T_{\text{DP}}(k, B) = \mathcal{O}(k \cdot B^2)$$
- **DP Space Complexity:**
  $$S_{\text{DP}}(k, B) = \mathcal{O}(k \cdot B)$$
- **Brute-Force Comparison:** Enumerating all possible charge increments $\{0, 1, \dots, B\}$ across $k$ stations requires $\mathcal{O}(B^k)$ operations. For $k = 10$ stations and $B = 64\text{ kWh}$, brute force requires $64^{10} \approx 1.15 \times 10^{18}$ operations (infeasible), whereas our DP evaluates at most $10 \times \frac{64 \times 65}{2} \approx 20,800$ transitions in $< 5\text{ ms}$.
