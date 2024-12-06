import UsuarioServico from '../servicos/usuarioServico.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ConexaoMySql from '../utils/bancoDeDados.js';

const UsuarioControlador = {
  // Método para login do usuário
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
      const token = jwt.sign({ id: usuario.id_usuario, email: usuario.email, papel: usuario.papel }, process.env.JWT_SECRET, { expiresIn: '100h' });

      res.status(200).json({ token, usuario });
    } catch (erro) {
      console.error('Erro ao realizar login:', erro.message);
      next(erro);
    }
  },

  // Método para buscar usuário logado
  async buscarUsuarioLogado(req, res) {
    try {
      if (!req.usuario) {
        console.warn('Token inválido ou não fornecido.');
        return res.status(401).json({ mensagem: 'Token inválido ou não fornecido.' });
      }
  
      const { id } = req.usuario;
      if (!id) {
        console.warn('Token inválido ou não fornecido.');
        return res.status(401).json({ mensagem: 'Token inválido ou não fornecido.' });
      }
  
      // Busca o usuário pelo ID
      const usuario = await UsuarioServico.obterUsuarioPorId(id);
  
      if (!usuario) {
        console.warn(`Token válido, mas usuário ${id} não encontrado.`);
        return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
      }
  
      // Retorna o objeto do usuário diretamente
      res.status(200).json(usuario);
    } catch (error) {
      console.error('Erro ao buscar usuário logado:', error);
      res.status(500).json({ mensagem: 'Erro ao buscar usuário logado.' });
    }
  },

  // Método para cadastrar um novo usuário
  async cadastrarUsuario(req, res, next) {
    console.log('Dados recebidos no cadastro:', req.body);
    try {
      const { nome, email, telefone, senha } = req.body;

      if (!nome || !email || !telefone || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
      }

      const usuarioExistente = await UsuarioServico.obterUsuario(email);
      if (usuarioExistente) {
        return res.status(409).json({ mensagem: 'Email já cadastrado.' });
      }

      const senhaHash = await bcrypt.hash(senha, 10);

      await UsuarioServico.criarUsuario({ nome, email, telefone, senha: senhaHash });

      res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
    } catch (erro) {
      console.error('Erro ao cadastrar usuário:', erro.message);
      next(erro);
    }
  },

 // Método para atualizar o saldo do usuário
// Método para atualizar o saldo do usuário
async atualizarSaldo(req, res, next) {
  try {
    const { saldo } = req.body;
    const { id } = req.usuario; // Obter o ID do usuário autenticado do middleware

    // Verifique se o saldo está presente
    if (typeof saldo === 'undefined') {
      return res.status(400).json({ mensagem: 'Saldo é obrigatório.' });
    }

    await UsuarioServico.atualizarSaldoPorId(id, saldo);
    res.status(200).json({ mensagem: 'Saldo atualizado com sucesso.' });
  } catch (erro) {
    console.error('Erro ao atualizar saldo:', erro.message);
    next(erro);
  }
},

// Método para obter o saldo inicial do usuário
async inicialSaldo(req, res, next) {
  try {
    const { id } = req.usuario; // Obter o ID do usuário autenticado do middleware

    const saldo = await UsuarioServico.obterSaldoPorId(id);

    if (saldo === null) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    res.status(200).json({ saldo });
  } catch (erro) {
    console.error('Erro ao obter saldo:', erro.message);
    next(erro);
  }
},

  // Método para obter um usuário por ID
  async obterUsuarioPorId(req, res, next) {
    try {
      const { id } = req.params;
      const usuario = await UsuarioServico.obterUsuarioPorId(id);

      if (!usuario) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
      }

      res.status(200).json(usuario);
    } catch (erro) {
      console.error('Erro ao obter usuário por ID:', erro.message);
      next(erro);
    }
  },

  // Método para deletar um usuário
  async deletarUsuario(req, res, next) {
    try {
      const { id } = req.params;
      await UsuarioServico.deletarUsuario(id);
      res.status(200).json({ mensagem: 'Usuário deletado com sucesso' });
    } catch (erro) {
      console.error('Erro ao deletar usuário:', erro.message);
      next(erro);
    }
  },

  // Método para atualizar dados do usuário
  async atualizarUsuario(req, res, next) {
    try {
      const { id_usuario, nome, telefone } = req.body;
      await UsuarioServico.atualizarUsuario({ id_usuario, nome, telefone });
      res.status(200).json({ mensagem: 'Usuário atualizado com sucesso!' });
    } catch (erro) {
      console.error('Erro ao atualizar usuário:', erro.message);
      next(erro);
    }
  },
  async listarusUarios(req, res) {
    try {
      const [usuarios] = await ConexaoMySql.execute('SELECT * FROM usuarios');
  
      if (usuarios.length === 0) {
        return res.status(404).json({ mensagem: 'Nenhum usuário encontrado.' });
      }
  
      res.status(200).json(usuarios);
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).json({ mensagem: 'Erro ao listar usuários.' });
    }
  },
  
  async  atualizarSaldoUsuarioPorId(req, res) {
    const { id_usuario } = req.params;
    const { carteira } = req.body;
  
    try {
      const [resultado] = await ConexaoMySql.execute(
        'UPDATE usuarios SET carteira = ? WHERE id_usuario = ?',
        [carteira, id_usuario]
      );
  
      if (resultado.affectedRows === 0) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
      }
  
      res.status(200).json({ mensagem: 'Usuário atualizado com sucesso.' });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ mensagem: 'Erro ao atualizar usuário.' });
    }
  }
  
  





};

export default UsuarioControlador;




