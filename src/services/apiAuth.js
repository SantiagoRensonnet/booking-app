import { filenameAddUniqueSuffix, getFilename } from "../utils/helpers";
import supabase, { supabaseUrl } from "./supabase";

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

export async function updateCurrentUserMetadata({
  fullName,
  avatar: avatarImg,
}) {
  const user = await getCurrentUser();
  //fallback to uploaded image
  let avatar = user?.user_metadata?.avatar;
  if (avatarImg) {
    //upload image
    const relativePath = filenameAddUniqueSuffix(avatarImg.name);
    const absolutePath = `${supabaseUrl}/storage/v1/object/public/avatars/${relativePath}`;
    const { error: fileError } = await supabase.storage
      .from("avatars")
      .upload(relativePath, avatarImg);

    if (fileError)
      throw new Error(`Avatar could not be updated, ${fileError.message}`);

    if (avatar) {
      //delete previous image
      const { error: fileError } = await supabase.storage
        .from("avatars")
        .remove([getFilename(avatar)]);
      if (fileError)
        throw new Error(`Previous avatar image could not been removed`);
    }
    //update avatar absolute path
    avatar = absolutePath;
  }

  const { data, error } = await supabase.auth.updateUser({
    data: { fullName, avatar },
  });

  return data?.user;
}

export async function changePassword({ password }) {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });
}

export async function logout() {
  let { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function signUp({ email, password, fullName = "" }) {
  let { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { fullName } },
  });
  if (error) throw new Error(error.message);
  return data?.user;
}
