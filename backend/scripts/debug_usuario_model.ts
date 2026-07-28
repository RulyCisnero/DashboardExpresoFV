import { UsuarioModel } from '../src/models/usuario/usuarioModel.ts';

async function run() {
  const usuario = await UsuarioModel.getUsuarioWithPasswordByEmail('admin@test.com');
  console.log('usuario', usuario);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
