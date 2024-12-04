import jwt from 'jsonwebtoken';

const autenticacaoMiddleware = (req, res, next) => {
  // Lista de rotas públicas que não requerem autenticação
  const rotasPublicas = [
    '/api/usuarios/cadastro',
    '/api/usuarios/login'
  ];

  // Verifica se a rota atual é pública, considerando rotas dinâmicas
  if (rotasPublicas.some((rota) => req.path.startsWith(rota))) {
    console.log(`[Autenticação] Acesso permitido: ${req.path}`);
    return next(); // Permite o acesso sem autenticação
  }

  // Pega o token do cabeçalho Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Exemplo: "Bearer <token>"

  if (!token) {
    console.log(`[Autenticação] Falha: Token não fornecido na rota ${req.path}`);
    return res.status(401).json({ mensagem: 'Acesso negado. Nenhum token fornecido.' });
  }

  // Verifica o token JWT
  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) {
      console.error(`[Autenticação] Token inválido ou expirado na rota ${req.path}:`, err.message);
      return res.status(403).json({ mensagem: 'Token inválido ou expirado.' });
    }

    // Loga o ID do usuário decodificado
    console.log(`[Autenticação] Token válido. Usuário ID: ${usuario.id}`);

    // Armazena os dados do token no req para as próximas operações
    req.usuario = usuario;
    next();
  });
};

export default autenticacaoMiddleware;

