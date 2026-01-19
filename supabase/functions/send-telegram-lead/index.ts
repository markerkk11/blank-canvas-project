import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadData {
  firstname: string;
  lastname: string;
  phone: string;
  products: Array<{
    name: string;
    quantity: string;
    unit: string;
  }>;
  message?: string;
  totalPrice?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const leadData: LeadData = await req.json();
    console.log("Received lead data:", leadData);

    const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const chatId = Deno.env.get("TELEGRAM_CHAT_ID");

    if (!botToken || !chatId) {
      console.error("Missing Telegram configuration");
      return new Response(
        JSON.stringify({ error: "Telegram configuration missing" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Format products list
    const productsList = leadData.products
      .map(p => `  • ${p.name}: ${p.quantity} ${p.unit}`)
      .join("\n");

    // Create message
    const message = `🛒 *Ny köpförfrågan!*

👤 *Kontaktinfo:*
  Namn: ${leadData.firstname} ${leadData.lastname}
  Telefon: ${leadData.phone}

📦 *Produkter:*
${productsList}

💰 *Totalt ordervärde:* ${leadData.totalPrice || "Ej beräknat"}

${leadData.message ? `💬 *Meddelande:*\n${leadData.message}` : ""}

📅 Datum: ${new Date().toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" })}`;

    // Send to Telegram
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const telegramResponse = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    const telegramResult = await telegramResponse.json();
    console.log("Telegram response:", telegramResult);

    if (!telegramResult.ok) {
      console.error("Telegram API error:", telegramResult);
      return new Response(
        JSON.stringify({ error: "Failed to send Telegram message", details: telegramResult }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Lead sent to Telegram" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-telegram-lead function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
