'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

// Interface que espelha o nosso Schema Pydantic do Python
interface FormData {
  nome_cliente: string;
  estado_civil: string;
  profissao: string;
  n_rg: string;
  n_cpf: string;
  endereco: string;
  email: string;
  objeto_descricao: string;
  honorarios_valor_total: string;
  honorarios_qtd_parcelas: number;
  honorarios_valor_parcela: string;
  honorarios_data_inicio: string;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nome_cliente: '',
    estado_civil: '',
    profissao: '',
    n_rg: '',
    n_cpf: '',
    endereco: '',
    email: '',
    objeto_descricao: '',
    honorarios_valor_total: '',
    honorarios_qtd_parcelas: 1,
    honorarios_valor_parcela: '',
    honorarios_data_inicio: '',
  });

  // Função genérica para atualizar os inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'honorarios_qtd_parcelas' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Conecta com o FastAPI (certifique-se que o uvicorn está rodando na porta 8000)
      const response = await fetch('http://localhost:8000/generate-contract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Erro: ${JSON.stringify(errorData)}`);
        throw new Error('Erro na API');
      }

      // Recebe o arquivo (Blob) e força o download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Contrato_${formData.nome_cliente.replace(/\s+/g, '_')}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error(error);
      alert('Falha ao gerar o contrato. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
        
        {/* Cabeçalho */}
        <div className="bg-slate-900 py-6 px-8">
          <h1 className="text-2xl font-bold text-white">Gerador de Contratos Jurídicos</h1>
          <p className="text-slate-400 text-sm mt-1">Preencha os dados abaixo para gerar a minuta em DOCX.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* Seção 1: Dados do Cliente */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">Dados do Cliente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo / Razão Social</label>
                <input
                  required
                  type="text"
                  name="nome_cliente"
                  value={formData.nome_cliente}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Fulano de Tal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CPF / CNPJ</label>
                <input
                  required
                  type="text"
                  name="n_cpf"
                  value={formData.n_cpf}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="000.000.000-00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">RG / IE</label>
                <input
                  required
                  type="text"
                  name="n_rg"
                  value={formData.n_rg}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="00.000.000-0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Estado Civil</label>
                <select
                  name="estado_civil"
                  value={formData.estado_civil}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="Solteiro(a)">Solteiro(a)</option>
                  <option value="Casado(a)">Casado(a)</option>
                  <option value="Divorciado(a)">Divorciado(a)</option>
                  <option value="Viúvo(a)">Viúvo(a)</option>
                  <option value="N/A">N/A (Pessoa Jurídica)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Profissão / Ramo</label>
                <input
                  required
                  type="text"
                  name="profissao"
                  value={formData.profissao}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Endereço Completo</label>
                <input
                  required
                  type="text"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Rua, Número, Bairro, Cidade - UF"
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Seção 2: Detalhes do Contrato */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">Objeto e Honorários</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="col-span-1 md:col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição do Objeto (Ação/Serviço)</label>
                <textarea
                  required
                  rows={3}
                  name="objeto_descricao"
                  value={formData.objeto_descricao}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Ação de cobrança indevida c/c danos morais..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Valor Total (R$)</label>
                <input
                  required
                  type="text"
                  name="honorarios_valor_total"
                  value={formData.honorarios_valor_total}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="5.000,00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Qtd. Parcelas</label>
                <input
                  required
                  type="number"
                  min="1"
                  name="honorarios_qtd_parcelas"
                  value={formData.honorarios_qtd_parcelas}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Valor da Parcela (R$)</label>
                <input
                  required
                  type="text"
                  name="honorarios_valor_parcela"
                  value={formData.honorarios_valor_parcela}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1.000,00"
                />
              </div>

              <div className="col-span-1 md:col-span-3">
                 <label className="block text-sm font-medium text-slate-700 mb-1">Data de Início do Pagamento</label>
                 <input
                  required
                  type="date"
                  name="honorarios_data_inicio"
                  value={formData.honorarios_data_inicio}
                  onChange={handleChange}
                  className="w-full md:w-1/3 rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

            </div>
          </div>

          {/* Botão de Ação */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-md text-white font-bold transition-colors ${
                loading 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Gerando Documento...
                </span>
              ) : (
                'Gerar Contrato .DOCX'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}