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

exports.getAllQR = async () => {
  const { data, error } = await supabase
    .from("qr_codes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("GET HISTORY ERROR:", error);
    throw error;
  }

  return data || [];
};