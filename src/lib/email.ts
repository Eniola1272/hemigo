export async function sendEmail({to,subject,html}:{to:string;subject:string;html:string}){
  const key=process.env.EMAIL_PROVIDER_API_KEY;
  if(!key){
    console.info(`[Hemigo email pending domain] ${subject} → ${to}`);
    return;
  }
  try {
    const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${key}`,"Content-Type":"application/json"},body:JSON.stringify({from:process.env.EMAIL_FROM||"Hemigo <hello@hemigo.ng>",to,subject,html})});
    if(!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.warn(`[Hemigo email warning] Status ${response.status}: ${errorText}`);
    }
  } catch (error) {
    console.warn("[Hemigo email dispatch failed]", error);
  }
}

export async function sendOrderReceiptEmail(order:{customerEmail:string|null;orderNumber:string;publicToken:string}){
  if(!order.customerEmail)return;
  const url=`${process.env.NEXT_PUBLIC_APP_URL}/receipt/${order.publicToken}`;
  await sendEmail({to:order.customerEmail,subject:`Receipt for order ${order.orderNumber}`,html:`<p>Your Hemigo payment is confirmed.</p><p><a href="${url}">View your payment receipt</a></p>`});
}
