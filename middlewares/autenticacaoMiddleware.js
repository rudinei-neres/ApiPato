import jwt from 'jsonwebtoken'; // Usando import para importar o jwt

const autenticacaoMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Exemplo de token: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ mensagem: 'Acesso negado. Nenhum token fornecido.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) {
      return res.status(403).json({ mensagem: 'Token inválido ou expirado.' });
    }
    req.usuario = usuario; // Adiciona o usuário à requisição
    next();
  });
};

export default autenticacaoMiddleware; // Usando export default para exportar o middleware
