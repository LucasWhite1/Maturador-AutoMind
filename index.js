const fetchCookie = require('fetch-cookie').default;
const { CookieJar } = require('tough-cookie');
const dotenv = require("dotenv");
// carregar variáveis do arquivo .env (se existir)
dotenv.config();

const jar = new CookieJar();

// usa o fetch nativo do Node
const fetchWithCookies = fetchCookie(fetch, jar);

async function autenticar() {
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

  console.log('Auth status:', res.status);
}

async function getInstance() {
  const res = await fetchWithCookies(
    'https://webhook.automindhub.com.br/webhook/api/get-instance'
  );

  const data = await res.json();
  console.log('Instance:', data);
}



(async () => {
  await autenticar();
  await getInstance();
})();
