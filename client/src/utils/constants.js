export const ALGO_LIST = [
  { key: 'gradient_descent',    label: 'Gradient Descent',       category: 'Optimization',     icon: '∇', tag: 'optimization',  desc: 'Minimizes f(x) by stepping opposite to the gradient.' },
  { key: 'newton_raphson',      label: 'Newton–Raphson',          category: 'Root-Finding',     icon: 'f′', tag: 'root-finding', desc: 'Uses first derivative to find roots. Quadratic convergence.' },
  { key: 'bisection',           label: 'Bisection Method',        category: 'Root-Finding',     icon: '[a,b]', tag: 'root-finding', desc: 'Halves an interval guaranteed to contain a root.' },
  { key: 'secant',              label: 'Secant Method',           category: 'Root-Finding',     icon: 'Δx', tag: 'root-finding', desc: 'Approximates derivative using finite differences.' },
  { key: 'simulated_annealing', label: 'Simulated Annealing',     category: 'Metaheuristic',    icon: 'T°', tag: 'metaheuristic', desc: 'Probabilistic optimizer — escapes local minima.' },
  { key: 'genetic',             label: 'Genetic Algorithm',       category: 'Evolutionary',     icon: '⛬', tag: 'evolutionary', desc: 'Evolutionary optimization via selection and mutation.' },
  { key: 'linear_regression',   label: 'Linear Regression GD',   category: 'Machine Learning', icon: 'ŷ', tag: 'ml', desc: 'Gradient descent to minimize MSE for regression.' },
  { key: 'logistic_regression', label: 'Logistic Regression GD', category: 'Machine Learning', icon: 'σ', tag: 'ml', desc: 'Cross-entropy minimization for binary classification.' },
];

export const COLORS = {
  A: '#2563c4', B: '#e84f2c', C: '#1a9e6e', D: '#b8860b',
};

export const algoLabel = key => ALGO_LIST.find(a => a.key === key)?.label ?? key;
