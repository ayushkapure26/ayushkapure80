export async function request(path,method='GET',body){
 const response=await fetch(`/api${path}`,{method,credentials:'same-origin',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined});
 let data;try{data=await response.json()}catch{throw new Error('Server unavailable. Please retry.');}
 if(!response.ok){const error=new Error(data.error||'Request failed.');error.status=response.status;throw error;}
 return data;
}
