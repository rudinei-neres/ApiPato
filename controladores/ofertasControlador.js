import ConexaoMySql from '../utils/bancoDeDados.js';

export const listarOfertas = async (req, res) => {
  try {
    const [ofertas] = await ConexaoMySql.execute('SELECT * FROM ofertas');

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
    const [oferta] = await ConexaoMySql.execute(
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
  const { imagen_url, valor, quantidade } = req.body;

  if ( !imagen_url || !valor || !quantidade) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
  }

  try {
    await ConexaoMySql.execute(
      'INSERT INTO ofertas (imagen_url, valor, quantidade) VALUES (?, ?, ?, ?)',
      [imagen_url, valor, quantidade]
    );

    res.status(201).json({ mensagem: 'Oferta criada com sucesso!' });
  } catch (error) {
    console.error('Erro ao criar oferta:', error);
    res.status(500).json({ mensagem: 'Erro ao criar oferta.' });
  }
};

export const atualizarOferta = async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, preco, validade } = req.body;

  try {
    await ConexaoMySql.execute(
      'UPDATE ofertas SET titulo = ?, descricao = ?, preco = ?, validade = ? WHERE id_oferta = ?',
      [titulo, descricao, preco, validade, id]
    );

    res.status(200).json({ mensagem: 'Oferta atualizada com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar oferta:', error);
    res.status(500).json({ mensagem: 'Erro ao atualizar oferta.' });
  }
};

export const deletarOferta = async (req, res) => {
  const { id } = req.params;

  try {
    const [resultado] = await ConexaoMySql.execute(
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
  atualizarOferta,
  deletarOferta,
};