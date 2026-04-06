const supabase = require("../database/db");

exports.createQR = async (type, content, qr_code = "", files = []) => {
  const { data, error } = await supabase
    .from("qr_codes")
    .insert([
      {
        type,
        content,
        qr_code,
        files
      }
    ])
    .select();

  if (error) {
    console.error("DB ERROR:", error);
    throw error;
  }

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