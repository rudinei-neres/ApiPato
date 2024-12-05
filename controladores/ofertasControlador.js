import ConexaoMySql from '../utils/bancoDeDados.js';

export const listarOfertas = async (req, res) => {
  try {
    const connection = await new ConexaoMySql().getConexao();
    const [ofertas] = await connection.execute('SELECT * FROM ofertas');

    if (ofertas.length === 0) {
      return res.status(404).json({ mensagem: 'Nenhuma oferta encontrada.' });
    }

    res.status(200).json(ofertas);
  } catch (error) {
    console.error('Erro ao listar ofertas:', error);
    res.status(500).json({ mensagem: 'Erro ao listar ofertas.' });
  }
};

export const obterOferta = async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await new ConexaoMySql().getConexao();
    const [oferta] = await connection.execute(
      'SELECT * FROM ofertas WHERE id_oferta = ?',
      [id]
    );

    if (oferta.length === 0) {
      return res.status(404).json({ mensagem: `Oferta com ID ${id} não encontrada.` });
    }

    res.status(200).json(oferta[0]);
  } catch (error) {
    console.error('Erro ao obter oferta:', error);
    res.status(500).json({ mensagem: 'Erro ao obter oferta.' });
  }
};

export const criarOferta = async (req, res) => {
  const { titulo, descricao, preco, validade } = req.body;

  if (!titulo || !descricao || !preco || !validade) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
  }

  try {
    const connection = await new ConexaoMySql().getConexao();
    await connection.execute(
      'INSERT INTO ofertas (titulo, descricao, preco, validade) VALUES (?, ?, ?, ?)',
      [titulo, descricao, preco, validade]
    );

    res.status(201).json({ mensagem: 'Oferta criada com sucesso!' });
  } catch (error) {
    console.error('Erro ao criar oferta:', error);
    res.status(500).json({ mensagem: 'Erro ao criar oferta.' });
  }
};

export const deletarOferta = async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await new ConexaoMySql().getConexao();
    const [resultado] = await connection.execute(
      'DELETE FROM ofertas WHERE id_oferta = ?',
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: `Oferta com ID ${id} não encontrada.` });
    }

    res.status(200).json({ mensagem: 'Oferta deletada com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar oferta:', error);
    res.status(500).json({ mensagem: 'Erro ao deletar oferta.' });
  }
};

export default {
  listarOfertas,
  obterOferta,
  criarOferta,
  deletarOferta,
};
