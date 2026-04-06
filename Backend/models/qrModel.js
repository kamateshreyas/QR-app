const supabase = require("../database/db");

exports.createQR = async (type, content, qr_code = "", files = []) => {
  const { data, error } = await supabase
    .from("qr_codes")
    .insert([
      {
        type,
        content,
        qr_code,
      }
    ])
    .select();

  if (error) throw error;

  return data;
};

exports.getAllQR = async () => {
  const { data, error } = await supabase
    .from("qr_codes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
};