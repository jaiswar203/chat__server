import { Methods } from "../constant/methods";
import { Metadata } from "../constant/Metadata";
import { RequestHandler } from "express";


interface RouteHandlerDescriptor extends PropertyDescriptor{
    value?:RequestHandler
}

function routeBinder(method:string){
    return function(path:string){
        return function(target:any,key:string,desc:PropertyDescriptor){
            Reflect.defineMetadata(Metadata.path,path,target,key)
            Reflect.defineMetadata(Metadata.method,method,target,key)
        }
    }
}


export const get=routeBinder(Methods.get)
export const post=routeBinder(Methods.post)
export const patch=routeBinder(Methods.patch)
export const del=routeBinder(Methods.delete)