

function Packet(message:string,data?:any):{}{
    if(!data) return {message}
    return {message,data}
}

export {Packet}