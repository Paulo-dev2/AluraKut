import { SiteClient } from 'datocms-client';

export default async function receberDeRequests (request,response) {
    if (request.method === 'POST') {
        console.log("Servidor é: " + request.body)
        const TOKEN = "d4be0f9a3924ed6c69358a9791dc2b";
        const client = new SiteClient(TOKEN);
    
        const registroCriado = await client.items.create({
            itemType: "1124563",
            ...request.body,
        })
    
        console.log(registroCriado);
    
        response.json({
            registroCriado:registroCriado,
        })
    }

    response.status(404).json({
        message:"Ainda não temos nada no GET, mas no POST tem"
    })
}