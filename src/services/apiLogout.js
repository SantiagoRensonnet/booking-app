import supabase from "./supabase";

export async function logout() {
  let { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}
