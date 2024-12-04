import jwt from 'jsonwebtoken';






const autenticacaoMiddleware = (req, res, next) => {
  
// Lista de rotas públicas que não requerem autenticação
  const rotasPublicas = [
    '/api/usuarios/cadastro',
    '/api/usuarios/login'
  ];

  // Verifica se a rota atual é pública
  if (rotasPublicas.includes(req.path)) {
    console.log(`Acesso permitido: ${req.path}`);
    return next(); // Permite o acesso sem autenticação
  }

  // Pega o token do cabeçalho Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Exemplo: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ mensagem: 'Acesso negado. Nenhum token fornecido.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) {
      return res.status(403).json({ mensagem: 'Token inválido ou expirado.' });
    }
    req.usuario = usuario; // Armazena os dados do token no req
    next();
  });
};

export default autenticacaoMiddleware;
