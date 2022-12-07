CREATE DATABASE dindin;

CREATE TABLE usuarios (
	id SERIAL PRIMARY KEY,
  	nome TEXT NOT NULL,
  	email TEXT NOT NULL UNIQUE,
  	senha TEXT NOT NULL
);

CREATE TABLE categorias (
	id SERIAL PRIMARY KEY,
  	descricao TEXT
);

CREATE TABLE transacoes (
	id SERIAL PRIMARY KEY,
  	descricao VARCHAR(30),
  	valor NUMERIC CHECK (valor > 0) NOT NULL,
  	data_transacao DATE DEFAULT now(),
  	categoria_id INTEGER REFERENCES categorias(id),
  	usuario_id INTEGER REFERENCES usuarios(id),
  	tipo VARCHAR(40) NOT NULL
);

INSERT INTO categorias (descricao)
VALUES 
  ('Alimentação'),
  ('Assinaturas e Serviços'),
  ('Casa'),
  ('Mercado'),
  ('Cuidados Pessoais'),
  ('Educação'),
  ('Família'),
  ('Lazer'),
  ('Pets'),
  ('Presentes'),
  ('Roupas'),
  ('Saúde'),
  ('Transporte'),
  ('Salário'),
  ('Vendas'),
  ('Outras receitas'),
  ('Outras despesas');