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
  const { imagem_url, quantidade, valor } = req.body;

  if (!imagem_url || !quantidade || !valor) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
  }

  try {
    await ConexaoMySql.execute(
      'INSERT INTO ofertas (imagem_url, quantidade, valor) VALUES (?, ?, ?)',
      [imagem_url, quantidade, valor]
    );

    res.status(201).json({ mensagem: 'Oferta criada com sucesso!' });
  } catch (error) {
    console.error('Erro ao criar oferta:', error);
    res.status(500).json({ mensagem: 'Erro ao criar oferta.' });
  }
};


// Ajuste no backend para permitir edição parcial com PATCH
export const atualizarOferta = async (req, res) => {
  const { id_oferta, imagem_url, quantidade, valor } = req.body;

  if (!id_oferta) {
    return res.status(400).json({ mensagem: 'ID da oferta é obrigatório.' });
  }

  try {
    const updateFields = [];
    const updateValues = [];

    if (imagem_url) {
      updateFields.push('imagem_url = ?');
      updateValues.push(imagem_url);
    }
    if (quantidade !== undefined) {
      const quantidadeNumero = parseInt(quantidade, 10);
      if (isNaN(quantidadeNumero) || quantidadeNumero <= 0) {
        return res.status(400).json({ mensagem: 'Quantidade deve ser um número maior que zero.' });
      }
      updateFields.push('quantidade = ?');
      updateValues.push(quantidadeNumero);
    }
    if (valor !== undefined) {
      const valorNumero = parseFloat(valor);
      if (isNaN(valorNumero) || valorNumero <= 0) {
        return res.status(400).json({ mensagem: 'Valor deve ser um número maior que zero.' });
      }
      updateFields.push('valor = ?');
      updateValues.push(valorNumero);
    }

    updateValues.push(id_oferta);

    if (updateFields.length === 0) {
      return res.status(400).json({ mensagem: 'Nenhum campo para atualizar.' });
    }

    const query = `UPDATE ofertas SET ${updateFields.join(', ')} WHERE id_oferta = ?`;
    const [resultado] = await ConexaoMySql.execute(query, updateValues);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Oferta não encontrada.' });
    }

    res.status(200).json({ mensagem: 'Oferta atualizada com sucesso.' });
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