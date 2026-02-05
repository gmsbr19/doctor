from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os

from app.infrastructure.repository import JsonRepository
from app.services.formatter import DocxStyleFormatter
from app.services.generator import ContractGenerator
from app.domain.schemas import ContratoInput

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # A origem do frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_PATH = os.path.join(BASE_DIR, 'assets', 'templates', 'Contrato de Honorários Advocatícios.docx')
JSON_PATH = os.path.join(BASE_DIR, 'assets', 'data', 'banco_clausulas.json')
OUTPUT_PATH = os.path.join(BASE_DIR, 'output')

os.makedirs(OUTPUT_PATH, exist_ok=True)

repo = JsonRepository(JSON_PATH)
formatter = DocxStyleFormatter(font_name='Arial')
generator = ContractGenerator(TEMPLATE_PATH, repo, formatter)

@app.post("/generate-contract")
async def gerar_contrato_endpoint(dados: ContratoInput):
    """
    Recebe o JSON do frontend, valida com Pydantic e retorna o DOCX.
    """
    try:
        # 1. Define o nome do arquivo
        filename = f"Contrato_{dados.nome_cliente.replace(' ', '_')}.docx"
        file_path = os.path.join(OUTPUT_PATH, filename)
        
        # 2. Gera o contrato (transforma o objeto Pydantic em dict)
        generator.generate(dados.model_dump(), file_path)
        
        # 3. Retorna o arquivo como download
        return FileResponse(
            path=file_path, 
            filename=filename, 
            media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
    
    except Exception as e:
        # Se der erro, o frontend recebe um 500 com a mensagem
        raise HTTPException(status_code=500, detail=str(e))