const express = require('express');
const fetchCookie = require('fetch-cookie').default;
const { CookieJar } = require('tough-cookie');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

async function autenticar(fetchWithCookies) {
  const res = await fetchWithCookies(
    'https://webhook.automindhub.com.br/webhook/app/auth',
    {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        email: process.env.EMAIL,
        password: process.env.PASSWORD
      })
    }
  );

  if (!res.ok) {
    throw new Error('Falha na autenticação');
  }
}

async function getInstances(fetchWithCookies) {
  const res = await fetchWithCookies(
    'https://webhook.automindhub.com.br/webhook/api/get-instance'
  );

  if (!res.ok) {
    throw new Error('Erro ao buscar instâncias');
  }

  return res.json();
}

/* =========================
   ENDPOINT ÚNICO
========================= */

app.get('/instances', async (req, res) => {
  try {
    console.log('Recebida requisição para /instances');
    // cookie isolado por request
    const jar = new CookieJar();
    const fetchWithCookies = fetchCookie(fetch, jar);

    await autenticar(fetchWithCookies);
    const instances = await getInstances(fetchWithCookies);

    return res.json(instances);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ erro: err.message });
  }
});

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
