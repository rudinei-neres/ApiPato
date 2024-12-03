const jwt = require('jsonwebtoken');
const UsuarioServico = require('../servicos/usuarioServico');
const bcrypt = require('bcrypt');

const UsuarioControlador = {
  async login(req, res, next) {
    try {
      const { email, senha } = req.body;
      const usuario = await UsuarioServico.obterUsuario(email);

      if (!usuario) {
        return res.status(401).json({ mensagem: 'Usuário ou senha inválido' });
      }

      // Verificar senha
      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
      if (!senhaCorreta) {
        return res.status(401).json({ mensagem: 'Usuário ou senha inválido' });
      }

      // Gerar token JWT
      const token = jwt.sign({ id: usuario.id_usuario, email: usuario.email }, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });

      res.json({ token, nome: usuario.nome });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = UsuarioControlador;

