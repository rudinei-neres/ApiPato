import UsuarioServico from '../servicos/usuarioServico.js';

const UsuarioControlador = {
  async login(req, res, next) {
    // Lógica para login
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








};

export default UsuarioControlador;

