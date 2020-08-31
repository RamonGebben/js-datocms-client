import 'dotenv/config';
import { docopt } from 'docopt';
import pkg from '../package.json';
import dump from './dump/command';
import check from './check/command';
import wpImport from './wpImport/command';
import contentfulImport from './contentfulImport/command';
import toggleMaintenanceMode from './toggleMaintenanceMode/command';
import createMigrationScript from './createMigrationScript/command';
import runPendingMigrations from './runPendingMigrations/command';
import destroyEnvironment from './destroyEnvironment/command';

const doc = `
DatoCMS CLI tool

Usage:
  dato dump [--watch] [--verbose] [--preview] [--token=<apiToken>] [--environment=<environment>] [--config=<file>]
  dato new migration <name> [--migrationsDir=<directory>]
  dato migrate [--source=<environment>] [--destination=<environment>] [--inPlace] [--migrationModel=<apiKey>] [--migrationsDir=<directory>] [--token=<apiToken>]
  dato environment destroy <environmentId> [--token=<apiToken>]
  dato maintenance (on|off) [--force] [--token=<apiToken>]
  dato wp-import --token=<datoApiToken> [--environment=<datoEnvironment>] --wpUrl=<url> --wpUser=<user> --wpPassword=<password>
  dato contentful-import --datoCmsToken=<apiToken> --contentfulToken=<apiToken> --contentfulSpaceId=<spaceId> [--datoCmsEnvironment=<datoEnvironment>] [--skipContent] [(--includeOnly <contentType>...)]
  dato check
  dato -h | --help
  dato --version

Options:
  --migrationsDir=<directory>   Directory containing the migration scripts [default: ./migrations]
  --migrationModel=<apiKey>     API key of the migration model [default: schema_migration]
`;

(() => {
  const options = docopt(doc, { version: pkg.version });

  if (options.dump) {
    return dump(options);
  }

  if (options.check) {
    return check(options);
  }

  if (options.maintenance) {
    const { on, '--token': token, '--force': force } = options;
    return toggleMaintenanceMode({ activate: on, token, force });
  }

  if (options.new && options.migration) {
    const {
      '<name>': name,
      '--migrationsDir': relativeMigrationsDir,
    } = options;

    return createMigrationScript({ name, relativeMigrationsDir });
  }

  if (options.migrate) {
    const {
      '--source': sourceEnvId,
      '--destination': destinationEnvId,
      '--migrationModel': migrationModelApiKey,
      '--migrationsDir': relativeMigrationsDir,
      '--inPlace': inPlace,
      '--token': token,
    } = options;

    return runPendingMigrations({
      sourceEnvId,
      destinationEnvId,
      inPlace,
      migrationModelApiKey,
      relativeMigrationsDir,
      token,
    });
  }

  if (options.environment && options.destroy) {
    const { '<environmentId>': environmentId, '--token': token } = options;
    return destroyEnvironment({ environmentId, token });
  }

  if (options['wp-import']) {
    const {
      '--token': token,
      '--environment': environment,
      '--wpUrl': wpUrl,
      '--wpUser': wpUser,
      '--wpPassword': wpPassword,
    } = options;

    return wpImport(token, environment, wpUrl, wpUser, wpPassword);
  }

  if (options['contentful-import']) {
    const {
      '--contentfulToken': contentfulToken,
      '--contentfulSpaceId': contentfulSpaceId,
      '--datoCmsToken': datoCmsToken,
      '--datoCmsEnvironment': datoCmsEnvironment,
      '--skipContent': skipContent,
      '--includeOnly': includeOnly,
      '<contentType>': contentType,
    } = options;

    return contentfulImport({
      contentfulToken,
      contentfulSpaceId,
      datoCmsToken,
      datoCmsEnvironment,
      skipContent,
      contentType: includeOnly ? contentType : false,
    });
  }

  return false;
})();
