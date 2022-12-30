import { Router } from "../Router";
import { Metadata, Methods } from "../constant";
import { NextFunction, Request, RequestHandler, Response } from "express";

function bodyValidators(keys: string): RequestHandler {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!req.body) {
      res.status(422).send("Invalid Request");
      return;
    }

    for (let key of keys) {
      if (!req.body[key]) {
        res.status(422).send(`Missing Property ${key}`);
        return;
      }
    }

    next();
  };
}

export function controller(prefix: string) {
  return function (target: Function) {
    const router = Router.getInstance();

    for (let key in target.prototype) {
      const handler = target.prototype[key];
      const path = Reflect.getMetadata(Metadata.path, target.prototype, key);
      const method: Methods = Reflect.getMetadata(
        Metadata.method,
        target.prototype,
        key
      );
      const middlewares =
        Reflect.getMetadata(Metadata.middleware, target.prototype, key) || [];
      const bodyProps =
        Reflect.getMetadata(Metadata.validator, target.prototype, key) || [];

      const validator = bodyValidators(bodyProps);

      if (path) {
        router[method](`${prefix}${path}`, ...middlewares, validator, handler);
      }
    }
  };
}
