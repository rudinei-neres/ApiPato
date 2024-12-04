import UsuarioServico from '../servicos/usuarioServico.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // Adicionando a importação do jsonwebtoken

const UsuarioControlador = {
  async login(req, res, next) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ mensagem: 'Email e senha são obrigatórios.' });
      }

      const usuario = await UsuarioServico.obterUsuario(email);

      if (!usuario) {
        return res.status(401).json({ mensagem: 'Credenciais inválidas.' });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);

      if (!senhaValida) {
        return res.status(401).json({ mensagem: 'Credenciais inválidas.' });
      }

      // Geração do token JWT
      const token = jwt.sign({ id: usuario.id_usuario }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ token, usuario });
    } catch (erro) {
      console.error('Erro ao realizar login:', erro.message);
      next(erro);
    }
  },

  async obterUsuario(req, res, next) {
    const email = req.query.email;
    const usuario = await UsuarioServico.obterUsuario(email);
    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }
  },
  async atualizarSaldo(req, res, next) {
    const { email, saldo } = req.body;
    await UsuarioServico.atualizarSaldo(email, saldo);
    res.status(200).json({ mensagem: 'Saldo atualizado com sucesso' });
  },
  async deletarUsuario(req, res, next) {
    const { id } = req.params;
    await UsuarioServico.deletarUsuario(id);
    res.status(200).json({ mensagem: 'Usuário deletado com sucesso' });
  },

  async atualizarUsuario(req, res, next) {
    const { id_usuario, nome, telefone } = req.body;
    try {
      await UsuarioServico.atualizarUsuario({ id_usuario, nome, telefone });
      res.status(200).json({ mensagem: 'Usuário atualizado com sucesso!' });
    } catch (erro) {
      next(erro);
    }
  },


  async cadastrarUsuario(req, res, next) {
    console.log('Dados recebidos no cadastro:', req.body);
    try {
      const { nome, email, telefone, senha } = req.body;

      if (!nome || !email || !telefone || !senha) {
        const erro = new Error('Todos os campos são obrigatórios.');
        erro.status = 400;
        throw erro;
      }

      const usuarioExistente = await UsuarioServico.obterUsuario(email);
      if (usuarioExistente) {
        const erro = new Error('Email já cadastrado.');
        erro.status = 409;
        throw erro;
      }

      const senhaHash = await bcrypt.hash(senha, 10);

      await UsuarioServico.criarUsuario({ nome, email, telefone, senha: senhaHash });

      res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
    } catch (erro) {
      next(erro);
    }
  }
};

export default UsuarioControlador;
