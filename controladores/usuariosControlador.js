import UsuarioServico from '../servicos/usuarioServico.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

      const token = jwt.sign({ id: usuario.id_usuario }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ token, usuario });
    } catch (erro) {
      console.error('Erro ao realizar login:', erro.message);
      next(erro);
    }
  
  },
  async obterUsuario(req, res, next) {
    const email = req.query.email;  // Exemplo de como você pode buscar por email
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

  async cadastrarUsuario(req, res, next) {
    console.log('Dados recebidos no cadastro:', req.body);
    try {
      const { nome, email, telefone, senha } = req.body;
  
      // Verifica se todos os campos obrigatórios foram preenchidos
      if (!nome || !email || !telefone || !senha) {
        const erro = new Error('Todos os campos são obrigatórios.');
        erro.status = 400;
        throw erro;
      }
  
      // Verifica se o email já está em uso
      const usuarioExistente = await UsuarioServico.obterUsuario(email);
      if (usuarioExistente) {
        const erro = new Error('Email já cadastrado.');
        erro.status = 409;
        throw erro;
      }
  
      // Hash da senha para segurança
      const senhaHash = await bcrypt.hash(senha, 10);
  
      // Insere o novo usuário no banco de dados
      await UsuarioServico.criarUsuario({ nome, email, telefone, senha: senhaHash });
  
      res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
    } catch (erro) {
      next(erro); // Encaminha o erro para o middleware de erro
    }
  },
  catch (erro) {
    console.error('Erro no cadastro:', erro.message);
    next(erro);
  }







};

export default UsuarioControlador;

