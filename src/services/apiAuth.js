import supabase from "./supabase";

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(error.message);

  return data;
}

export async function getCurrentUser() {
  // check if there's an existing session
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;
  // if there is get user details
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);

  return data?.user;
}

export async function logout() {
  let { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function signUp({ email, password, fullname = "" }) {
  let { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw new Error(error.message);
  return data?.user;
}
