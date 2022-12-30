import { RequestHandler } from "express";
import { Metadata } from "../constant";


export function use(middleware:RequestHandler){
    return function(target:any,key:string,desc:PropertyDescriptor){
        const middlewares=Reflect.getMetadata(Metadata.middleware,target,key) || []

        Reflect.defineMetadata(Metadata.middleware,[...middlewares,middleware],target,key)
    }
}