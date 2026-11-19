// Error validasi Laravel: { errors: { email: ["pesan"] } }
export const fieldError = (err, name) => err?.errors?.[name]?.[0];

// Pesan umum (bukan error per kolom), misalnya 401, 429, atau jaringan putus
export const generalError = (err) => (err && !err.errors ? err.message : null);