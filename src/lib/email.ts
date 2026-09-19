export async function sendEmail({to,subject,html}:{to:string;subject:string;html:string}){
  const key=process.env.EMAIL_PROVIDER_API_KEY;
  if(!key){if(process.env.NODE_ENV!=="production"){console.info(`[Hemigo email] ${subject} → ${to}\n${html}`);return}throw new Error("Email delivery is not configured.")}
  const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${key}`,"Content-Type":"application/json"},body:JSON.stringify({from:process.env.EMAIL_FROM||"Hemigo <hello@hemigo.ng>",to,subject,html})});
  if(!response.ok)throw new Error("Email delivery failed.");
}
