from datetime import datetime
import os
import sys

diretorio_atual = os.path.dirname(os.path.abspath(__file__))

# Adiciona esse diretório ao sistema de busca do Python
if diretorio_atual not in sys.path:
    sys.path.append(diretorio_atual)

from app.infrastructure.repository import JsonRepository
from app.services.formatter import DocxStyleFormatter
from app.services.generator import ContractGenerator
from app.domain.schemas import ContratoInput

# Caminhos absolutos (Prática recomendada para evitar erro de "file not found")
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_PATH = os.path.join(BASE_DIR, 'assets', 'templates', 'Contrato de Honorários Advocatícios.docx')
JSON_PATH = os.path.join(BASE_DIR, 'assets', 'data', 'banco_clausulas.json')
OUTPUT_PATH = os.path.join(BASE_DIR, 'output')

def run():
    # Garante que a pasta output existe
    os.makedirs(OUTPUT_PATH, exist_ok=True)

    # 1. Instanciação (Injeção de Dependência)
    repo = JsonRepository(JSON_PATH)
    formatter = DocxStyleFormatter(font_name='Arial')
    
    generator = ContractGenerator(TEMPLATE_PATH, repo, formatter)

    # 2. Dados Mock (futuramente virão do FastAPI)
    try:
        dados_seguros = ContratoInput(
            nome_cliente="Empresa SOLID Ltda",
            estado_civil="N/A",
            profissao="Consultoria de Software",
            n_rg="Isento",
            n_cpf="12.345.678/0001-90",
            endereco="Av. Paulista, 1000",
            email="contato@solid.com.br",
            
            objeto_descricao="consultoria técnica em arquitetura limpa",
            honorarios_valor_total="15.000,00",
            honorarios_qtd_parcelas=3,
            honorarios_valor_parcela="5.000,00",
            honorarios_data_inicio="01/05/2026"
            # data_extenso é gerado sozinho pelo default_factory
        )
        
        print("Dados validados com sucesso!")
        
    except Exception as e:
        print(f"Erro nos dados de entrada: {e}")
        return

    # Passamos .model_dump() para converter de volta para dict 
    # pois o ContractGenerator espera um dicionário para fazer o replace
    caminho_final = os.path.join(OUTPUT_PATH, "Contrato_Seguro.docx")
    generator.generate(dados_seguros.model_dump(), caminho_final)

if __name__ == "__main__":
    run()