import easyimg from 'easyimage';
import logger from 'winston';
import mkdirpCb from 'mkdirp';
import multipartyCb from 'multiparty';
import Promise from 'bluebird';
import promiseRouter from 'express-promise-router';

const mkdirp = Promise.promisify(mkdirpCb);
const multiparty = Promise.promisifyAll(multipartyCb, {multiArgs: true,});

import fsCb from 'fs';

const fs = Promise.promisifyAll(fsCb);

const router = promiseRouter();
export default router;

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

router.post('/', async (req, res, next) => {
  // logger.info(`req #${NB}: ${require('util').inspect(req, {depth: null})}`);
  const ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  const form = new multiparty.Form({
    autoFiles: true,
    maxFilesSize: 25000000,  // 5 files of 5 MB max each
  });

  try {
    const [fields, files,] = await form.parseAsync(req);

    const uploadDir = `uploaded/${fields.email}/${ip}`;
    await mkdirp(uploadDir);

    if (!emailRegex.test(fields.email)) {
      const err = new Error(`Invalid email: ${fields.email}`);
      err.email = fields.email;
      err.statusCode = 400;  // Bad request
      throw err;
    }

    for (let [file,] of Object.values(files)) {
      try {
        const info = await easyimg.info(file.path);
        const lastModified = await easyimg.exec(`identify -format "%[date:modify]" "${file.path}"`);
        const unaccepted = /[^a-zA-Z0-9\/@.-]/g;
        const destFilePath = `${uploadDir}/${lastModified}-${file.originalFilename.replace(unaccepted, '.')}`;
        logger.info(`creating: ${destFilePath}`);
        await fs.rename(info.path, destFilePath);
      } catch (err) {
        logger.error(`ip: ${ip} err: ${err}`);
        err.shortMessage = err.message;
        return next(err);
      }
    }

    res.writeHead(200, {'content-type': 'text/plain',});
    res.end('files received');

  } catch (err) {
    switch (err.statusCode) {
    case 415:
      return;  // Ignore Unsupported Media Type
    case 413:  // Payload too large
      err.shortMessage = 'Image trop grande';
      break;
    case 400:  // Bad request
      err.shortMessage = `Email non valide: ${err.email}`;
      break;
    default:
      break;
    }

    return next(err);
  }
});
