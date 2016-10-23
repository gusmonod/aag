import easyimg from 'easyimage';
import logger from 'winston';
import mkdirpCb from 'mkdirp';
import moment from 'moment';
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

const getLastModified = async (filename) => {
  const dateStrings = await easyimg.exec(`identify -format "%[exif:DateTime*]" ${filename}`);
  const dates = [];

  dateStrings.split('\n').forEach(dateString => {
    if (dateString.length > 0) {
      dates.push(moment(dateString, 'YYYY:MM:DD HH:mm:ss'));
    }
  });

  if (dates.length > 0) {
    return moment.min(dates).format('YYYY-MM-DD_HH.mm.ss');
  } else {
    return 'unknown';
  }
};

router.post('/', async (req, res, next) => {
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

    logger.info(fields);

    const [email,] = fields.email;
    const unacceptedChars = /[^a-zA-Z0-9.-]/g;
    const uploadDir = `uploaded/${email}/${ip}`;
    await mkdirp(uploadDir);

    if (!emailRegex.test(email)) {
      const err = new Error(`Invalid email: ${email}`);
      err.email = email;
      err.statusCode = 400;  // Bad request
      throw err;
    }

    let i = 0;
    for (let [file,] of Object.values(files)) {
      try {
        const info = await easyimg.info(file.path);
        const lastModified = await getLastModified(i, fields, file);
        const sanitizedName = file.originalFilename.replace(unacceptedChars, '-');
        const destFilePath = `${uploadDir}/${lastModified}_${sanitizedName}`;
        logger.info(`creating: ${destFilePath}`);
        await fs.rename(info.path, destFilePath);
      } catch (err) {
        logger.error(`ip: ${ip} err: ${err}`);
        err.shortMessage = err.message;
        return next(err);
      } finally {
        ++i;
      }
    }

    res.writeHead(200, {'content-type': 'text/plain',});
    res.end('files received');

  } catch (err) {
    switch (err.statusCode) {
    case 415:
      return;  // Ignore Unsupported Media Type
    case 413:  // Payload too large
      err.shortMessage = 'Lot d\'images trop grand';
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
