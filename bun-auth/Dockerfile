# Multi-stage build para otimização
FROM oven/bun:1.1.30-alpine AS base

# Instalar dependências
FROM base AS deps
WORKDIR /app
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile --production

# Build da aplicação
FROM base AS build
WORKDIR /app
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile
COPY . .
# Não rodar migrations no build - deve ser feito manualmente em produção

# Produção
FROM base AS production
WORKDIR /app

# Criar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 bunjs

# Copiar dependências e código
COPY --from=deps --chown=bunjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=bunjs:nodejs /app .

# Render atribui porta dinamicamente via $PORT
# Expor porta padrão (será sobrescrita pela variável PORT)
EXPOSE 3333

# Mudar para usuário não-root
USER bunjs

# Health check - usa $PORT se disponível
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT:-3333}/ || exit 1

# Comando de inicialização
CMD ["bun", "run", "src/index.ts"]