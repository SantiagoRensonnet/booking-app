import { filenameAddUniqueSuffix } from "../utils/helpers";
import supabase, { supabaseUrl } from "./supabase";
export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");
  if (error) throw new Error("Cabins could not be loaded");

  return data;
}
export async function deleteCabin(id) {
  const { error } = await supabase.from("cabins").delete().eq("id", id);
  if (error) throw new Error(`Cabin could not be deleted, ${error.message}`);
}

export async function updateCabin(cabin, cabinId) {  
  const hasUserUploadedImage = !(
    typeof cabin.image === "string" && cabin?.image?.startsWith(supabaseUrl)
  );  
  const relativePath = hasUserUploadedImage
    ? filenameAddUniqueSuffix(cabin.image[0].name.replaceAll("/", "-"))
    : null;
  const absolutePath = hasUserUploadedImage
    ? `${supabaseUrl}/storage/v1/object/public/cabin-images/${relativePath}`
    : cabin.image;

  // Upload or replace image
  if (hasUserUploadedImage) {    
    const { error: fileError } = await supabase.storage
      .from("cabin-images")
      .upload(relativePath, cabin.image[0]);

    if (fileError)
      throw new Error(
        `Cabin ${cabin?.name} could not be ${cabinId ? "updated" : "added"}, ${
          fileError.message
        }`
      );

    if (cabinId) {
      //delete previous image
      // const { error: fileError } = await supabase.storage
      //   .from("cabin-images")
      //   .remove([getFilename(cabin.image)]);
      // if (fileError)
      //   throw new Error(
      //     `Cabin ${cabin?.name} could not be ${
      //       cabinId ? "updated" : "added"
      //     }, ${fileError.message}`
      //   );
    }
  }

  let query = supabase.from("cabins");

  if (cabinId)
    query = query.update({ ...cabin, image: absolutePath }).eq("id", cabinId);
  else query = query.insert([{ ...cabin, image: absolutePath }]);

  const { data: cabinData, error: cabinError } = await query.select().single();
  if (cabinError)
    throw new Error(
      `Cabin ${cabin.name} could not be ${cabinId ? "updated" : "added"}, ${
        cabinError.message
      }`
    );

  if (cabinData) return cabinData;
}
