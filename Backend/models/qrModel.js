const supabase = require("../database/db");

exports.createQR = async (type, content, qr_code) => {
  const { data, error } = await supabase
    .from("qr_codes")
    .insert([{ type, content, qr_code }]);

  if (error) {
    console.error("SUPABASE INSERT ERROR:", error);
    throw error;
  }

  return data;
};

exports.getAllQR = async () => {
  const { data, error } = await supabase
    .from("qr_codes")
    .select("*")
    .order("created_at", { ascending: false });

  console.log("Supabase data:", data);
  console.log("Supabase error:", error);

  if (error) {
    throw error;
  }

  return data;
};