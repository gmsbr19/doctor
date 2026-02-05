from pydantic import BaseModel, Field, field_validator
from datetime import datetime

class ContratoInput(BaseModel):
    """
    Schema que valida os dados de entrada.
    Se faltar um campo ou o tipo estiver errado, o Pydantic grita (lança erro).
    """
    # Dados do Cliente
    nome_cliente: str = Field(..., min_length=3, description="Nome completo ou Razão Social")
    estado_civil: str = "N/A"
    profissao: str
    n_rg: str
    n_cpf: str 
    endereco: str
    email: str
    
    # Dados do Contrato
    objeto_descricao: str
    honorarios_valor_total: str # Poderia ser Decimal, mas mantemos str por enquanto para formatação
    honorarios_qtd_parcelas: int = Field(..., gt=0) # Deve ser maior que 0
    honorarios_valor_parcela: str
    honorarios_data_inicio: str

    # Campo calculado automaticamente (opcional)
    data_extenso: str = Field(default_factory=lambda: datetime.now().strftime('%d de %B de %Y'))

    # Exemplo de validação extra: Garantir que CPF tem formato básico
    @field_validator('n_cpf')
    def validar_formato_cpf(cls, v):
        if len(v) < 11:
            raise ValueError('CPF/CNPJ muito curto')
        return v