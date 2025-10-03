
import { getUploadAuthParams } from "@imagekit/next/server"

export async function GET() {
    
   try {
     const authenticationparameter = getUploadAuthParams({
         privateKey: process.env.IMAGE_KIT_PRIVATE_KEY as string,
         publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY as string,
         
     })
 
     return Response.json(
         { 
             authenticationparameter,
             publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
             urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
         }
     )
   } catch (error) {
    return Response.json(
         { 
             error: "ImageKit authentication failed"
         }
     )
   }
}