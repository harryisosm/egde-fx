const config = {
  development: {
    apiUrl: 'http://127.0.0.1:8000/api',
  },
  production: {
    apiUrl: 'https://bidding-compute-mar-fu.trycloudflare.com/api',
  },
};

const env = process.env.NODE_ENV || 'development';
console.log('Current environment:', env);
console.log('Using API URL:', config[env].apiUrl);

export default config[env]; 