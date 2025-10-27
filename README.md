# 🛍️ Mini Enjoei API

API REST inspirada na plataforma **Enjoei**, desenvolvida em **Node.js + Express** com **MySQL**.  
O foco é permitir que usuários publiquem produtos e **negociem preços** via propostas que o vendedor pode **aceitar** ou **recusar**.

> Projeto acadêmico desenvolvido para a faculdade, com foco em autenticação JWT, rotas protegidas e integração com banco de dados relacional.

---

## ✨ Principais recursos
- **Cadastro & Login** com **JWT**, usando uma chave fixa (`KEY = 'borapracima'`) apenas para fins didáticos.  
- **Produtos**: criação, listagem, atualização e exclusão de produtos, com upload de imagem.  
- **Negociação**: envio, aceite e recusa de **propostas** de compra.  
- **Senha criptografada via `MD5()` diretamente no MySQL**.  

---

## 🧰 Tecnologias
- **Node.js** + **Express**
- **MySQL** (`mysql2`)
- **JWT** (`jsonwebtoken`)
- **dotenv**, **cors**, **multer**
- **nodemon** (modo desenvolvimento)

> Scripts SQL do banco estão em `sql/` (importe antes de iniciar a API).

---

## ⚙️ Configuração e execução

1️⃣ **Instalar dependências**
```bash
npm install
```

2️⃣ **Configurar variáveis de ambiente**
Crie um arquivo `.env` na raiz:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=mini_enjoei
DB_PORT=3306
PORT=5010
```

3️⃣ **Executar servidor**
```bash
npm start
```

A API iniciará em `http://localhost:5010`.

---

## 🔑 Autenticação
Após o login, um **token JWT** é retornado e deve ser enviado no header:

```
x-access-token: <seu_token>
```

---

## 📡 Endpoints

### 👤 **Usuários**
| Método | Rota | Descrição |
|--------|------|-----------|
- `POST /usuario/registrar` — cadastrar novo usuário.  
- `POST /usuario/login` — autenticar e retornar JWT.  

---

### 🛒 **Produtos**
| Método | Rota | Descrição |
|--------|------|-----------|
| **POST** | `/produtos` | Cria um produto (campos: `nome`, `descricao`, `preco`, `id_categoria`, `imagem`) — requer autenticação |
| **GET** | `/produtos` | Lista todos os produtos cadastrados |
| **PUT** | `/produtos/:id` | Atualiza um produto — apenas o vendedor pode alterar |
| **DELETE** | `/produtos/:id` | Exclui um produto — apenas o vendedor pode excluir |
| **GET** | `/produtos-disponiveis` | Lista produtos disponíveis, com filtros opcionais (`nome`, `preco_min`, `preco_max`), excluindo os do usuário logado |
| **GET** | `/meus-produtos` | Lista produtos do usuário autenticado |

---

### 💬 **Propostas**
| Método | Rota | Descrição |
|--------|------|-----------|
| **POST** | `/propostas` | Envia uma proposta (`id_produto`, `valor_ofertado`, `mensagem`) — comprador autenticado |
| **PUT** | `/propostas/:id/aceitar` | Aceita uma proposta — apenas o vendedor do produto |
| **PUT** | `/propostas/:id/recusar` | Recusa uma proposta — apenas o vendedor do produto |
| **GET** | `/produtos/:id/propostas` | Lista propostas recebidas para um produto — apenas o vendedor pode visualizar |

---

## 🧪 Testes rápidos
- Use **Thunder Client** (VSCode) ou **Postman**.  
- Configure o `x-access-token` com o JWT retornado pelo login.  
- Para upload de imagem, envie o campo `imagem` via **form-data**.  

Exemplo de criação de produto:
```json
{
  "nome": "Tênis Nike Air",
  "descricao": "Tamanho 42, em ótimo estado",
  "preco": 250,
  "id_categoria": 3
}
```

---

## 🗃️ Estrutura do projeto
```
src/
  config/          # conexão MySQL e dotenv
  controllers/     # lógica de negócio
  Utils/     # autenticação JWT, validações
  models/          # queries SQL e repositórios
  routes/          # definição de rotas (usuarios, produtos, propostas)
  server.js        # inicialização do servidor
sql/               # scripts de criação e inserts do banco
```

---

## 📄 Observações
Este projeto foi desenvolvido para fins **acadêmicos**, como parte de um trabalho prático do curso de Análise e Desenvolvimento de Sistemas.  
Por isso, algumas simplificações foram adotadas — como uso de **MD5** e uma chave JWT fixa.

---

## 👤 Autor
**Bryan Mendes Pinheiro**  
Estudante de Análise e Desenvolvimento de Sistemas – Senac  
📫 [LinkedIn](https://www.linkedin.com/in/bryanpinheiro77)  
📦 [GitHub](https://github.com/BryanPinheiro77)

---

⭐ *Se gostou do projeto, deixe uma estrela no repositório!*
