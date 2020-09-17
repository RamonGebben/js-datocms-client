import SiteClient from '../../site/SiteClient';

export default async function command({ token: tokenByArg, cmaBaseUrl }) {
  const token = tokenByArg || process.env.DATO_MANAGEMENT_API_TOKEN;
  const client = new SiteClient(token, {}, cmaBaseUrl);

  try {
    const allEnvs = await client.environments.all();
    const primaryEnv = allEnvs.find(({ meta: { primary } }) => primary);
    process.stdout.write(primaryEnv.id);
  } catch (error) {
    process.stderr.write(error.message);
    process.exit(1);
  }
}
