const supabase = require("../database/db");

exports.createQR = async (type, content, qr_code, files = null) => {
  const { data, error } = await supabase
    .from("qr_codes")
    .insert([{ type, content, qr_code, files }]);

  if (error) throw error;

  return data;
};

exports.getQRById = async (id) => {
  const { data, error } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
};