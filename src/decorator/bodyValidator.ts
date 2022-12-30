import { Metadata } from "../constant"

export function bodyValidator(...keys:string[]){
    return function(target:any,key:string,desc:PropertyDescriptor){
        Reflect.defineMetadata(Metadata.validator,keys,target,key)
    }
}