import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verificar autenticación
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: "No autorizado" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const {
      token_id,
      amount_cents,
      email,
      descripcion,
      order_data,
    } = await req.json();

    if (!token_id || !amount_cents || !email || !order_data) {
      return new Response(
        JSON.stringify({ success: false, error: "Faltan datos requeridos" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── 1. Cobrar con Culqi ──────────────────────────────────────────────────
    const culqiRes = await fetch("https://api.culqi.com/v2/charges", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("CULQI_PRIVATE_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount_cents,          // en céntimos (soles × 100)
        currency_code: "PEN",
        email: email,
        source_id: token_id,
        description: descripcion,
        metadata: {
          plataforma: "pitbox",
          producto: order_data.nombre_producto || "",
          repuestero: order_data.nombre_tienda || "",
        },
      }),
    });

    const culqiData = await culqiRes.json();

    // Culqi retorna object:'charge' y outcome.type:'venta_exitosa' en cobros OK
    const pagoExitoso =
      culqiData.object === "charge" &&
      culqiData.outcome?.type === "venta_exitosa";

    if (!pagoExitoso) {
      const mensajeError =
        culqiData.user_message ||
        culqiData.merchant_message ||
        "Pago rechazado";
      return new Response(
        JSON.stringify({ success: false, error: mensajeError }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── 2. Crear orden en la base de datos ───────────────────────────────────
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: orden, error: ordenError } = await supabase
      .from("ordenes")
      .insert({
        comprador_id: order_data.comprador_id,
        repuestero_id: order_data.repuestero_id,
        producto_id: order_data.producto_id,
        vehiculo_id: order_data.vehiculo_id || null,
        cantidad: order_data.cantidad,
        precio_unitario: order_data.precio_unitario,
        precio_total: order_data.precio_total,
        precio_total_con_comision: amount_cents / 100,
        comision_pitbox: order_data.comision_pitbox,
        tipo_entrega: order_data.tipo_entrega,
        nombre_comprador: order_data.nombre_comprador,
        telefono_comprador: order_data.telefono_comprador,
        direccion_entrega: order_data.direccion_entrega || null,
        notas: order_data.notas || null,
        estado: "confirmado",
        estado_pago: "pagado",
        culqi_charge_id: culqiData.id,
      })
      .select()
      .single();

    if (ordenError) throw new Error(ordenError.message);

    // ── 3. Registrar en historial del vehículo ───────────────────────────────
    if (order_data.vehiculo_id) {
      await supabase.from("historial_compras").insert({
        vehiculo_id: order_data.vehiculo_id,
        usuario_id: order_data.comprador_id,
        producto: order_data.nombre_producto,
        descripcion: order_data.descripcion_producto || "",
        precio: order_data.precio_unitario,
        tienda: order_data.nombre_tienda,
        fecha_compra: new Date().toISOString().split("T")[0],
      });
    }

    return new Response(
      JSON.stringify({ success: true, orden_id: orden.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
