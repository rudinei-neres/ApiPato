// Importando bibliotecas e serviços necessários
import jwt from "jsonwebtoken"; // Para gerar e verificar tokens JWT
import UsuarioServico from "../servicos/usuarioServico.js"; // Serviço para manipulação de usuários
import bcrypt from "bcryptjs"; // Alterado para bcryptjs

// Controlador de Usuário
const UsuarioControlador = {
  async login(req, res, next) {
    try {
      // Extraindo dados da requisição
      const { email, senha } = req.body;

      // Buscando usuário pelo email no serviço
      const usuario = await UsuarioServico.obterUsuario(email);

      if (!usuario) {
        // Retorna erro se usuário não for encontrado
        return res.status(401).json({ mensagem: "Usuário ou senha inválido" });
      }

      // Verificar se a senha está correta usando bcryptjs
      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
      if (!senhaCorreta) {
        // Retorna erro se a senha estiver incorreta
        return res.status(401).json({ mensagem: "Usuário ou senha inválido" });
      }

      // Gerar token JWT com informações do usuário
      const token = jwt.sign(
        { id: usuario.id_usuario, email: usuario.email }, // Payload
        process.env.JWT_SECRET, // Chave secreta
        { expiresIn: "1h" } // Expiração
      );

      // Retornar token e dados do usuário
      res.json({ token, nome: usuario.nome });
    } catch (error) {
      // Encaminhar erros para o middleware de erro
      next(error);
    }
  },
};

// Exportando o controlador
export default UsuarioControlador;
