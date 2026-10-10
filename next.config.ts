import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // As propostas moram em /proposta/<slug> (singular), mas o link é digitado e
  // compartilhado no plural com frequência. Em vez de o cliente cair num 404,
  // /propostas/<slug> redireciona pro lugar certo.
  async redirects() {
    return [
      { source: "/propostas/:slug*", destination: "/proposta/:slug*", permanent: false },
    ];
  },
};

export default nextConfig;
