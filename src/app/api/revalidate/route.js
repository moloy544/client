import { revalidatePath } from 'next/cache'
 
export async function GET(request) {
  const path = request.nextUrl.searchParams.get('path')
 
  if (path) {
 
    revalidatePath(path)
    return Response.json({ 
        revalidated: true,
         now: Date.now(), 
         message: `Path ${path} revalidate successfull`
        })
  }
 
  return Response.json({
    revalidated: false,
    now: Date.now(),
    message: 'Missing path to revalidate',
  })
}