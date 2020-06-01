import 'dotenv/config';
import { docopt } from 'docopt';
import pkg from '../package.json';
import dump from './dump/command';
import check from './check/command';
import wpImport from './wpImport/command';
import contentfulImport from './contentfulImport/command';
import toggleMaintenanceMode from './toggleMaintenanceMode/command';

const doc = `
DatoCMS CLI tool

Usage:
  dato dump [--watch] [--verbose] [--preview] [--token=<apiToken>] [--environment=<environment>] [--config=<file>]
  dato new migration
  dato migrate [--source=<sourceEnvironment>] [--destination=<destinationEnvironment>] [--inPlace] [--migrations=<directory>] [--token=<apiToken>]
  dato maintenance (on|off) [--force] [--token=<apiToken>]
  dato wp-import --token=<datoApiToken> [--environment=<datoEnvironment>] --wpUrl=<url> --wpUser=<user> --wpPassword=<password>
  dato contentful-import --datoCmsToken=<apiToken> [--datoCmsEnvironment=<datoEnvironment>] --contentfulToken=<apiToken> --contentfulSpaceId=<spaceId> [--skipContent]
  dato check
  dato -h | --help
  dato --version
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
    } = options;

    return contentfulImport(
      contentfulToken,
      contentfulSpaceId,
      datoCmsToken,
      datoCmsEnvironment,
      skipContent,
    );
  }

  return false;
})();
