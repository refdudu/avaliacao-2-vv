# Projeto de Gerenciamento de Usuários e Inventário (Full-Stack TDD)

Este repositório contém uma aplicação `full-stack` completa, desenvolvida com o paradigma de Test-Driven Development (TDD). O projeto gerencia um sistema de usuários e seus respectivos inventários de produtos, demonstrando uma separação clara de responsabilidades entre o *backend* (API) e o *frontend* (UI), e uma cobertura de testes exaustiva em múltiplos níveis.

## 1. Visão Geral da Arquitetura

O projeto é estruturado como um monorepo, contendo duas unidades principais:

1.  **Backend (API)**: (Raiz do projeto: `/`)
    * **Tecnologia**: Node.js, Express e TypeScript.
    * **Lógica**: `src/` contém a lógica de negócios pura (`UserManager`, `InventoryManager`), isolada e testada unitariamente.
    * **Servidor**: `src/serverr.ts` expõe a lógica de negócios como uma API REST.

2.  **Frontend (Web)**: (Subdiretório: `/web`)
    * **Tecnologia**: React 19, Vite e TypeScript.
    * **Estilização**: TailwindCSS.
    * **Padrões**: A lógica da UI é gerenciada por *Hooks* customizados (`useUsers`, `useProductMain`) e serviços (`userService`, `userProductService`) que consomem a API.

3.  **Testes (End-to-End)**: (Raiz do projeto: `/e2e`)
    * **Tecnologia**: Playwright para testes E2E.
    * **Configuração**: O Playwright está configurado para iniciar automaticamente o servidor *frontend* (Vite) durante a execução dos testes.

---

## 2. Pré-requisitos

Antes de iniciar, garanta que você possui os seguintes softwares instalados:

* **Node.js**: v18.0.0 ou superior.
* **npm** (v10+) ou **Yarn Classic** (v1.22+).

Os comandos abaixo utilizarão `npm`, mas podem ser substituídos por `yarn` se preferir.

---

## 3. Instalação

O projeto requer a instalação de dependências em **duas** localizações (na raiz para o Backend/Testes e em `/web` para o Frontend).

### Passo 1: Instalar Dependências do Backend e Testes

Na raiz do projeto, execute:

```bash
# Instala dependências do backend (Express, TSX),
# dependências de teste (Jest, Playwright) e a lógica de negócios.
npm install
```

### Passo 2: Instalar Dependências do Frontend

Navegue até o subdiretório `web` e instale suas dependências:

```bash
# Navega para a pasta do frontend
cd web

# Instala dependências do frontend (React, Vite, Axios, etc.)
npm install

# Retorna ao diretório raiz
cd ..
```

---

## 4. Executando a Aplicação (Ambiente de Desenvolvimento)

Para executar a aplicação completa, você precisará de **dois terminais** abertos simultaneamente.

### Terminal 1: Executando o Backend (API)

No primeiro terminal, a partir da **raiz do projeto**, inicie o servidor da API:

```bash
# Inicia o servidor da API em modo "watch" usando tsx
npm run serverr
```

* O servidor da API estará disponível em: `http://localhost:3000`.
* O frontend está configurado para se comunicar com este endereço.

### Terminal 2: Executando o Frontend (UI)

No segundo terminal, navegue até a pasta `/web` e inicie o servidor de desenvolvimento do Vite:

```bash
# Navega para a pasta do frontend
cd web

# Inicia o servidor de desenvolvimento do Vite
npm run dev
```

* O servidor do frontend estará disponível em: `http://localhost:5173`.
* Abra este endereço no seu navegador para utilizar a aplicação.

---

## 5. Executando a Suíte de Testes

O projeto possui uma suíte de testes completa, dividida em três categorias.

### 5.1. Testes Unitários e de Integração (Backend - Jest)

Estes testes validam a lógica de negócios pura (`UserManager`, `InventoryManager`) de forma isolada, sem depender da API ou da UI.

Execute a partir da **raiz do projeto**:

```bash
# Executa todos os testes unitários e de integração
npm test
```

Para gerar um relatório de cobertura de testes, execute:

```bash
# O jest.config.js está configurado para 'collectCoverage: true',
# então o comando 'npm test' já gera o relatório.
# O relatório será salvo em /coverage/
npm test
```

### 5.2. Testes End-to-End (E2E - Playwright)

Estes testes simulam um usuário real no navegador, interagindo com o *frontend* e, por consequência, com o *backend*.

**IMPORTANTE:** Para que os testes E2E funcionem, o servidor do **Backend (API) deve estar em execução**.

#### Preparação: Inicie a API

Em um terminal, na **raiz do projeto**, deixe o servidor da API rodando:

```bash
npm run server
# Deixe este terminal aberto
```

#### Execução: Rode os Testes E2E

Em um **segundo terminal**, a partir da **raiz do projeto**, execute um dos seguintes comandos:

Necessario ter o playwright Instalado:
```bash
# Instala o playwright
npx playwright install
```

**1. Execução Headless (Padrão/CI):**

Roda os testes em segundo plano, sem abrir um navegador.

```bash
# Executa a suíte completa de E2E
npm run test:e2e
```

**2. Execução com UI Mode (Recomendado para Debug):**

Abre a interface gráfica do Playwright, permitindo ver cada passo, e inspecionar seletores.

```bash
# Abre o Playwright UI Mode
npm run test:e2e:ui
```

**3. Execução em Modo Debug (Avançado):**

Permite depuração passo a passo.

```bash
# Executa os testes em modo debug
npm run test:e2e:debug
```

*(Nota: O servidor do frontend (Vite) **não** precisa ser iniciado manualmente. A configuração do Playwright (`playwright.config.ts`) é responsável por iniciá-lo e desligá-lo automaticamente durante a execução dos testes E2E.)*